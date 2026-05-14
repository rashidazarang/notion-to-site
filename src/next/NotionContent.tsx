import { marked } from 'marked'

export interface NotionContentProps {
  /** The page body — markdown, as produced by notion-to-site. */
  body: string
  /** Optional class name for the wrapper element. */
  className?: string
}

/**
 * A server component that renders a notion-to-site page body (markdown) to
 * HTML. The content originates from your own Notion workspace, so it is
 * rendered directly via `dangerouslySetInnerHTML`.
 *
 * ```tsx
 * import { NotionContent } from 'notion-to-site/next'
 * <NotionContent body={post.content} className="prose" />
 * ```
 */
export function NotionContent({ body, className }: NotionContentProps) {
  const html = marked.parse(body, { async: false }) as string
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
