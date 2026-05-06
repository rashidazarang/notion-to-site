import { z } from 'zod'
import type { PageObjectResponse } from '@notionhq/client'

const PostSourceSchema = z.object({
  platform: z.literal('notion'),
  page_id: z.string(),
  url: z.string().optional(),
  public_url: z.string().optional(),
})

const PostMetaSchema = z.object({
  title: z.string(),
  author: z.string().default('Rashid Azarang'),
  category: z.array(z.string()).default([]),
  main_tag: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  featured_at: z.array(z.string()).default([]),
  language: z.string().default(''),
  post_type: z.string().default('Post'),
  status: z.enum(['Published', 'Not started', 'Under construction', 'In progress']).default('Not started'),
  comment: z.string().default(''),
  cover_image: z.string().default(''),
})

export const PostFrontmatterSchema = z.object({
  id: z.string(),
  path: z.string(),
  type: z.string().default('essay'),
  intent: z.string().default('reference'),
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
  status: 'Published' | 'Not started' | 'Under construction' | 'In progress'
  tags: string[]
  featured: boolean
  featured_at: string[]
  language: string
  cover_image: string
}

type StatusValue = NotionPageProperties['status']

const STATUS_VALUES: readonly StatusValue[] = [
  'Published',
  'Not started',
  'Under construction',
  'In progress',
]

function isStatusValue(value: string): value is StatusValue {
  return (STATUS_VALUES as readonly string[]).includes(value)
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

export function extractProperties(page: PageObjectResponse): NotionPageProperties {
  const props = page.properties

  let title = ''
  const titleProp = findProperty(props, ['Name', 'Title', 'title'])
  if (titleProp && titleProp.type === 'title') {
    title = titleProp.title.map((t) => t.plain_text).join('')
  }

  let status: StatusValue = 'Not started'
  const statusProp = findProperty(props, ['Status', 'status'])
  if (statusProp && statusProp.type === 'select') {
    const name = statusProp.select?.name
    if (name && isStatusValue(name)) status = name
  }

  let tags: string[] = []
  const tagsProp = findProperty(props, ['Tags', 'tags'])
  if (tagsProp && tagsProp.type === 'multi_select') {
    tags = tagsProp.multi_select.map((t) => t.name)
  }

  let featured = false
  const featuredProp = findProperty(props, ['Featured'])
  if (featuredProp && featuredProp.type === 'checkbox') {
    featured = featuredProp.checkbox === true
  }

  let featured_at: string[] = []
  const featuredAtProp = findProperty(props, ['Featured At'])
  if (featuredAtProp && featuredAtProp.type === 'multi_select') {
    featured_at = featuredAtProp.multi_select.map((t) => t.name)
  }

  let language = ''
  const langProp = findProperty(props, ['Language', 'language'])
  if (langProp && langProp.type === 'select') {
    language = langProp.select?.name ?? ''
  }

  let cover_image = ''
  const cover = page.cover
  if (cover) {
    if (cover.type === 'external') {
      cover_image = cover.external.url
    } else if (cover.type === 'file') {
      cover_image = cover.file.url
    }
  }

  return { title, status, tags, featured, featured_at, language, cover_image }
}
