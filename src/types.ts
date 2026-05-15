/**
 * Query-time filter pushed to Notion's `/v1/databases/{id}/query` endpoint.
 *
 * Mirrors Notion's filter object shape — supports the common property
 * filters and the `and` / `or` composers. Pass-through: notion-to-site
 * does not validate the filter against the database schema; if Notion
 * rejects it, the sync fails with the API error.
 *
 * Reference: https://developers.notion.com/reference/post-database-query-filter
 */
export interface NtxQueryFilter {
  property?: string
  multi_select?: { contains?: string; does_not_contain?: string; is_empty?: true; is_not_empty?: true }
  select?: { equals?: string; does_not_equal?: string; is_empty?: true; is_not_empty?: true }
  checkbox?: { equals?: boolean; does_not_equal?: boolean }
  rich_text?: { equals?: string; contains?: string; starts_with?: string; ends_with?: string; is_empty?: true; is_not_empty?: true }
  number?: { equals?: number; greater_than?: number; less_than?: number; is_empty?: true; is_not_empty?: true }
  status?: { equals?: string; does_not_equal?: string }
  and?: NtxQueryFilter[]
  or?: NtxQueryFilter[]
}

/** A single synced page — the unit returned by `sync()` and emitted into the content module. */
export interface SyncedPage {
  /** The page's slug (also its output filename). */
  slug: string
  /** The page's frontmatter — the legacy nested shape or the flat typed shape. */
  frontmatter: Record<string, any>
  /** The rendered page body (markdown). */
  content: string
}

/** How Notion text/background colors are rendered in rich text. */
export type ColorStrategy = 'drop' | 'inline' | 'class'

/**
 * A custom block transformer. Returns a markdown string for the block, or
 * `false` to fall back to the built-in handling. Mirrors notion-to-md's
 * `setCustomTransformer` contract.
 */
export type BlockTransformer = (block: any) => string | false | Promise<string | false>

export interface NtxConfig {
  database: string
  /**
   * Explicit data source ID. As of Notion API version 2025-09-03 a database
   * can contain more than one data source; set this to pick a specific one.
   * Optional — with a single data source (the common case) it is resolved
   * automatically from `database`.
   */
  dataSource?: string
  output: string
  adapter: 'markdown' | 'mdx' | 'json'
  author?: string
  linkPrefix?: string
  images: {
    download: boolean
    outputDir: string
    format: 'webp' | 'original'
    quality: number
    /**
     * Generate a tiny base64 blur placeholder for every downloaded image.
     * Surfaced via `.notion-to-site/images.json` for the `<NotionImage>`
     * server component (Next.js integration) and any custom consumer.
     */
    placeholder?: boolean
    /**
     * Emit resized variants at the given widths (px) alongside the full-size
     * webp. Never enlarges past the source. Each variant lives at
     * `/images/<hash>-<width>.webp`; sizes never enlarge past the source.
     */
    sizes?: number[]
  }
  schema: {
    strict: boolean
    /**
     * `'typed'` (default since 1.0) introspects your Notion database, generates
     * TypeScript types from its real property schema, and emits a flat,
     * faithful frontmatter shape. `'legacy'` keeps the pre-1.0 blog-shaped
     * nested `meta.*` frontmatter.
     */
    mode?: 'legacy' | 'typed'
    /**
     * Where `nts types` (and a typed `nts sync`) writes the generated schema
     * module. Default `'./.notion-to-site/types.ts'`.
     */
    typesOutput?: string
  }
  sync?: {
    concurrency: number
    deletions: boolean
  }
  content?: {
    toc: boolean
    stripBackLinks: boolean
    /**
     * How to render Notion's text/background colors in rich text.
     * `'drop'` (default) ignores them, `'inline'` emits `<span style>`,
     * `'class'` emits `<span class="notion-color-...">`.
     */
    color?: ColorStrategy
    /**
     * Per-block-type rendering overrides. Keyed by Notion block type
     * (e.g. `'paragraph'`, `'callout'`). A transformer returns a markdown
     * string, or `false` to fall back to the built-in handling.
     */
    transformers?: Record<string, BlockTransformer>
  }
  watch?: {
    interval: number
  }
  /**
   * Query-time controls. `filter` is forwarded to Notion as-is so you can
   * sync a subset of a database (e.g. only pages where a multi-select tag
   * contains a specific value). `page_size` overrides the default 100.
   */
  query?: {
    filter?: NtxQueryFilter
    page_size?: number
  }
}
