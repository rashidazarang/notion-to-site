#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config({ quiet: true })
dotenv.config({ path: '.env.local', override: true, quiet: true })

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import * as path from 'path'
import * as fs from 'fs'
import matter from 'gray-matter'

import { loadConfig } from './config.js'
import { NotionClient } from './core/client.js'
import { NtxRenderer } from './core/renderer.js'
import { loadState, saveState, needsUpdate, recordPage } from './core/state.js'
import { MarkdownAdapter } from './adapters/markdown.js'
import { MdxAdapter } from './adapters/mdx.js'
import { JsonAdapter } from './adapters/json.js'
import { extractProperties, PostFrontmatterSchema, validateFrontmatter } from './schema.js'
import type { PostFrontmatter } from './schema.js'
import {
  detectLanguage,
  extractComment,
  slugify,
  resolveNotionLinks,
  stripBackLinks,
  generateToc,
  extractDescription,
  computeReadingTime,
  computeWordCount,
} from './pipeline/content.js'

// ── Image resolution ──────────────────────────────────────────────────────────

async function resolveImagePlaceholders(
  content: string,
  slug: string,
  imageDir: string,
  quality: number = 80,
  download: boolean = false,
): Promise<string> {
  const { processImage, ImageFetchError } = await import('./pipeline/images.js')
  const placeholderRe = /!\[([^\]]*)\]\(ntx-img:[^:]+:([^)]+)\)/g

  const matches = [...content.matchAll(placeholderRe)]
  if (matches.length === 0) return content

  let out = content
  for (const m of matches) {
    const caption = m[1]
    const rawUrl = decodeURIComponent(m[2])
    if (download) {
      try {
        const result = await processImage({ url: rawUrl, outputDir: imageDir, quality })
        out = out.replace(m[0], `![${caption}](${result.urlPath})`)
      } catch (err) {
        if (err instanceof ImageFetchError && err.transient) {
          // Transient failure — keep the image by falling back to the remote URL.
          try {
            const u = new URL(rawUrl)
            out = out.replace(m[0], `![${caption}](${u.origin + u.pathname})`)
            console.warn(chalk.yellow(`  image download failed (transient) — kept remote URL for ${slug}`))
          } catch {
            out = out.replace(m[0], '')
          }
        } else {
          // Permanent failure (404/410) or processing error — drop the image.
          console.warn(chalk.yellow(`  image unavailable — removed from ${slug}`))
          out = out.replace(m[0], '')
        }
      }
    } else {
      try {
        const u = new URL(rawUrl)
        const cleanUrl = u.origin + u.pathname
        out = out.replace(m[0], `![${caption}](${cleanUrl})`)
      } catch {
        out = out.replace(m[0], '')
      }
    }
  }
  return out
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
          .finally(() => { running--; next() })
      })
      next()
    })
  }
}

// ── Sync ──────────────────────────────────────────────────────────────────────

