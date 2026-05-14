import { NotionToMarkdown } from 'notion-to-md'
import type { NotionClient } from './client.js'
import { renderRichText, type RenderContext } from './rich-text.js'
import type { BlockTransformer, ColorStrategy } from '../types.js'

export type { BlockTransformer }
export type { RenderContext, ColorStrategy }

export interface NtxRendererOptions {
  /** How to render Notion colors in rich text. Default `'drop'`. */
  color?: ColorStrategy
  /** Per-block-type rendering overrides, applied over the built-in transformers. */
  transformers?: Record<string, BlockTransformer>
}

/**
 * Builds a GitHub-flavored markdown table from pre-rendered string cells.
 * When `hasColumnHeader` is false an empty header row is emitted so the table
 * is still valid markdown (markdown tables always require a header).
 */
export function tableRowsToMarkdown(rows: string[][], hasColumnHeader: boolean): string {
  if (rows.length === 0) return ''
  const colCount = Math.max(...rows.map((r) => r.length))
  const pad = (r: string[]) => {
    const cells = r.slice()
    while (cells.length < colCount) cells.push('')
    return cells
  }
  const toRow = (r: string[]) => `| ${pad(r).join(' | ')} |`
  const sep = `| ${Array(colCount).fill('---').join(' | ')} |`

  if (hasColumnHeader) {
    const [head, ...body] = rows
    return [toRow(head), sep, ...body.map(toRow)].join('\n')
  }
  const emptyHead = `| ${Array(colCount).fill('').join(' | ')} |`
  return [emptyHead, sep, ...rows.map(toRow)].join('\n')
}

function plainText(richText: any[] | undefined): string {
  return richText?.map((t: any) => t.plain_text).join('') ?? ''
}

export class NtxRenderer {
  private n2m: NotionToMarkdown
  private client: NotionClient
  slugMap: Map<string, string> = new Map()
  linkPrefix: string = '/blog'
  private color: ColorStrategy

  constructor(client: NotionClient, opts?: NtxRendererOptions) {
    this.client = client
    this.color = opts?.color ?? 'drop'
    this.n2m = new NotionToMarkdown({ notionClient: client.notion })
    this.registerTransformers()
    // User-supplied transformers override the built-ins.
    if (opts?.transformers) {
      for (const [type, fn] of Object.entries(opts.transformers)) {
        this.n2m.setCustomTransformer(type, fn as any)
      }
    }
  }

  private get ctx(): RenderContext {
    return { slugMap: this.slugMap, linkPrefix: this.linkPrefix, color: this.color }
  }

  /** Render a Notion rich-text array to inline markdown (annotations, links, mentions, color). */
  private rt(richText: any): string {
    return renderRichText(richText, this.ctx)
  }

