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
  }
  schema: {
    strict: boolean
  }
  sync?: {
    concurrency: number
    deletions: boolean
  }
  content?: {
    toc: boolean
    stripBackLinks: boolean
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
