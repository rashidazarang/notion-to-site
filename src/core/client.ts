import { Client, isFullPage } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client'
import type { NtxQueryFilter } from '../types.js'

export interface QueryOptions {
  filter?: NtxQueryFilter
  pageSize?: number
}

export class NotionClient {
  public readonly notion: Client

  constructor(opts?: { apiKey?: string }) {
    const apiKey = opts?.apiKey ?? process.env.NOTION_API_KEY
    if (!apiKey) {
      throw new Error(
        'Notion API key is required. Pass { apiKey } or set NOTION_API_KEY environment variable.'
      )
    }
    this.notion = new Client({ auth: apiKey, notionVersion: '2022-06-28' })
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

  async *paginateDatabase(databaseId: string, options?: QueryOptions): AsyncGenerator<PageObjectResponse> {
    let startCursor: string | undefined
    do {
      const { results, hasMore, nextCursor } = await this.queryDatabase(databaseId, startCursor, options)
      for (const page of results) {
        yield page
      }
      startCursor = hasMore && nextCursor ? nextCursor : undefined
    } while (startCursor)
  }

  async getPageBlocks(pageId: string) {
    const response = await this.notion.blocks.children.list({ block_id: pageId })
    return response.results
  }
}
