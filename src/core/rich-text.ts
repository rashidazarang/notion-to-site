import type { RichTextItemResponse } from '@notionhq/client'
import type { ColorStrategy } from '../types.js'

export type { ColorStrategy }

export interface RenderContext {
  /** pageId (dashed or hex) → slug, for resolving `@page` mentions to links. */
  slugMap: Map<string, string>
  /** URL prefix for internal links, e.g. `"/blog"`. */
  linkPrefix: string
  /** How to render Notion text/background colors. */
  color: ColorStrategy
}

// Notion's named colors → CSS values, used by the `'inline'` color strategy.
const TEXT_COLORS: Record<string, string> = {
  gray: '#787774', brown: '#9f6b53', orange: '#d9730d', yellow: '#cb912f',
  green: '#448361', blue: '#337ea9', purple: '#9065b0', pink: '#c14c8a', red: '#d44c47',
}
const BG_COLORS: Record<string, string> = {
  gray: '#f1f1ef', brown: '#f3eeee', orange: '#fbecdd', yellow: '#fbf3db',
  green: '#edf3ec', blue: '#e7f3f8', purple: '#f6f3f9', pink: '#faf1f5', red: '#fdebec',
}

function applyAnnotations(text: string, ann: RichTextItemResponse['annotations']): string {
  if (!text) return text
  // `code` is innermost — backticks are literal, no markdown renders inside them.
  // strike/italic/bold then wrap outward; underline has no markdown equivalent.
  let out = text
  if (ann.code) out = `\`${out}\``
  if (ann.strikethrough) out = `~~${out}~~`
  if (ann.italic) out = `_${out}_`
  if (ann.bold) out = `**${out}**`
  if (ann.underline) out = `<u>${out}</u>`
  return out
}

function applyColor(text: string, color: string, strategy: ColorStrategy): string {
  if (!text || color === 'default' || color === 'default_background' || strategy === 'drop') {
    return text
  }
  if (strategy === 'class') {
    return `<span class="notion-color-${color.replace(/_/g, '-')}">${text}</span>`
  }
  // inline
  const isBg = color.endsWith('_background')
  const base = isBg ? color.slice(0, -'_background'.length) : color
  if (isBg) {
    const css = BG_COLORS[base]
    return css ? `<span style="background-color:${css}">${text}</span>` : text
  }
  const css = TEXT_COLORS[base]
  return css ? `<span style="color:${css}">${text}</span>` : text
}

function renderMention(
  item: Extract<RichTextItemResponse, { type: 'mention' }>,
  ctx: RenderContext,
): string {
  const m = item.mention
  const label = item.plain_text
  switch (m.type) {
    case 'page': {
      const id = m.page.id
      const slug = ctx.slugMap.get(id) ?? ctx.slugMap.get(id.replace(/-/g, ''))
      return slug ? `[${label}](${ctx.linkPrefix}/${slug})` : label
    }
    case 'link_preview':
      return `[${label || m.link_preview.url}](${m.link_preview.url})`
    case 'link_mention':
      return `[${label || m.link_mention.title || m.link_mention.href}](${m.link_mention.href})`
    default:
      // user / date / database / template_mention / custom_emoji — Notion's
      // own `plain_text` (the name, formatted date, title, emoji) is correct.
      return label
  }
}

/**
 * Renders a Notion rich-text array to inline markdown. Unlike a `plain_text`
 * join, this preserves bold/italic/strikethrough/underline/code annotations,
 * links, inline equations, colors (per `ctx.color`), and mentions — resolving
 * `@page` mentions to internal links via `ctx.slugMap`.
 */
export function renderRichText(
  items: RichTextItemResponse[] | undefined | null,
  ctx: RenderContext,
): string {
  if (!items || items.length === 0) return ''
  let out = ''
  for (const item of items) {
    let content: string
    if (item.type === 'text') {
      content = applyAnnotations(item.text.content, item.annotations)
      if (item.text.link) content = `[${content}](${item.text.link.url})`
    } else if (item.type === 'equation') {
      content = applyAnnotations(`$${item.equation.expression}$`, item.annotations)
    } else {
      content = applyAnnotations(renderMention(item, ctx), item.annotations)
    }
    out += applyColor(content, item.annotations.color, ctx.color)
  }
  return out
}