async function runSync(opts: { incremental?: boolean; db?: string }): Promise<void> {
  const config = await loadConfig()
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

  const databaseId = opts.db ?? config.database

  // ── Pass 1: collect all pages + build slugMap ────────────────────────────
  const queryOpts = {
    filter: config.query?.filter,
    pageSize: config.query?.page_size,
    dataSource: config.dataSource,
  }
  if (queryOpts.filter) {
    console.log(chalk.gray('Fetching page list with filter…'))
  } else {
    console.log(chalk.gray('Fetching page list…'))
  }
  const allPages: { page: any; slug: string }[] = []

  for await (const page of client.paginateDatabase(databaseId, queryOpts)) {
    const props = extractProperties(page)
    if (!props.title) continue
    // Prefer Notion slug property, fall back to slugified title
    const slug = props.slug ?? slugify(props.title)
    if (slug) allPages.push({ page, slug })
  }

  // Build pageId → slug map (both dashed and hex forms)
  const slugMap = new Map<string, string>()
  for (const { page, slug } of allPages) {
    slugMap.set(page.id, slug)
    slugMap.set(page.id.replace(/-/g, ''), slug)
  }
  // Give renderer access for link_to_page transformer
  renderer.slugMap = slugMap
  renderer.linkPrefix = linkPrefix

  console.log(chalk.gray(`Found ${allPages.length} pages. Syncing with concurrency=${concurrency}…`))

  // ── Pass 2: sync each page (parallel) ───────────────────────────────────
  const limit = makeLimiter(concurrency)
  const seenSlugs = new Set<string>()
  let synced = 0
  let skipped = 0
  let failures = 0
  let sinceFlush = 0
  const startTime = Date.now()

  const tasks = allPages.map(({ page, slug }) =>
    limit(async () => {
      seenSlugs.add(slug)

      if (opts.incremental && !needsUpdate(state, page.id, page.last_edited_time)) {
        skipped++
        return
      }

      const spinner = ora({ text: `Syncing ${slug}…`, isSilent: concurrency > 1 }).start()

      try {
        let content = await renderer.renderPage(page.id)

        // Image resolution
        content = await resolveImagePlaceholders(
          content, slug,
          path.resolve(config.images.outputDir),
          config.images.quality ?? 80,
          config.images.download,
        )

        // Internal link resolution
        content = resolveNotionLinks(content, slugMap, linkPrefix)

        // Strip Notion back-navigation links
        if (doStrip) content = stripBackLinks(content)

        // TOC injection
        if (doToc) {
          const toc = generateToc(content)
          if (toc) {
            // Insert after first heading
            const firstH = content.indexOf('\n## ')
            if (firstH !== -1) {
              content = content.slice(0, firstH + 1) + toc + content.slice(firstH + 1)
            }
          }
        }

        // Property extraction
        const props = extractProperties(page)
        const language = props.language || detectLanguage(content)
        const comment = extractComment(content, props.title)
        const description = props.description || extractDescription(content)
        const reading_time = computeReadingTime(content)
        const word_count = computeWordCount(content)
        const author = props.author || configAuthor

        const createdDate = page.created_time.split('T')[0]
        const lastEditedDate = page.last_edited_time.split('T')[0]

        const frontmatter: PostFrontmatter = {
          id: slug,
          path: `/${config.output.replace(/^\.\//, '')}/${slug}.md`,
          type: props.post_type?.toLowerCase() || 'post',
          intent: '',
          version: '1.0',
          created: createdDate,
          last_updated: lastEditedDate,
          source: { platform: 'notion', page_id: page.id },
          meta: {
            title: props.title,
            seo_title: props.seo_title || props.title,
            author,
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
            reading_time,
            word_count,
            comment,
            cover_image: props.cover_image,
            domain_tags: props.domain_tags,
          },
        }

        if (config.schema.strict) validateFrontmatter(frontmatter)

        adapter.write(slug, frontmatter, content, outputDir)

        recordPage(state, {
          pageId: page.id,
          slug,
          lastEditedTime: page.last_edited_time,
          outputPath: path.join(outputDir, slug + '.md'),
          imageHashes: {},
        })

        spinner.succeed(chalk.green(`✓ ${slug}`))
        synced++
        // Flush progress periodically so a crash mid-sync doesn't lose everything.
        if (++sinceFlush >= 20) {
          sinceFlush = 0
          saveState(outputDir, state)
        }
      } catch (err: any) {
        spinner.fail(chalk.red(`✗ ${slug}: ${err.message}`))
        failures++
      }
    })
  )

  await Promise.all(tasks)

  // ── Deletion sync ────────────────────────────────────────────────────────
  // Only delete orphaned files after a clean full sync. A page that failed to
  // fetch this run looks "unseen" — deleting it on a transient error is data loss.
  if (!opts.incremental && failures === 0) {
    if (doDeletions) {
      const ext = config.adapter === 'mdx' ? '.mdx' : config.adapter === 'json' ? '.json' : '.md'
      const existingFiles = fs.existsSync(outputDir)
        ? fs.readdirSync(outputDir).filter(f => f.endsWith(ext))
        : []
      let deleted = 0
      for (const file of existingFiles) {
        const fileSlug = file.replace(ext, '')
        if (!seenSlugs.has(fileSlug)) {
          fs.unlinkSync(path.join(outputDir, file))
          deleted++
        }
      }
      if (deleted > 0) console.log(chalk.yellow(`Deleted ${deleted} orphaned file(s)`))
    }
    state.lastFullSync = new Date().toISOString()
  } else if (!opts.incremental && doDeletions && failures > 0) {
    console.log(chalk.yellow(`Skipped deletion pass — ${failures} page(s) failed this run`))
  }

  saveState(outputDir, state)

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const failMsg = failures > 0 ? chalk.red(`, ${failures} failed`) : ''
  console.log(chalk.blue(`\nSynced ${synced} pages (${skipped} skipped${failMsg}) in ${elapsed}s`))

  if (failures > 0) {
    throw new Error(`${failures} page(s) failed to sync`)
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const pkg = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'),
) as { version: string }

const program = new Command()
program
  .name('nts')
  .description('Notion to Site — sync any Notion database to local content files')
  .version(pkg.version)

program
  .command('init')
  .description('Create nts.config.js in the current directory')
  .action(async () => {
    const target = path.join(process.cwd(), 'nts.config.js')
    if (fs.existsSync(target)) {
      console.error(chalk.red('nts.config.js already exists. Delete it first to reinitialize.'))
      process.exit(1)
    }
    const template = `// nts.config.js — edit before running nts sync
export default {
  database: 'YOUR_NOTION_DATABASE_ID',
  output: './content',
  adapter: 'markdown',
  author: 'Your Name',
  linkPrefix: '/blog',
  images: { download: true, outputDir: './public/images', format: 'webp', quality: 80 },
  schema: { strict: false },
  sync: { concurrency: 5, deletions: true },
  content: { toc: false, stripBackLinks: true },
}
`
    fs.writeFileSync(target, template, 'utf-8')
    console.log(chalk.green('✓ Created nts.config.js — edit it before running nts sync'))
  })

program
  .command('sync')
  .description('Sync Notion database to local content files')
  .option('--incremental', 'Only sync pages changed since last run', false)
  .option('--db <id>', 'Override the database ID from config')
  .action(async (opts) => {
    await runSync(opts)
  })

program
  .command('watch')
  .description('Poll and incrementally sync on interval')
  .option('--interval <seconds>', 'Poll interval in seconds', '60')
  .action(async (opts) => {
    const intervalSec = parseInt(opts.interval, 10)
    console.log(chalk.blue(`Watching (interval=${intervalSec}s, Ctrl+C to stop)…`))
    let running = false
    const tick = async () => {
      if (running) {
        console.log(chalk.gray('  (previous sync still running — skipping this tick)'))
        return
      }
      running = true
      console.log(chalk.gray(`[${new Date().toISOString()}] Polling…`))
      try { await runSync({ incremental: true }) }
      catch (err: any) { console.error(chalk.red(`Error: ${err.message}`)) }
      finally { running = false }
    }
    await tick()
    setInterval(tick, intervalSec * 1000)
  })

program
  .command('validate')
  .description('Validate all output files against Zod schema')
  .action(async () => {
    const config = await loadConfig()
    const outputDir = path.resolve(config.output)
    const ext = config.adapter === 'mdx' ? '.mdx' : config.adapter === 'json' ? '.json' : '.md'

    if (!fs.existsSync(outputDir)) {
      console.error(chalk.red(`Output directory does not exist: ${outputDir}`))
      process.exit(1)
    }

    const files = fs.readdirSync(outputDir).filter(f => f.endsWith(ext))
    let failures = 0

    for (const file of files) {
      const slug = file.replace(ext, '')
      const raw = fs.readFileSync(path.join(outputDir, file), 'utf-8')

      let data: unknown
      if (ext === '.json') {
        data = (JSON.parse(raw) as any).frontmatter
      } else if (ext === '.mdx') {
        const match = raw.match(/export const meta = (\{[\s\S]*?\n\})/)
        if (!match) { console.log(chalk.red(`✗ ${slug}: no meta export`)); failures++; continue }
        try { data = JSON.parse(match[1]) } catch (e: any) {
          console.log(chalk.red(`✗ ${slug}: invalid JSON — ${e.message}`)); failures++; continue
        }
      } else {
        data = matter(raw).data
      }

      const result = PostFrontmatterSchema.safeParse(data)
      if (result.success) {
        console.log(chalk.green(`✓ ${slug}`))
      } else {
        const msg = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
        console.log(chalk.red(`✗ ${slug}: ${msg}`))
        failures++
      }
    }

    if (failures > 0) { console.error(chalk.red(`\n${failures} file(s) failed`)); process.exit(1) }
    console.log(chalk.blue(`\nAll ${files.length} files valid`))
  })

program
  .command('status')
  .description('Show sync state and statistics')
  .action(async () => {
    const config = await loadConfig()
    const outputDir = path.resolve(config.output)
    const state = loadState(outputDir)
    const ext = config.adapter === 'mdx' ? '.mdx' : config.adapter === 'json' ? '.json' : '.md'

    console.log(chalk.bold('\nnts status'))
    console.log(`  Output dir:     ${outputDir}`)
    console.log(`  Last full sync: ${state.lastFullSync ?? 'never'}`)
    console.log(`  Tracked pages:  ${Object.keys(state.pages).length}`)

    let published = 0; let other = 0; let stale = 0
    for (const entry of Object.values(state.pages)) {
      const fp = path.join(outputDir, entry.slug + ext)
      if (!fs.existsSync(fp)) { stale++; continue }
      try {
        const raw = fs.readFileSync(fp, 'utf-8')
        const data: any = ext === '.json'
          ? JSON.parse(raw).frontmatter
          : ext === '.mdx'
            ? (() => { const m = raw.match(/export const meta = (\{[\s\S]*?\n\})/); return m ? JSON.parse(m[1]) : {} })()
            : matter(raw).data
        if (data?.meta?.status === 'Published') published++; else other++
      } catch { other++ }
    }

    console.log(`  Published:      ${published}`)
    console.log(`  Other status:   ${other}`)
    console.log(`  Stale entries:  ${stale}\n`)
  })

program.parseAsync(process.argv).catch((err: any) => {
  console.error(chalk.red(`Error: ${err.message}`))
  process.exit(1)
})
