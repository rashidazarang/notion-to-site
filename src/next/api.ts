/**
 * Typed accessors over the generated content module (`.notion-to-site/index.js`,
 * emitted by `nts sync` / `withNotion`). Pass your generated `NotionContent`
 * type for full type safety:
 *
 * ```ts
 * import type { NotionContent } from './.notion-to-site'
 * import { getAllPages } from 'notion-to-site/next'
 * const posts = await getAllPages<NotionContent>()
 * ```
 */
import * as path from 'path'
import { pathToFileURL } from 'url'

export interface ContentPage<T = Record<string, any>> {
  slug: string
  frontmatter: T
  content: string
}

const cache = new Map<string, ContentPage[]>()

async function loadPages(dir: string): Promise<ContentPage[]> {
  const cached = cache.get(dir)
  if (cached) return cached

  const modPath = path.resolve(process.cwd(), dir, 'index.js')
  let mod: { pages?: ContentPage[] }
  try {
    mod = await import(pathToFileURL(modPath).href)
  } catch (err: any) {
    throw new Error(
      `notion-to-site: could not load the content module at ${modPath}. ` +
        `Run \`nts sync\` first, or wrap your next.config with withNotion(). (${err.message})`,
    )
  }

  const pages = mod.pages ?? []
  cache.set(dir, pages)
  return pages
}

/** Returns every synced page. Pass your generated `NotionContent` type for full typing. */
export async function getAllPages<T = Record<string, any>>(
  dir = '.notion-to-site',
): Promise<ContentPage<T>[]> {
  return (await loadPages(dir)) as ContentPage<T>[]
}

/** Returns one synced page by slug, or `null` if there is no match. */
export async function getPageBySlug<T = Record<string, any>>(
  slug: string,
  dir = '.notion-to-site',
): Promise<ContentPage<T> | null> {
  const pages = await loadPages(dir)
  return (pages.find((p) => p.slug === slug) as ContentPage<T> | undefined) ?? null
}
