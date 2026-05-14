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
