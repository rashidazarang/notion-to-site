import { isFullDatabase } from '@notionhq/client'
import { NotionClient } from '../core/client.js'
import { extractProperties } from '../schema.js'
import { BLOG_DATA_SOURCE_PROPERTIES } from './schema-def.js'
import { SAMPLE_POSTS, samplePostToPageParams, type SamplePost } from './fixtures.js'

export interface CreateTemplateOptions {
  /** Notion page ID the integration is shared with (the new DB's parent). */
  parentPageId: string
  /** Database title. Default "Blog". */
  title?: string
  /** Inject a client (tests); otherwise one is built from NOTION_API_KEY. */
  client?: NotionClient
  log?: (message: string) => void
}

export interface CreateTemplateResult {
  databaseId: string
  dataSourceId: string
  url: string
}

/** Creates a blog-shaped Notion database under a parent page. Does not seed. */
export async function createTemplateDatabase(
  opts: CreateTemplateOptions,
): Promise<CreateTemplateResult> {
  const client = opts.client ?? new NotionClient()
  const title = opts.title ?? 'Blog'
  const log = opts.log ?? (() => {})

  log(`Creating database "${title}" under page ${opts.parentPageId}…`)
  let db
  try {
    db = await client.notion.databases.create({
      parent: { type: 'page_id', page_id: opts.parentPageId },
      title: [{ type: 'text', text: { content: title } }],
      initial_data_source: { properties: BLOG_DATA_SOURCE_PROPERTIES },
    })
  } catch (err: any) {
    const code = err?.code ?? ''
    if (code === 'object_not_found' || code === 'unauthorized' || code === 'restricted_resource') {
      throw new Error(
        `Cannot create a database under page ${opts.parentPageId}. ` +
          `Open that page in Notion → ••• → Connections → add your integration, then retry. (${err.message})`,
      )
    }
    throw err
  }

  if (!isFullDatabase(db) || !db.data_sources?.length) {
    throw new Error('Notion returned an incomplete database (no data source). Check the integration permissions.')
  }
  const dataSourceId = db.data_sources[0].id
  log(`✓ Database created (${db.id})`)
  return { databaseId: db.id, dataSourceId, url: (db as any).url ?? '' }
}

export interface SeedOptions {
  databaseId: string
  /** Pass it to skip a resolveDataSource round-trip (e.g. straight after create). */
  dataSourceId?: string
  /** Posts to seed. Defaults to the bundled SAMPLE_POSTS. */
  posts?: SamplePost[]
  /** Cap the number of posts created. */
  count?: number
  coverStyle?: 'stock' | 'none'
  /** Skip the idempotency check and create even when a title/slug already exists. */
  force?: boolean
  client?: NotionClient
  log?: (message: string) => void
}

export interface SeedResult {
  created: { id: string; title: string; status: string }[]
  skipped: { title: string; reason: 'exists' }[]
}

/** Seeds sample posts into an existing database. Idempotent unless `force`. */
export async function seedTemplate(opts: SeedOptions): Promise<SeedResult> {
  const client = opts.client ?? new NotionClient()
  const log = opts.log ?? (() => {})
  const coverStyle = opts.coverStyle ?? 'stock'
  const dataSourceId = opts.dataSourceId ?? (await client.resolveDataSource(opts.databaseId))

  const all = opts.posts ?? SAMPLE_POSTS
  const posts = typeof opts.count === 'number' ? all.slice(0, opts.count) : all

  // Idempotency: collect existing Title/Slug so re-running never duplicates.
  const existingTitles = new Set<string>()
  const existingSlugs = new Set<string>()
  if (!opts.force) {
    for await (const page of client.paginateDatabase(opts.databaseId, { dataSource: dataSourceId })) {
      const props = extractProperties(page)
      if (props.title) existingTitles.add(props.title)
      if (props.slug) existingSlugs.add(props.slug)
    }
  }

  const result: SeedResult = { created: [], skipped: [] }
  for (const post of posts) {
    if (!opts.force && (existingTitles.has(post.title) || existingSlugs.has(post.slug))) {
      result.skipped.push({ title: post.title, reason: 'exists' })
      log(`  • skipped (exists): ${post.title}`)
      continue
    }
    const created = await client.notion.pages.create(
      samplePostToPageParams(post, dataSourceId, coverStyle),
    )
    result.created.push({ id: created.id, title: post.title, status: post.status })
    log(`  ✓ ${post.title} (${post.status})`)
  }
  return result
}
