import {
  Client,
  isFullPage,
  isFullDatabase,
  isFullDataSource,
  collectPaginatedAPI,
} from '@notionhq/client'
import type { PageObjectResponse, ListBlockChildrenParameters } from '@notionhq/client'
import type { NtxQueryFilter } from '../types.js'

export interface QueryOptions {
  filter?: NtxQueryFilter
  pageSize?: number
  /** Explicit data source ID, for the rare database with more than one. */
  dataSource?: string
}

/**
 * Returns an async gate that spaces successive calls by at least
 * `minIntervalMs`. Used to keep request *starts* under Notion's ~3 req/s
 * rate limit while still allowing concurrent in-flight requests.
 */
export function makeThrottle(minIntervalMs: number): () => Promise<void> {
  let nextAllowed = 0
  return async () => {
    const now = Date.now()
    const wait = Math.max(0, nextAllowed - now)
    nextAllowed = Math.max(now, nextAllowed) + minIntervalMs
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
  }
}

// ~3 requests/second, comfortably under Notion's published rate limit.
const REQUEST_INTERVAL_MS = 350

// Notion API version. 2025-09-03 introduced the data-source model that
// replaced direct database queries; the installed SDK targets it natively.
const NOTION_VERSION = '2025-09-03'

export class NotionClient {
  public readonly notion: Client
  private readonly dataSourceCache = new Map<string, string>()

  constructor(opts?: { apiKey?: string }) {
    const apiKey = opts?.apiKey ?? process.env.NOTION_API_KEY
    if (!apiKey) {
      throw new Error(
        'Notion API key is required. Pass { apiKey } or set NOTION_API_KEY environment variable.',
      )
    }
    const throttle = makeThrottle(REQUEST_INTERVAL_MS)
    this.notion = new Client({
      auth: apiKey,
      notionVersion: NOTION_VERSION,
      timeoutMs: 60_000,
      // The SDK retries 429s (honoring Retry-After) and 5xx with exponential
      // backoff. Configured here so every call — including notion-to-md's —
      // is covered.
      retry: { maxRetries: 5, initialRetryDelayMs: 1_000, maxRetryDelayMs: 60_000 },
      // Proactively space request starts so we hit far fewer 429s to begin with.
      fetch: (async (url: string, init?: RequestInit) => {
        await throttle()
        return fetch(url, init)
      }) as any,
    })
  }

  /**
   * Resolves a Notion database ID to its data source ID. As of API version
   * 2025-09-03 a database can hold multiple data sources; the common case is
   * exactly one. Pass `override` (config `dataSource`) to pick a specific one.
   * Resolved IDs are cached for the lifetime of the client.
   */
  async resolveDataSource(databaseId: string, override?: string): Promise<string> {
    if (override) return override
    const cached = this.dataSourceCache.get(databaseId)
    if (cached) return cached

    const db = await this.notion.databases.retrieve({ database_id: databaseId })
    if (!isFullDatabase(db) || db.data_sources.length === 0) {
      throw new Error(
        `Database ${databaseId} has no accessible data sources. ` +
          `Make sure your Notion integration is shared with the database.`,
      )
    }
    if (db.data_sources.length > 1) {
      console.warn(
        `Database ${databaseId} has ${db.data_sources.length} data sources; ` +
          `using "${db.data_sources[0].name}". Set \`dataSource\` in your config ` +
          `to pick a specific one.`,
      )
    }
    const id = db.data_sources[0].id
    this.dataSourceCache.set(databaseId, id)
    return id
  }

  /** One page of results from a data source query. */
  async queryDataSource(dataSourceId: string, startCursor?: string, options?: QueryOptions) {
    const response = await this.notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: startCursor,
      page_size: options?.pageSize ?? 100,
      ...(options?.filter ? { filter: options.filter as any } : {}),
    })
    const results = response.results.filter(isFullPage) as PageObjectResponse[]
    return {
      results,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    }
  }

  /** Iterates every page of a database, resolving it to its data source first. */
  async *paginateDatabase(
    databaseId: string,
    options?: QueryOptions,
  ): AsyncGenerator<PageObjectResponse> {
    const dataSourceId = await this.resolveDataSource(databaseId, options?.dataSource)
    let startCursor: string | undefined
    do {
      const { results, hasMore, nextCursor } = await this.queryDataSource(
        dataSourceId,
        startCursor,
        options,
      )
      for (const page of results) {
        yield page
      }
      startCursor = hasMore && nextCursor ? nextCursor : undefined
    } while (startCursor)
  }

  /**
   * Retrieves a data source's property schema — the typed map of property
   * name → configuration. This is the input to TypeScript type generation.
   */
  async retrieveDataSourceSchema(dataSourceId: string) {
    const ds = await this.notion.dataSources.retrieve({ data_source_id: dataSourceId })
    if (!isFullDataSource(ds)) {
      throw new Error(`Data source ${dataSourceId} returned an incomplete response.`)
    }
    return ds.properties
  }

  /** Fetches *all* child blocks of a page/block, paginating past the 100-block limit. */
  async getPageBlocks(pageId: string) {
    return collectPaginatedAPI(
      (args: ListBlockChildrenParameters) => this.notion.blocks.children.list(args),
      { block_id: pageId },
    )
  }
}
