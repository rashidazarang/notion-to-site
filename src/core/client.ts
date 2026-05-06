import { Client, isFullPage } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client'

export class NotionClient {
  public readonly notion: Client

  constructor(opts?: { apiKey?: string }) {
    const apiKey = opts?.apiKey ?? process.env.NOTION_API_KEY
    if (!apiKey) {
      throw new Error(
        'Notion API key is required. Pass { apiKey } or set NOTION_API_KEY environment variable.'
      )
    }
    this.notion = new Client({
      auth: apiKey,
      notionVersion: '2022-06-28',
    })
  }

  async queryDatabase(databaseId: string, startCursor?: string) {
    const response = await this.notion.dataSources.query({
      data_source_id: databaseId,
      start_cursor: startCursor,
      page_size: 100,
    })
    const results = response.results.filter(isFullPage) as PageObjectResponse[]
    return {
      results,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    }
  }

  async *paginateDatabase(databaseId: string): AsyncGenerator<PageObjectResponse> {
    let startCursor: string | undefined
    do {
      const { results, hasMore, nextCursor } = await this.queryDatabase(databaseId, startCursor)
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
