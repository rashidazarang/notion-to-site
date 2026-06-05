import test from 'node:test'
import assert from 'node:assert/strict'

import {
  createTemplateDatabase,
  seedTemplate,
  samplePostToPageParams,
  SAMPLE_POSTS,
  BLOG_DATA_SOURCE_PROPERTIES,
  NotionClient,
} from '../dist/index.js'

// ── schema-def invariants ────────────────────────────────────────────────────

test('schema-def: has exactly one title property', () => {
  const titleProps = Object.values(BLOG_DATA_SOURCE_PROPERTIES).filter((v) => 'title' in v)
  assert.equal(titleProps.length, 1)
})

test('schema-def: Status/Category/Language option sets match the consuming site', () => {
  assert.deepEqual(
    BLOG_DATA_SOURCE_PROPERTIES.Status.select.options.map((o) => o.name),
    ['Draft', 'Published'],
  )
  assert.deepEqual(
    BLOG_DATA_SOURCE_PROPERTIES.Category.multi_select.options.map((o) => o.name),
    ['Business', 'Technology', 'Company'],
  )
  assert.deepEqual(
    BLOG_DATA_SOURCE_PROPERTIES.Language.select.options.map((o) => o.name),
    ['en', 'es'],
  )
})

// ── createTemplateDatabase ───────────────────────────────────────────────────

function fakeClient(notion) {
  const client = new NotionClient({ apiKey: 'ntn_test_key' })
  client.notion = notion
  return client
}

test('createTemplateDatabase: creates under a page parent with schema in initial_data_source', async () => {
  let captured
  const client = fakeClient({
    databases: {
      create: async (args) => {
        captured = args
        return {
          object: 'database',
          id: 'db-new',
          data_sources: [{ id: 'ds-new', name: 'Blog' }],
          url: 'https://www.notion.so/db-new',
        }
      },
    },
  })
  const res = await createTemplateDatabase({ parentPageId: 'page-1', title: 'Blog', client })
  assert.equal(captured.parent.type, 'page_id')
  assert.equal(captured.parent.page_id, 'page-1')
  assert.ok(captured.initial_data_source.properties.Title, 'schema goes under initial_data_source.properties')
  assert.equal(res.databaseId, 'db-new')
  assert.equal(res.dataSourceId, 'ds-new')
  assert.equal(res.url, 'https://www.notion.so/db-new')
})

test('createTemplateDatabase: throws an actionable error when the parent is inaccessible', async () => {
  const client = fakeClient({
    databases: {
      create: async () => {
        const e = new Error('Could not find page')
        e.code = 'object_not_found'
        throw e
      },
    },
  })
  await assert.rejects(
    () => createTemplateDatabase({ parentPageId: 'page-x', client }),
    /add your integration/,
  )
})

// ── samplePostToPageParams ───────────────────────────────────────────────────

test('samplePostToPageParams: parents by data_source_id and fills core props', () => {
  const post = SAMPLE_POSTS[0]
  const params = samplePostToPageParams(post, 'ds-1', 'stock')
  assert.equal(params.parent.type, 'data_source_id')
  assert.equal(params.parent.data_source_id, 'ds-1')
  assert.equal(params.properties.Title.title[0].text.content, post.title)
  assert.equal(params.properties.Status.select.name, post.status)
  assert.equal(params.properties.Date.date.start, post.date)
  assert.ok(params.cover)
  assert.equal(params.properties.Cover.url, post.coverUrl)
})

test('samplePostToPageParams: cover-style none omits the page cover and nulls Cover', () => {
  const params = samplePostToPageParams(SAMPLE_POSTS[0], 'ds-1', 'none')
  assert.equal(params.cover, undefined)
  assert.equal(params.properties.Cover.url, null)
})

// ── seedTemplate ─────────────────────────────────────────────────────────────

function seedClient(existingPages = []) {
  const created = []
  const client = new NotionClient({ apiKey: 'ntn_test_key' })
  client.notion = {
    pages: {
      create: async (args) => {
        created.push(args)
        return { id: 'page-' + created.length }
      },
    },
  }
  client.paginateDatabase = async function* () {
    for (const p of existingPages) yield p
  }
  return { client, created }
}

function pageWithTitle(title) {
  return { properties: { Title: { type: 'title', title: [{ plain_text: title }] } }, cover: null }
}

test('seedTemplate: creates each post sequentially', async () => {
  const { client, created } = seedClient()
  const res = await seedTemplate({ databaseId: 'db', dataSourceId: 'ds', posts: SAMPLE_POSTS, client })
  assert.equal(res.created.length, SAMPLE_POSTS.length)
  assert.equal(created.length, SAMPLE_POSTS.length)
  assert.equal(res.skipped.length, 0)
})

test('seedTemplate: is idempotent — skips a post whose title already exists', async () => {
  const { client, created } = seedClient([pageWithTitle(SAMPLE_POSTS[0].title)])
  const res = await seedTemplate({ databaseId: 'db', dataSourceId: 'ds', posts: SAMPLE_POSTS, client })
  assert.equal(res.skipped.length, 1)
  assert.equal(res.created.length, SAMPLE_POSTS.length - 1)
  assert.equal(created.length, SAMPLE_POSTS.length - 1)
})

test('seedTemplate: --force creates even when a match exists', async () => {
  const { client, created } = seedClient([pageWithTitle(SAMPLE_POSTS[0].title)])
  const res = await seedTemplate({
    databaseId: 'db',
    dataSourceId: 'ds',
    posts: SAMPLE_POSTS,
    force: true,
    client,
  })
  assert.equal(res.created.length, SAMPLE_POSTS.length)
  assert.equal(created.length, SAMPLE_POSTS.length)
})

test('seedTemplate: count caps the number created', async () => {
  const { client } = seedClient()
  const res = await seedTemplate({
    databaseId: 'db',
    dataSourceId: 'ds',
    posts: SAMPLE_POSTS,
    count: 1,
    client,
  })
  assert.equal(res.created.length, 1)
})
