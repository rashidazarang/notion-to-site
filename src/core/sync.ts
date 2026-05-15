/**
 * The sync engine — `sync()` is the programmatic entry point behind the
 * `nts sync` / `nts watch` commands and the framework integrations. It is
 * pure of CLI concerns: it takes a config, returns a `SyncResult`, and logs
 * through an injectable `log` callback.
 */
import * as path from 'path'
import * as fs from 'fs'

import { NotionClient } from './client.js'
import { NtxRenderer } from './renderer.js'
import { loadState, saveState, needsUpdate, recordPage } from './state.js'
import { MarkdownAdapter } from '../adapters/markdown.js'
import { MdxAdapter } from '../adapters/mdx.js'
import { JsonAdapter } from '../adapters/json.js'
import { extractProperties, extractPropertiesTyped, validateFrontmatter } from '../schema.js'
import type { PostFrontmatter } from '../schema.js'
import { introspectSchema, type NtsSchema } from '../typegen/introspect.js'
import { emitTypes } from '../typegen/emit.js'
import { emitContentModule } from '../content/emit-module.js'
import type { NtxConfig, SyncedPage } from '../types.js'
import {
  detectLanguage,
  extractComment,
  slugify,
  uniquifySlug,
  resolveNotionLinks,
  stripBackLinks,
  generateToc,
  extractDescription,
  computeReadingTime,
  computeWordCount,
} from '../pipeline/content.js'

export type { SyncedPage }

export interface SyncResult {
  synced: number
  skipped: number
  failures: number
  deleted: number
  pages: SyncedPage[]
}

export interface SyncOptions {
  config: NtxConfig
  /** Only sync pages changed since the last run. */
  incremental?: boolean
  /** Override the database ID from config. */
  db?: string
  /**
   * Write output to disk — adapter files, `.nts-state.json`, the content
   * module. Default `true`. Pass `false` for an in-memory sync (the framework
   * integrations read `SyncResult.pages` directly).
   */
  write?: boolean
  /** Progress logger. Defaults to `console.log`. */
  log?: (message: string) => void
}

// ── Image resolution ──────────────────────────────────────────────────────────

interface ImagesConfig {
  quality?: number
  download: boolean
  placeholder?: boolean
  sizes?: number[]
}

interface ResolvedImages {
  content: string
  /** Canonical URL → content hash, persisted into `state.imageHashes`. */
  hashes: Record<string, string>
  /** Final `urlPath` → image metadata, for the global `images.json` manifest. */
  metadata: Record<string, { placeholder?: string; sizes?: Array<{ width: number; urlPath: string }> }>
}

async function resolveImagePlaceholders(
  content: string,
  slug: string,
  imageDir: string,
  imagesConfig: ImagesConfig,
): Promise<ResolvedImages> {
  const { processImage, ImageFetchError } = await import('../pipeline/images.js')
  const placeholderRe = /!\[([^\]]*)\]\(ntx-img:[^:]+:([^)]+)\)/g

  const matches = [...content.matchAll(placeholderRe)]
  if (matches.length === 0) return { content, hashes: {}, metadata: {} }

  const hashes: Record<string, string> = {}
  const metadata: Record<string, { placeholder?: string; sizes?: Array<{ width: number; urlPath: string }> }> = {}
  let out = content

  for (const m of matches) {
    const caption = m[1]
    const rawUrl = decodeURIComponent(m[2])
    if (imagesConfig.download) {
      try {
        const result = await processImage({
          url: rawUrl,
          outputDir: imageDir,
          quality: imagesConfig.quality,
          placeholder: imagesConfig.placeholder,
          sizes: imagesConfig.sizes,
        })
        out = out.replace(m[0], `![${caption}](${result.urlPath})`)
        // Record canonical URL → hash for cross-run dedup knowledge.
        try {
          const u = new URL(rawUrl)
          hashes[u.origin + u.pathname] = result.hash
        } catch {
          // Unparseable URL — skip the hash record.
        }
        // Capture placeholder/sizes metadata for the global manifest.
        if (result.placeholder || result.sizes) {
          metadata[result.urlPath] = {
            ...(result.placeholder ? { placeholder: result.placeholder } : {}),
            ...(result.sizes ? { sizes: result.sizes } : {}),
          }
        }
      } catch (err) {
        if (err instanceof ImageFetchError && err.transient) {
          // Transient failure — keep the image by falling back to the remote URL.
          try {
            const u = new URL(rawUrl)
            out = out.replace(m[0], `![${caption}](${u.origin + u.pathname})`)
            console.warn(`  image download failed (transient) — kept remote URL for ${slug}`)
          } catch {
            out = out.replace(m[0], '')
          }
        } else {
          // Permanent failure (404/410) or processing error — drop the image.
          console.warn(`  image unavailable — removed from ${slug}`)
          out = out.replace(m[0], '')
        }
      }
    } else {
      try {
        const u = new URL(rawUrl)
        out = out.replace(m[0], `![${caption}](${u.origin + u.pathname})`)
      } catch {
        out = out.replace(m[0], '')
      }
    }
  }
  return { content: out, hashes, metadata }
}

