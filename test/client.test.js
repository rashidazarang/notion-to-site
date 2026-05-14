import test from 'node:test'
import assert from 'node:assert/strict'

import { makeThrottle } from '../dist/core/client.js'
import { NotionClient } from '../dist/index.js'

test('makeThrottle: spaces successive calls by the interval', async () => {
  const throttle = makeThrottle(50)
  const start = Date.now()
  await throttle() // immediate
  await throttle() // ~+50ms
  await throttle() // ~+100ms
  const elapsed = Date.now() - start
  assert.ok(elapsed >= 90, `expected >= 90ms of throttling, got ${elapsed}ms`)
  assert.ok(elapsed < 2000, `throttle should not hang, got ${elapsed}ms`)
})

test('makeThrottle: the first call is not delayed', async () => {
  const throttle = makeThrottle(1000)
  const start = Date.now()
  await throttle()
  assert.ok(Date.now() - start < 100)
})

test('NotionClient: throws a clear error without an API key', () => {
  const orig = process.env.NOTION_API_KEY
  delete process.env.NOTION_API_KEY
  try {
    assert.throws(() => new NotionClient(), /API key is required/)
  } finally {
    if (orig !== undefined) process.env.NOTION_API_KEY = orig
  }
})

test('NotionClient: accepts an explicit API key', () => {
  const orig = process.env.NOTION_API_KEY
  delete process.env.NOTION_API_KEY
  try {
    const client = new NotionClient({ apiKey: 'ntn_test_key' })
    assert.ok(client.notion)
  } finally {
    if (orig !== undefined) process.env.NOTION_API_KEY = orig
  }
})

test('resolveDataSource: resolves a database to its data source and caches it', async () => {
  const client = new NotionClient({ apiKey: 'ntn_test_key' })
  let retrieveCalls = 0
  client.notion = {
    databases: {
      retrieve: async ({ database_id }) => {
        retrieveCalls++
        return {
          object: 'database',
          id: database_id,
          data_sources: [{ id: 'ds-123', name: 'Posts' }],
        }
      },
    },
  }
  const first = await client.resolveDataSource('db-abc')
  const second = await client.resolveDataSource('db-abc')
  assert.equal(first, 'ds-123')
  assert.equal(second, 'ds-123')
  assert.equal(retrieveCalls, 1, 'the second call should be served from the cache')
})

test('resolveDataSource: an explicit override skips the API call', async () => {
  const client = new NotionClient({ apiKey: 'ntn_test_key' })
  let called = false
  client.notion = {
    databases: {
      retrieve: async () => {
        called = true
        return {}
      },
    },
  }
  const id = await client.resolveDataSource('db-abc', 'ds-explicit')
  assert.equal(id, 'ds-explicit')
  assert.equal(called, false)
})

test('resolveDataSource: throws when the database has no data sources', async () => {
  const client = new NotionClient({ apiKey: 'ntn_test_key' })
  client.notion = {
    databases: {
      retrieve: async ({ database_id }) => ({
        object: 'database',
        id: database_id,
        data_sources: [],
      }),
    },
  }
  await assert.rejects(
    () => client.resolveDataSource('db-empty'),
    /no accessible data sources/,
  )
})
