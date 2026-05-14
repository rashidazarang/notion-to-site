import { NotionToMarkdown } from 'notion-to-md'
import type { NotionClient } from './client.js'

export class NtxRenderer {
  private n2m: NotionToMarkdown
  private client: NotionClient
  slugMap: Map<string, string> = new Map()
  linkPrefix: string = '/blog'

  constructor(client: NotionClient) {
    this.client = client
    this.n2m = new NotionToMarkdown({ notionClient: client.notion })
    this.registerTransformers()
  }

  private registerTransformers() {
    // ── Images ────────────────────────────────────────────────────────────────
    this.n2m.setCustomTransformer('image', async (block) => {
      const img = (block as any).image
      const url: string = img?.file?.url ?? img?.external?.url ?? ''
      const caption: string = img?.caption?.map((t: any) => t.plain_text).join('') ?? ''
      if (!url) return ''
      const isFile = !!img?.file?.url
      return isFile
        ? `![${caption || 'image'}](ntx-img:${block.id}:${encodeURIComponent(url)})`
        : `![${caption || 'image'}](${url})`
    })

    // ── Callouts ─────────────────────────────────────────────────────────────
    this.n2m.setCustomTransformer('callout', async (block) => {
      const callout = (block as any).callout
      // Use the page's emoji icon when present; image/no icon falls back to 💡
      const emoji = callout?.icon?.emoji ?? '💡'
      const texts = callout?.rich_text?.map((t: any) => t.plain_text).join('') ?? ''
      return `> ${emoji} ${texts}`.trim()
    })

    // ── Columns — render content, don't drop it ───────────────────────────────
    this.n2m.setCustomTransformer('column_list', async (block) => {
      const columns = await this.client.getPageBlocks(block.id)
      const parts: string[] = []
      for (const col of columns) {
        if ((col as any).type !== 'column') continue
        const colBlocks = await this.n2m.pageToMarkdown(col.id)
        const colMd = this.n2m.toMarkdownString(colBlocks).parent ?? ''
        if (colMd.trim()) parts.push(colMd.trim())
      }
      return parts.join('\n\n')
    })

    this.n2m.setCustomTransformer('column', async () => '')

    // ── Tables ────────────────────────────────────────────────────────────────
    this.n2m.setCustomTransformer('table', async (block) => {
      const children = await this.client.getPageBlocks(block.id)
      const rows = children
        .filter((c: any) => c.type === 'table_row')
        .map((c: any) => c.table_row.cells as any[][])

      if (rows.length === 0) return ''
      const toText = (cells: any[][]) =>
        cells.map(cell => cell.map((t: any) => t.plain_text).join('')).join(' | ')

      const header = `| ${toText(rows[0])} |`
      const sep = `| ${rows[0].map(() => '---').join(' | ')} |`
      const body = rows.slice(1).map((r: any[][]) => `| ${toText(r)} |`).join('\n')
      return [header, sep, body].filter(Boolean).join('\n')
    })

    // ── Equations (block) → $$ KaTeX $$ ──────────────────────────────────────
    this.n2m.setCustomTransformer('equation', async (block) => {
      const expr = (block as any).equation?.expression ?? ''
      return expr ? `$$\n${expr}\n$$` : ''
    })

    // ── Toggle → HTML details/summary (renders in most markdown processors) ──
    this.n2m.setCustomTransformer('toggle', async (block) => {
      const toggle = (block as any).toggle
      const summary = toggle?.rich_text?.map((t: any) => t.plain_text).join('') ?? ''
      const children = await this.n2m.pageToMarkdown(block.id)
      const inner = this.n2m.toMarkdownString(children).parent ?? ''
      if (!summary && !inner.trim()) return ''
      return `<details>\n<summary>${summary}</summary>\n\n${inner.trim()}\n\n</details>`
    })

    // ── Synced blocks — follow source and render its content ──────────────────
    this.n2m.setCustomTransformer('synced_block', async (block) => {
      const synced = (block as any).synced_block
      // null synced_from means this IS the source block — render children normally
      const sourceId = synced?.synced_from?.block_id ?? null
      const targetId = sourceId ?? block.id
      const children = await this.n2m.pageToMarkdown(targetId)
      return this.n2m.toMarkdownString(children).parent ?? ''
    })

    // ── Bookmarks → title + URL ───────────────────────────────────────────────
    this.n2m.setCustomTransformer('bookmark', async (block) => {
      const bm = (block as any).bookmark
      const url = bm?.url ?? ''
      const caption = bm?.caption?.map((t: any) => t.plain_text).join('') ?? ''
      if (!url) return ''
      const label = caption || url
      return `[${label}](${url})`
    })

    // ── Embeds ────────────────────────────────────────────────────────────────
    this.n2m.setCustomTransformer('embed', async (block) => {
      const url = (block as any).embed?.url ?? ''
      const caption = (block as any).embed?.caption?.map((t: any) => t.plain_text).join('') ?? ''
      if (!url) return ''
      return caption ? `[${caption}](${url})` : `[${url}](${url})`
    })

    // ── Video ─────────────────────────────────────────────────────────────────
    this.n2m.setCustomTransformer('video', async (block) => {
      const vid = (block as any).video
      const isFile = !!vid?.file?.url
      const url: string = vid?.file?.url ?? vid?.external?.url ?? ''
      const caption: string = vid?.caption?.map((t: any) => t.plain_text).join('') ?? ''
      if (!url) return ''
      if (isFile) {
        // Signed S3 — strip query params to get canonical path
        try {
          const u = new URL(url)
          const clean = u.origin + u.pathname
          const label = caption || clean.split('/').pop() || 'Video'
          return `[▶ ${label}](${clean})`
        } catch {
          return caption ? `[▶ ${caption}](${url})` : `[▶ Video](${url})`
        }
      }
      return caption ? `[▶ ${caption}](${url})` : `[▶ Video](${url})`
    })

    // ── Audio ─────────────────────────────────────────────────────────────────
    this.n2m.setCustomTransformer('audio', async (block) => {
      const audio = (block as any).audio
      const url: string = audio?.file?.url ?? audio?.external?.url ?? ''
      const caption: string = audio?.caption?.map((t: any) => t.plain_text).join('') ?? ''
      if (!url) return ''
      const label = caption || 'Audio'
      return `[🔊 ${label}](${url})`
    })

    // ── File ──────────────────────────────────────────────────────────────────
    this.n2m.setCustomTransformer('file', async (block) => {
      const f = (block as any).file
      const url: string = f?.file?.url ?? f?.external?.url ?? ''
      const name: string = f?.name ?? f?.caption?.map((t: any) => t.plain_text).join('') ?? 'File'
      if (!url) return ''
      return `[📎 ${name}](${url})`
    })

    // ── PDF ───────────────────────────────────────────────────────────────────
    this.n2m.setCustomTransformer('pdf', async (block) => {
      const pdf = (block as any).pdf
      const url: string = pdf?.file?.url ?? pdf?.external?.url ?? ''
      const caption: string = pdf?.caption?.map((t: any) => t.plain_text).join('') ?? 'PDF'
      if (!url) return ''
      return `[📄 ${caption}](${url})`
    })

    // ── Table of Contents — skip (site generates its own) ─────────────────────
    this.n2m.setCustomTransformer('table_of_contents', async () => '')

    // ── Breadcrumb — skip (navigation artifact) ───────────────────────────────
    this.n2m.setCustomTransformer('breadcrumb', async () => '')

    // ── Link to page — resolve to slug URL ────────────────────────────────────
    this.n2m.setCustomTransformer('link_to_page', async (block) => {
      const ltp = (block as any).link_to_page
      const pageId: string = ltp?.page_id ?? ltp?.database_id ?? ''
      if (!pageId) return ''
      const hexId = pageId.replace(/-/g, '')
      const slug = this.slugMap.get(hexId) ?? this.slugMap.get(pageId)
      if (slug) return `[${slug}](${this.linkPrefix}/${slug})`
      return `[Notion page](/${pageId})`
    })
  }

  async renderPage(pageId: string): Promise<string> {
    const blocks = await this.n2m.pageToMarkdown(pageId)
    return this.n2m.toMarkdownString(blocks).parent ?? ''
  }
}
