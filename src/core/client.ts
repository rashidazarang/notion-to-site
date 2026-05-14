import { Client, isFullPage, collectPaginatedAPI } from '@notionhq/client'
import type { PageObjectResponse, ListBlockChildrenParameters } from '@notionhq/client'
import type { NtxQueryFilter } from '../types.js'

export interface QueryOptions {
  filter?: NtxQueryFilter
  pageSize?: number
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

export class NotionClient {
  public readonly notion: Client

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
      notionVersion: '2022-06-28',
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

  async queryDatabase(databaseId: string, startCursor?: string, options?: QueryOptions) {
    const body: Record<string, unknown> = {
      start_cursor: startCursor,
      page_size: options?.pageSize ?? 100,
    }
    if (options?.filter) body.filter = options.filter

    const response = await (this.notion as any).request({
      path: `databases/${databaseId}/query`,
      method: 'POST',
      body,
    })
    const results = (response.results as any[]).filter(isFullPage) as PageObjectResponse[]
    return {
      results,
      hasMore: response.has_more as boolean,
      nextCursor: response.next_cursor as string | null,
    }
  }

  async *paginateDatabase(
    databaseId: string,
    options?: QueryOptions,
  ): AsyncGenerator<PageObjectResponse> {
    let startCursor: string | undefined
    do {
      const { results, hasMore, nextCursor } = await this.queryDatabase(
        databaseId,
        startCursor,
        options,
      )
      for (const page of results) {
        yield page
      }
      startCursor = hasMore && nextCursor ? nextCursor : undefined
    } while (startCursor)
  }

  /** Fetches *all* child blocks of a page/block, paginating past the 100-block limit. */
  async getPageBlocks(pageId: string) {
    return collectPaginatedAPI(
      (args: ListBlockChildrenParameters) => this.notion.blocks.children.list(args),
      { block_id: pageId },
    )
  }
}