  private registerTransformers() {
    const t = (type: string, fn: BlockTransformer) =>
      this.n2m.setCustomTransformer(type, fn as any)

    // ── Images — alt text stays plain so it can't break the ![]() syntax ──
    t('image', async (block) => {
      const img = block.image
      const url: string = img?.file?.url ?? img?.external?.url ?? ''
      if (!url) return ''
      const caption = plainText(img?.caption) || 'image'
      const isFile = !!img?.file?.url
      return isFile
        ? `![${caption}](ntx-img:${block.id}:${encodeURIComponent(url)})`
        : `![${caption}](${url})`
    })

    // ── Callouts — body is a blockquote, full rich text is safe here ──
    t('callout', async (block) => {
      const callout = block.callout
      const emoji = callout?.icon?.emoji ?? '💡'
      const text = this.rt(callout?.rich_text)
      return `> ${emoji} ${text}`.trim()
    })

    // ── Columns — render content, don't drop it ──
    t('column_list', async (block) => {
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
    t('column', async () => '')

    // ── Tables — respect the column-header flag; cells carry full rich text ──
    t('table', async (block) => {
      const hasColumnHeader: boolean = block.table?.has_column_header ?? false
      const children = await this.client.getPageBlocks(block.id)
      const rows = children
        .filter((c: any) => c.type === 'table_row')
        .map((c: any) =>
          (c.table_row.cells as any[][]).map((cell) =>
            // Escape pipes/newlines so a cell can't break the table grid.
            this.rt(cell).replace(/\|/g, '\\|').replace(/\n+/g, ' '),
          ),
        )
      return tableRowsToMarkdown(rows, hasColumnHeader)
    })

    // ── Equations (block) → $$ KaTeX $$ ──
    t('equation', async (block) => {
      const expr = block.equation?.expression ?? ''
      return expr ? `$$\n${expr}\n$$` : ''
    })

    // ── Code — preserve the language and the (previously dropped) caption ──
    t('code', async (block) => {
      const code = block.code
      if (!code) return false
      const lang: string = code.language && code.language !== 'plain text' ? code.language : ''
      const content = plainText(code.rich_text)
      const fenced = `\`\`\`${lang}\n${content}\n\`\`\``
      const caption = this.rt(code.caption)
      return caption ? `${fenced}\n\n_${caption}_` : fenced
    })

    // ── Toggle → HTML details/summary (summary stays plain — it is raw HTML) ──
    t('toggle', async (block) => {
      const summary = plainText(block.toggle?.rich_text)
      const children = await this.n2m.pageToMarkdown(block.id)
      const inner = this.n2m.toMarkdownString(children).parent ?? ''
      if (!summary && !inner.trim()) return ''
      return `<details>\n<summary>${summary}</summary>\n\n${inner.trim()}\n\n</details>`
    })

    // ── Synced blocks — follow source and render its content ──
    t('synced_block', async (block) => {
      const sourceId = block.synced_block?.synced_from?.block_id ?? null
      const targetId = sourceId ?? block.id
      const children = await this.n2m.pageToMarkdown(targetId)
      return this.n2m.toMarkdownString(children).parent ?? ''
    })

    // ── Bookmarks / embeds / media — caption stays plain (it is link text) ──
    t('bookmark', async (block) => {
      const url = block.bookmark?.url ?? ''
      if (!url) return ''
      const caption = plainText(block.bookmark?.caption)
      return `[${caption || url}](${url})`
    })

    t('embed', async (block) => {
      const url = block.embed?.url ?? ''
      if (!url) return ''
      const caption = plainText(block.embed?.caption)
      return caption ? `[${caption}](${url})` : `[${url}](${url})`
    })

    t('video', async (block) => {
      const vid = block.video
      const url: string = vid?.file?.url ?? vid?.external?.url ?? ''
      if (!url) return ''
      const caption = plainText(vid?.caption)
      if (vid?.file?.url) {
        try {
          const u = new URL(url)
          const clean = u.origin + u.pathname
          const label = caption || clean.split('/').pop() || 'Video'
          return `[▶ ${label}](${clean})`
        } catch {
          return `[▶ ${caption || 'Video'}](${url})`
        }
      }
      return `[▶ ${caption || 'Video'}](${url})`
    })

    t('audio', async (block) => {
      const audio = block.audio
      const url: string = audio?.file?.url ?? audio?.external?.url ?? ''
      if (!url) return ''
      const caption = plainText(audio?.caption)
      return `[🔊 ${caption || 'Audio'}](${url})`
    })

    t('file', async (block) => {
      const f = block.file
      const url: string = f?.file?.url ?? f?.external?.url ?? ''
      if (!url) return ''
      const name: string = f?.name || plainText(f?.caption) || 'File'
      return `[📎 ${name}](${url})`
    })

    t('pdf', async (block) => {
      const pdf = block.pdf
      const url: string = pdf?.file?.url ?? pdf?.external?.url ?? ''
      if (!url) return ''
      const caption = plainText(pdf?.caption) || 'PDF'
      return `[📄 ${caption}](${url})`
    })

    // ── Child database — a titled reference instead of a bare title string ──
    t('child_database', async (block) => {
      const title: string = block.child_database?.title || 'Untitled database'
      return `**${title}**`
    })

    // ── Table of contents / breadcrumb — skip (navigation artifacts) ──
    t('table_of_contents', async () => '')
    t('breadcrumb', async () => '')

    // ── Link to page — resolve to a slug URL ──
    t('link_to_page', async (block) => {
      const ltp = block.link_to_page
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
