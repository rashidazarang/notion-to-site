import { z } from 'zod'
import type { PageObjectResponse } from '@notionhq/client'
import type { NtsSchema } from './typegen/introspect.js'

const PostSourceSchema = z.object({
  platform: z.literal('notion'),
  page_id: z.string(),
  url: z.string().optional(),
  public_url: z.string().optional(),
})

const PostMetaSchema = z.object({
  title: z.string(),
  seo_title: z.string().default(''),
  author: z.string().default(''),
  description: z.string().default(''),
  canonical: z.string().default(''),
  category: z.array(z.string()).default([]),
  main_tag: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  featured_at: z.array(z.string()).default([]),
  language: z.string().default(''),
  post_type: z.string().default('Post'),
  status: z.string().default('Not started'),
  reading_time: z.number().int().min(1).default(1),
  word_count: z.number().int().min(0).default(0),
  comment: z.string().default(''),
  cover_image: z.string().default(''),
  domain_tags: z.array(z.string()).default([]),
})

export const PostFrontmatterSchema = z.object({
  id: z.string(),
  path: z.string(),
  type: z.string().default('post'),
  intent: z.string().default(''),
  version: z.string().default('1.0'),
  created: z.string(),
  last_updated: z.string(),
  source: PostSourceSchema,
  meta: PostMetaSchema,
})

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>

export function validateFrontmatter(data: unknown): PostFrontmatter {
  return PostFrontmatterSchema.parse(data)
}

export interface NotionPageProperties {
  title: string
  slug: string | null
  status: string
  tags: string[]
  featured: boolean
  featured_at: string[]
  language: string
  cover_image: string
  author: string
  description: string
  seo_title: string
  canonical: string
  category: string[]
  main_tag: string | null
  post_type: string
  domain_tags: string[]
}

type PageProperty = PageObjectResponse['properties'][string]

function findProperty(
  properties: PageObjectResponse['properties'],
  names: readonly string[],
): PageProperty | undefined {
  for (const name of names) {
    if (name in properties) return properties[name]
  }
  return undefined
}

function richTextToPlain(rt: any[]): string {
  return rt?.map((t: any) => t.plain_text).join('') ?? ''
}

export function extractProperties(page: PageObjectResponse): NotionPageProperties {
  const props = page.properties

  // Title
  let title = ''
  const titleProp = findProperty(props, ['Name', 'Title', 'title', 'Post'])
  if (titleProp?.type === 'title') {
    title = richTextToPlain(titleProp.title)
  }

  // Custom slug (overrides auto-slugify)
  let slug: string | null = null
  const slugProp = findProperty(props, ['Slug', 'slug', 'URL', 'url', 'super:slug'])
  if (slugProp?.type === 'rich_text') {
    const val = richTextToPlain(slugProp.rich_text).trim()
    if (val) slug = val
  } else if (slugProp?.type === 'url') {
    const val = (slugProp.url ?? '').trim()
    if (val) slug = val.replace(/^\/+/, '')
  }

  // Status
  let status = 'Not started'
  const statusProp = findProperty(props, ['Status', 'status', 'State', 'state'])
  if (statusProp?.type === 'select') {
    status = statusProp.select?.name ?? 'Not started'
  } else if (statusProp?.type === 'status') {
    status = (statusProp as any).status?.name ?? 'Not started'
  }

  // Tags
  let tags: string[] = []
  const tagsProp = findProperty(props, ['Tags', 'tags', 'Tag', 'tag'])
  if (tagsProp?.type === 'multi_select') {
    tags = tagsProp.multi_select.map((t: any) => t.name)
  }

  // Main tag (dedicated property or first tag)
  let main_tag: string | null = null
  const mainTagProp = findProperty(props, ['Main Tag', 'main_tag', 'MainTag', 'Primary Tag'])
  if (mainTagProp?.type === 'select') {
    main_tag = mainTagProp.select?.name ?? null
  } else if (mainTagProp?.type === 'rich_text') {
    const val = richTextToPlain(mainTagProp.rich_text).trim()
    if (val) main_tag = val
  }
  if (!main_tag && tags.length > 0) main_tag = tags[0]

  // Category
  let category: string[] = []
  const catProp = findProperty(props, ['Category', 'category', 'Categories'])
  if (catProp?.type === 'multi_select') {
    category = catProp.multi_select.map((t: any) => t.name)
  } else if (catProp?.type === 'select') {
    const val = catProp.select?.name
    if (val) category = [val]
  }

  // Featured
  let featured = false
  const featuredProp = findProperty(props, ['Featured', 'featured'])
  if (featuredProp?.type === 'checkbox') {
    featured = featuredProp.checkbox === true
  }

  // Featured at
  let featured_at: string[] = []
  const featuredAtProp = findProperty(props, ['Featured At', 'featured_at', 'FeaturedAt'])
  if (featuredAtProp?.type === 'multi_select') {
    featured_at = featuredAtProp.multi_select.map((t: any) => t.name)
  }

  // Language
  let language = ''
  const langProp = findProperty(props, ['Language', 'language', 'Lang'])
  if (langProp?.type === 'select') {
    language = langProp.select?.name ?? ''
  } else if (langProp?.type === 'rich_text') {
    language = richTextToPlain(langProp.rich_text)
  }

  // Author
  let author = ''
  const authorProp = findProperty(props, ['Author', 'author', 'Writer', 'By'])
  if (authorProp?.type === 'rich_text') {
    author = richTextToPlain(authorProp.rich_text)
  } else if (authorProp?.type === 'people') {
    author = authorProp.people?.map((p: any) => p.name).join(', ') ?? ''
  } else if (authorProp?.type === 'created_by') {
    author = (authorProp as any).created_by?.name ?? ''
  }

  // Description (Notion property override)
  let description = ''
  const descProp = findProperty(props, ['Description', 'description', 'Summary', 'Excerpt'])
  if (descProp?.type === 'rich_text') {
    description = richTextToPlain(descProp.rich_text)
  }

  // SEO title
  let seo_title = ''
  const seoTitleProp = findProperty(props, ['SEO Title', 'seo_title', 'meta:title', 'Meta Title'])
  if (seoTitleProp?.type === 'rich_text') {
    seo_title = richTextToPlain(seoTitleProp.rich_text)
  }

  // Canonical URL
  let canonical = ''
  const canonicalProp = findProperty(props, ['Canonical', 'canonical', 'meta:canonical'])
  if (canonicalProp?.type === 'url') {
    canonical = canonicalProp.url ?? ''
  } else if (canonicalProp?.type === 'rich_text') {
    canonical = richTextToPlain(canonicalProp.rich_text)
  }

  // Post type
  let post_type = 'Post'
  const typeProp = findProperty(props, ['Type', 'type', 'Post Type', 'post_type', 'Kind'])
  if (typeProp?.type === 'select') {
    post_type = typeProp.select?.name ?? 'Post'
  }

  // Cover image
  let cover_image = ''
  const cover = page.cover
  if (cover) {
    if (cover.type === 'external') cover_image = cover.external.url
    else if (cover.type === 'file') cover_image = cover.file.url
  }

  // Domain Tags — per-page routing across multi-surface sites
  let domain_tags: string[] = []
  const domainTagsProp = findProperty(props, ['Domain Tags', 'domain_tags', 'Domain tags', 'Domains', 'Surfaces'])
  if (domainTagsProp?.type === 'multi_select') {
    domain_tags = domainTagsProp.multi_select.map((t: any) => t.name)
  }

  return {
    title, slug, status, tags, main_tag, category, featured, featured_at,
    language, cover_image, author, description, seo_title, canonical, post_type,
    domain_tags,
  }
}

