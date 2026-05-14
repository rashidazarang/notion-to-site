import test from 'node:test'
import assert from 'node:assert/strict'

import { notionLoader, populateStore } from '../dist/astro/index.js'

function mockContext() {
  const entries = new Map()
  return {
    entries,
    store: {
      set: (e) => entries.set(e.id, e),
      clear: () => entries.clear(),
    },
    logger: { info: () => {}, warn: () => {} },
    parseData: async ({ data }) => data,
    renderMarkdown: async (content) => ({ html: `<p>${content}</p>` }),
  }
}

const samplePages = [
  { slug: 'alpha', frontmatter: { title: 'Alpha' }, content: '# Alpha\n\nbody a' },
  { slug: 'beta', frontmatter: { title: 'Beta' }, content: '# Beta\n\nbody b' },
]

test('notionLoader: returns a Content Layer loader object', () => {
  const loader = notionLoader({ database: 'db-123' })
  assert.equal(loader.name, 'notion-to-site')
  assert.equal(typeof loader.load, 'function')
})

test('populateStore: maps pages into the store with data, body, and rendered', async () => {
  const ctx = mockContext()
  await populateStore(samplePages, ctx)
  assert.equal(ctx.entries.size, 2)
  const alpha = ctx.entries.get('alpha')
  assert.equal(alpha.data.title, 'Alpha')
  assert.equal(alpha.body, '# Alpha\n\nbody a')
  assert.equal(alpha.rendered.html, '<p># Alpha\n\nbody a</p>')
})

test('populateStore: clears the store before repopulating', async () => {
  const ctx = mockContext()
  ctx.store.set({ id: 'stale', data: {} })
  await populateStore(samplePages, ctx)
  assert.equal(ctx.entries.has('stale'), false)
  assert.equal(ctx.entries.size, 2)
})

test('populateStore: works without renderMarkdown (older Astro)', async () => {
  const ctx = mockContext()
  delete ctx.renderMarkdown
  await populateStore(samplePages, ctx)
  const alpha = ctx.entries.get('alpha')
  assert.equal(alpha.body, '# Alpha\n\nbody a')
  assert.equal(alpha.rendered, undefined)
})

test('populateStore: a schema validation failure on one page does not abort the rest', async () => {
  const ctx = mockContext()
  let calls = 0
  ctx.parseData = async ({ data }) => {
    calls++
    if (calls === 1) throw new Error('bad schema')
    return data
  }
  await populateStore(samplePages, ctx)
  assert.equal(ctx.entries.size, 2, 'both pages should still be stored')
})
