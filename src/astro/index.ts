/**
 * `notion-to-site/astro` — an Astro Content Layer loader. Use it directly in a
 * collection definition; no `nts sync` step and no intermediate files:
 *
 * ```ts
 * // src/content.config.ts
 * import { defineCollection } from 'astro:content'
 * import { notionLoader } from 'notion-to-site/astro'
 *
 * const blog = defineCollection({
 *   loader: notionLoader({ database: process.env.NOTION_DATABASE_ID }),
 * })
 * export const collections = { blog }
 * ```
 */
import { sync } from '../core/sync.js'
import type { NtxConfig, NtxQueryFilter, SyncedPage } from '../types.js'

// ── Minimal structural types for Astro's Content Layer API ───────────────────
// We intentionally do not depend on `astro` at build time — it is an optional
// peer dependency. These mirror the stable parts of the loader contract.

export interface AstroDataStore {
  set(entry: {
    id: string
    data: Record<string, unknown>
    body?: string
    rendered?: { html: string }
    digest?: string
  }): void
  clear(): void
}

export interface AstroLoaderContext {
  store: AstroDataStore
  logger?: { info(message: string): void; warn(message: string): void }
  parseData(input: {
    id: string
    data: Record<string, unknown>
  }): Promise<Record<string, unknown>>
  /** Available in Astro 5+. Renders markdown to the shape `rendered` expects. */
  renderMarkdown?(content: string): Promise<{ html: string }>
}

export interface AstroLoader {
  name: string
  load(context: AstroLoaderContext): Promise<void>
}

export interface NotionLoaderOptions {
  /** Your Notion database ID. */
  database: string
  /** Explicit data source ID, for a database with more than one. */
  dataSource?: string
  /** A Notion query filter, forwarded as-is to the data source query. */
  filter?: NtxQueryFilter
  /** URL prefix for resolved internal Notion links. Default `'/blog'`. */
  linkPrefix?: string
}

/**
 * Maps the pages from a sync into an Astro content store. Exported for testing
 * — `notionLoader().load` is thin glue over `sync()` and this.
 */
export async function populateStore(
  pages: SyncedPage[],
  context: AstroLoaderContext,
): Promise<void> {
  context.store.clear()
  for (const page of pages) {
    let data: Record<string, unknown>
    try {
      data = await context.parseData({ id: page.slug, data: page.frontmatter })
    } catch (err: any) {
      // A schema mismatch on one page shouldn't fail the whole build.
      context.logger?.warn(`notion-to-site: ${page.slug} failed schema validation — ${err.message}`)
      data = page.frontmatter
    }
    const entry: Parameters<AstroDataStore['set']>[0] = {
      id: page.slug,
      data,
      body: page.content,
    }
    if (typeof context.renderMarkdown === 'function') {
      try {
        entry.rendered = await context.renderMarkdown(page.content)
      } catch {
        // renderMarkdown unavailable/failed — the raw body is still set, so the
        // entry is usable; only `<Content />` rendering is unavailable.
      }
    }
    context.store.set(entry)
  }
}

/** Creates an Astro Content Layer loader backed by a Notion database. */
export function notionLoader(options: NotionLoaderOptions): AstroLoader {
  return {
    name: 'notion-to-site',
    async load(context: AstroLoaderContext): Promise<void> {
      const config: NtxConfig = {
        database: options.database,
        dataSource: options.dataSource,
        // Unused — the loader runs an in-memory sync (write: false).
        output: '.notion-to-site/astro',
        adapter: 'markdown',
        linkPrefix: options.linkPrefix ?? '/blog',
        images: { download: false, outputDir: './public/images', format: 'webp', quality: 80 },
        schema: { strict: false },
        ...(options.filter ? { query: { filter: options.filter } } : {}),
      }
      const result = await sync({
        config,
        write: false,
        log: (m) => context.logger?.info(`notion-to-site: ${m}`),
      })
      await populateStore(result.pages, context)
    },
  }
}