// ── Typed extraction (schema.mode: 'typed') ───────────────────────────────────
//
// Unlike `extractProperties` above, which guesses property names to fit a
// fixed blog schema, this reads each property by its *real* name and *real*
// type from an introspected `NtsSchema` — so the output faithfully mirrors
// the user's own Notion database.

// Property types whose generated TS type is a non-nullable `string` / array —
// a missing value must default to `''` / `[]`, not `null`, to match the types.
const TYPED_STRING_PROPS = new Set([
  'title', 'rich_text', 'url', 'email', 'phone_number',
  'created_time', 'last_edited_time', 'created_by', 'last_edited_by',
])
const TYPED_ARRAY_PROPS = new Set(['multi_select', 'people', 'files', 'relation'])

/** Reads a single Notion property value into a plain, serializable shape. */
function extractTypedValue(raw: any, type: string): unknown {
  if (!raw) {
    if (TYPED_STRING_PROPS.has(type)) return ''
    if (TYPED_ARRAY_PROPS.has(type)) return []
    if (type === 'checkbox') return false
    return null
  }
  switch (type) {
    case 'title':
      return richTextToPlain(raw.title ?? [])
    case 'rich_text':
      return richTextToPlain(raw.rich_text ?? [])
    case 'url':
      return raw.url ?? ''
    case 'email':
      return raw.email ?? ''
    case 'phone_number':
      return raw.phone_number ?? ''
    case 'number':
      return raw.number ?? null
    case 'checkbox':
      return raw.checkbox === true
    case 'select':
      return raw.select?.name ?? null
    case 'status':
      return raw.status?.name ?? null
    case 'multi_select':
      return (raw.multi_select ?? []).map((o: any) => o.name)
    case 'date':
      return raw.date ? { start: raw.date.start, end: raw.date.end ?? null } : null
    case 'people':
      return (raw.people ?? []).map((p: any) => p.name ?? p.id ?? '')
    case 'files':
      return (raw.files ?? []).map((f: any) => f.file?.url ?? f.external?.url ?? '')
    case 'relation':
      return (raw.relation ?? []).map((r: any) => r.id)
    case 'formula': {
      const f = raw.formula
      if (!f) return null
      if (f.type === 'date') return f.date?.start ?? null
      return f[f.type] ?? null
    }
    case 'rollup':
      return raw.rollup ?? null
    case 'created_time':
      return raw.created_time ?? ''
    case 'last_edited_time':
      return raw.last_edited_time ?? ''
    case 'created_by':
      return raw.created_by?.name ?? raw.created_by?.id ?? ''
    case 'last_edited_by':
      return raw.last_edited_by?.name ?? raw.last_edited_by?.id ?? ''
    case 'unique_id':
      return raw.unique_id
        ? { prefix: raw.unique_id.prefix ?? null, number: raw.unique_id.number ?? null }
        : null
    default:
      return null
  }
}

/**
 * Extracts every property of a page, keyed by its real Notion name, according
 * to an introspected schema. The result matches the types emitted by
 * `emitTypes` for the same schema.
 */
export function extractPropertiesTyped(
  page: PageObjectResponse,
  schema: NtsSchema,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const prop of schema.properties) {
    out[prop.name] = extractTypedValue(page.properties[prop.name], prop.type)
  }
  return out
}