// ── Parallel limiter ─────────────────────────────────────────────────────────

function makeLimiter(concurrency: number) {
  let running = 0
  const queue: (() => void)[] = []

  function next() {
    if (running >= concurrency || queue.length === 0) return
    running++
    const fn = queue.shift()!
    fn()
  }

  return function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      queue.push(() => {
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            running--
            next()
          })
      })
      next()
    })
  }
}

// ── Frontmatter builders ─────────────────────────────────────────────────────

function buildLegacyFrontmatter(
  page: any,
  slug: string,
  content: string,
  configOutput: string,
  configAuthor: string,
): { frontmatter: PostFrontmatter; title: string } {
  const props = extractProperties(page)
  const language = props.language || detectLanguage(content)
  const comment = extractComment(content, props.title)
  const description = props.description || extractDescription(content)
  const frontmatter: PostFrontmatter = {
    id: slug,
    path: `/${configOutput.replace(/^\.\//, '')}/${slug}.md`,
    type: props.post_type?.toLowerCase() || 'post',
    intent: '',
    version: '1.0',
    created: page.created_time.split('T')[0],
    last_updated: page.last_edited_time.split('T')[0],
    source: { platform: 'notion', page_id: page.id },
    meta: {
      title: props.title,
      seo_title: props.seo_title || props.title,
      author: props.author || configAuthor,
      description,
      canonical: props.canonical,
      category: props.category,
      main_tag: props.main_tag,
      tags: props.tags,
      featured: props.featured,
      featured_at: props.featured_at,
      language,
      post_type: props.post_type,
      status: props.status,
      reading_time: computeReadingTime(content),
      word_count: computeWordCount(content),
      comment,
      cover_image: props.cover_image,
      domain_tags: props.domain_tags,
    },
  }
  return { frontmatter, title: props.title }
}

function buildTypedFrontmatter(
  page: any,
  slug: string,
  schema: NtsSchema,
): { frontmatter: Record<string, any>; title: string } {
  const props = extractPropertiesTyped(page, schema)
  const title = String(props[schema.titleProperty] ?? '')
  // `_id` (the slug) and `_notion_id` are nts-managed; user properties stay flat.
  return { frontmatter: { ...props, _id: slug, _notion_id: page.id }, title }
}

/** Introspects the data source schema and writes the generated types module. */
export async function generateTypes(
  config: NtxConfig,
  client: NotionClient,
  databaseId: string,
): Promise<NtsSchema> {
  const dataSourceId = await client.resolveDataSource(databaseId, config.dataSource)
  const rawProps = await client.retrieveDataSourceSchema(dataSourceId)
  const schema = introspectSchema(dataSourceId, rawProps)
  const typesPath = path.resolve(config.schema?.typesOutput ?? './.notion-to-site/types.ts')
  fs.mkdirSync(path.dirname(typesPath), { recursive: true })
  fs.writeFileSync(typesPath, emitTypes(schema), 'utf-8')
  return schema
}

// ── Sync ──────────────────────────────────────────────────────────────────────

