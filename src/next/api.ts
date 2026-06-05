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
import * as fs from 'fs'
import * as path from 'path'
import { pathToFileURL } from 'url'

export interface ContentPage<T = Record<string, any>> {
  slug: string
  frontmatter: T
  content: string
}

const cache = new Map<string, ContentPage[]>()

async function importContentModule(modPath: string): Promise<{ pages?: ContentPage[] }> {
  const moduleDir = path.dirname(modPath)
  const packagePath = path.join(moduleDir, 'package.json')

  let isEsmPackage = false
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8')) as { type?: string }
    isEsmPackage = packageJson.type === 'module'
  } catch {
    // Older generated content dirs did not include a package.json. Import those
    // from source so Node 18 never tries to parse ESM as CommonJS first.
  }

  if (isEsmPackage) {
    return import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */ pathToFileURL(modPath).href
    )
  }

  const source = fs.readFileSync(modPath, 'utf-8')
  const dataUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`
  return import(/* webpackIgnore: true */ /* turbopackIgnore: true */ dataUrl)
}

async function loadPages(dir: string): Promise<ContentPage[]> {
  const cached = cache.get(dir)
  if (cached) return cached

  const modPath = path.resolve(process.cwd(), dir, 'index.js')
  let mod: { pages?: ContentPage[] }
  if (!fs.existsSync(modPath)) {
    throw new Error(
      `notion-to-site: could not load the content module at ${modPath}. ` +
        'Run `nts sync` first, or wrap your next.config with withNotion(). (file does not exist)',
    )
  }

  try {
    mod = await importContentModule(modPath)
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
