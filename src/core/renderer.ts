import { NotionToMarkdown } from 'notion-to-md'
import type { NotionClient } from './client.js'

export class NtxRenderer {
  private n2m: NotionToMarkdown
  private client: NotionClient

  constructor(client: NotionClient) {
    this.client = client
    this.n2m = new NotionToMarkdown({ notionClient: client.notion })

    this.registerTransformers()
  }

  private registerTransformers() {
    this.n2m.setCustomTransformer('image', async (block) => {
      return `![image](notion:${block.id})`
    })

    this.n2m.setCustomTransformer('callout', async (block) => {
      const callout = (block as any).callout
      const emoji = callout.icon?.emoji ?? '💡'
      const texts = callout.rich_text?.map((t: any) => t.plain_text).join('') ?? ''
      return `> ${emoji} ${texts}`
    })

    this.n2m.setCustomTransformer('column_list', async () => {
      return ''
    })

    this.n2m.setCustomTransformer('column', async () => {
      return '\n---\n'
    })

    this.n2m.setCustomTransformer('table', async (block) => {
      const children = await this.client.getPageBlocks(block.id)
      const rows = children
        .filter((child: any) => child.type === 'table_row')
        .map((child: any) => child.table_row.cells as any[][])

      if (rows.length === 0) return ''

      const toText = (cells: any[][]) =>
        cells.map((cell) => cell.map((t: any) => t.plain_text).join('')).join(' | ')

      const header = `| ${toText(rows[0])} |`
      const separator = `| ${rows[0].map(() => '---').join(' | ')} |`
      const body = rows
        .slice(1)
        .map((row: any[][]) => `| ${toText(row)} |`)
        .join('\n')

      return [header, separator, body].filter(Boolean).join('\n')
    })

    this.n2m.setCustomTransformer('embed', async (block) => {
      const url = (block as any).embed?.url ?? ''
      return url ? `[Embedded content](${url})` : ''
    })

    this.n2m.setCustomTransformer('video', async (block) => {
      const url = (block as any).video?.external?.url ?? (block as any).video?.file?.url ?? ''
      return url ? `[Video](${url})` : ''
    })
  }

  async renderPage(pageId: string): Promise<string> {
    const blocks = await this.n2m.pageToMarkdown(pageId)
    return this.n2m.toMarkdownString(blocks).parent
  }
}