export async function sync(options: SyncOptions): Promise<SyncResult> {
  const { config, incremental = false, db, write = true } = options
  const log = options.log ?? ((m: string) => console.log(m))

  const outputDir = path.resolve(config.output)
  const state = loadState(outputDir)
  const client = new NotionClient()
  const renderer = new NtxRenderer(client, {
    color: config.content?.color,
    transformers: config.content?.transformers,
  })

  const concurrency = config.sync?.concurrency ?? 5
  const doDeletions = config.sync?.deletions ?? true
  const doToc = config.content?.toc ?? false
  const doStrip = config.content?.stripBackLinks ?? true
  const configAuthor = config.author ?? ''
  const linkPrefix = config.linkPrefix ?? '/blog'

  const adapter =
    config.adapter === 'mdx'
      ? new MdxAdapter()
      : config.adapter === 'json'
        ? new JsonAdapter()
        : new MarkdownAdapter()

  const databaseId = db ?? config.database

  // ── Schema mode ──────────────────────────────────────────────────────────
  // notion-to-site 1.0 defaults to 'typed'. Set `schema.mode: 'legacy'` for the
  // pre-1.0 nested `meta.*` frontmatter shape.
  const mode = config.schema?.mode ?? 'typed'
  let ntsSchema: NtsSchema | undefined
  if (mode === 'typed') {
    log('Introspecting Notion database schema…')
    ntsSchema = await generateTypes(config, client, databaseId)
    const typesPath = path.resolve(config.schema?.typesOutput ?? './.notion-to-site/types.ts')
    log(`Generated types for ${ntsSchema.properties.length} properties → ${typesPath}`)
  }

  // ── Pass 1: collect all pages + build slugMap ────────────────────────────
  const queryOpts = {
    filter: config.query?.filter,
    pageSize: config.query?.page_size,
    dataSource: config.dataSource,
  }
  log(queryOpts.filter ? 'Fetching page list with filter…' : 'Fetching page list…')

  const allPages: { page: any; slug: string }[] = []
  const usedSlugs = new Set<string>()
  for await (const page of client.paginateDatabase(databaseId, queryOpts)) {
    let slug: string | null = null
    if (mode === 'typed' && ntsSchema) {
      const title = String(
        extractPropertiesTyped(page, ntsSchema)[ntsSchema.titleProperty] ?? '',
      )
      if (!title) continue
      slug = slugify(title)
    } else {
      const props = extractProperties(page)
      if (!props.title) continue
      slug = props.slug ?? slugify(props.title)
    }
    if (!slug) continue
    // Two pages can slugify to the same value — suffix collisions so they
    // don't silently overwrite each other's output file.
    slug = uniquifySlug(slug, usedSlugs)
    usedSlugs.add(slug)
    allPages.push({ page, slug })
  }

  const slugMap = new Map<string, string>()
  for (const { page, slug } of allPages) {
    slugMap.set(page.id, slug)
    slugMap.set(page.id.replace(/-/g, ''), slug)
  }
  renderer.slugMap = slugMap
  renderer.linkPrefix = linkPrefix

  log(`Found ${allPages.length} pages. Syncing with concurrency=${concurrency}…`)

  // ── Pass 2: sync each page (parallel) ────────────────────────────────────
  const limit = makeLimiter(concurrency)
  const seenSlugs = new Set<string>()
  const pages: SyncedPage[] = []
  // Accumulates `urlPath → { placeholder?, sizes? }` across all pages. Concurrent
  // tasks write distinct (or value-identical) entries, so plain object writes
  // are safe. Emitted as `.notion-to-site/images.json` after the sync.
  const imageManifest: Record<string, { placeholder?: string; sizes?: Array<{ width: number; urlPath: string }> }> = {}
  let synced = 0
  let skipped = 0
  let failures = 0
  let sinceFlush = 0
  const startTime = Date.now()

  const tasks = allPages.map(({ page, slug }) =>
    limit(async () => {
      seenSlugs.add(slug)

      if (incremental && !needsUpdate(state, page.id, page.last_edited_time)) {
        skipped++
        return
      }

      try {
        let content = await renderer.renderPage(page.id)

        const imageResult = await resolveImagePlaceholders(
          content,
          slug,
          path.resolve(config.images.outputDir),
          {
            quality: config.images.quality ?? 80,
            download: config.images.download,
            placeholder: config.images.placeholder,
            sizes: config.images.sizes,
          },
        )
        content = imageResult.content
        // Merge this page's image metadata into the global manifest.
        Object.assign(imageManifest, imageResult.metadata)
        content = resolveNotionLinks(content, slugMap, linkPrefix)
        if (doStrip) content = stripBackLinks(content)
        if (doToc) {
          const toc = generateToc(content)
          if (toc) {
            const firstH = content.indexOf('\n## ')
            if (firstH !== -1) {
              content = content.slice(0, firstH + 1) + toc + content.slice(firstH + 1)
            }
          }
        }

        const { frontmatter, title } =
          mode === 'typed' && ntsSchema
            ? buildTypedFrontmatter(page, slug, ntsSchema)
            : buildLegacyFrontmatter(page, slug, content, config.output, configAuthor)

        if (config.schema.strict && mode === 'legacy') {
          validateFrontmatter(frontmatter as PostFrontmatter)
        }

        // Inject an H1 from the title if the content doesn't already open with one.
        const hasH1 = /^#\s/.test(content.trimStart())
        const finalContent = hasH1 ? content : `# ${title}\n\n${content}`

        if (write) adapter.write(slug, frontmatter, finalContent, outputDir)
        pages.push({ slug, frontmatter, content: finalContent })

        recordPage(state, {
          pageId: page.id,
          slug,
          lastEditedTime: page.last_edited_time,
          outputPath: path.join(outputDir, slug + '.md'),
          imageHashes: imageResult.hashes,
        })

        synced++
        // Flush progress periodically so a crash mid-sync doesn't lose everything.
        if (write && ++sinceFlush >= 20) {
          sinceFlush = 0
          saveState(outputDir, state)
        }
      } catch (err: any) {
        log(`✗ ${slug}: ${err.message}`)
        failures++
      }
    }),
  )

  await Promise.all(tasks)

  // ── Deletion sync ────────────────────────────────────────────────────────
  // Only delete orphaned files after a clean full sync. A page that failed to
  // fetch this run looks "unseen" — deleting it on a transient error is data loss.
  let deleted = 0
  if (write && !incremental && failures === 0) {
    if (doDeletions) {
      const ext = config.adapter === 'mdx' ? '.mdx' : config.adapter === 'json' ? '.json' : '.md'
      const existingFiles = fs.existsSync(outputDir)
        ? fs.readdirSync(outputDir).filter((f) => f.endsWith(ext))
        : []
      for (const file of existingFiles) {
        if (!seenSlugs.has(file.replace(ext, ''))) {
          fs.unlinkSync(path.join(outputDir, file))
          deleted++
        }
      }
      if (deleted > 0) log(`Deleted ${deleted} orphaned file(s)`)
    }
    state.lastFullSync = new Date().toISOString()
  } else if (write && !incremental && doDeletions && failures > 0) {
    log(`Skipped deletion pass — ${failures} page(s) failed this run`)
  }

  if (write) {
    saveState(outputDir, state)
    // Emit the importable content module alongside the generated types.
    const moduleDir = path.dirname(
      path.resolve(config.schema?.typesOutput ?? './.notion-to-site/types.ts'),
    )
    const typeRef =
      mode === 'typed'
        ? { importPath: './types.js', typeName: 'NotionContent' }
        : { importPath: 'notion-to-site', typeName: 'PostFrontmatter' }
    emitContentModule(pages, moduleDir, typeRef)
    // Emit the image manifest — `<NotionImage>` looks up placeholder + sizes
    // by URL from this file. Skip when there is nothing to record.
    if (Object.keys(imageManifest).length > 0) {
      fs.mkdirSync(moduleDir, { recursive: true })
      fs.writeFileSync(
        path.join(moduleDir, 'images.json'),
        JSON.stringify(imageManifest, null, 2),
        'utf-8',
      )
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const failMsg = failures > 0 ? `, ${failures} failed` : ''
  log(`Synced ${synced} pages (${skipped} skipped${failMsg}) in ${elapsed}s`)

  return { synced, skipped, failures, deleted, pages }
}
