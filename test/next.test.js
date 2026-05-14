import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { getAllPages, getPageBySlug, withNotion, NotionContent } from '../dist/next/index.js'

function makeContentModule() {
  const dir = mkdtempSync(join(tmpdir(), 'nts-next-'))
  const pages = [
    { slug: 'alpha', frontmatter: { title: 'Alpha' }, content: '# Alpha' },
    { slug: 'beta', frontmatter: { title: 'Beta' }, content: '# Beta' },
  ]
  writeFileSync(
    join(dir, 'index.js'),
    `export const pages = ${JSON.stringify(pages)}\nexport const pagesBySlug = {}\n`,
    'utf-8',
  )
  return dir
}

test('getAllPages: loads every page from the content module', async () => {
  const dir = makeContentModule()
  try {
    const pages = await getAllPages(dir)
    assert.equal(pages.length, 2)
    assert.equal(pages[0].slug, 'alpha')
    assert.equal(pages[0].frontmatter.title, 'Alpha')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('getPageBySlug: returns the matching page, or null', async () => {
  const dir = makeContentModule()
  try {
    const beta = await getPageBySlug('beta', dir)
    assert.equal(beta?.frontmatter.title, 'Beta')
    assert.equal(await getPageBySlug('missing', dir), null)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('getAllPages: a missing content module throws a clear error', async () => {
  await assert.rejects(
    () => getAllPages('/tmp/definitely-not-a-real-nts-dir-xyz'),
    /could not load the content module/,
  )
})

test('withNotion: a sync failure cannot block the build — the config still resolves', async () => {
  const nextConfig = { reactStrictMode: true }
  // An empty config makes the sync throw; withNotion must still resolve to the
  // Next config so the build is never blocked by a flaky sync.
  const wrapped = withNotion(nextConfig, { config: {} })
  assert.equal(typeof wrapped, 'function')
  assert.deepEqual(await wrapped(), nextConfig)
})

test('NotionContent: renders a markdown body to an HTML div element', () => {
  const el = NotionContent({ body: '# Hello\n\nA paragraph.' })
  assert.equal(el.type, 'div')
  assert.match(el.props.dangerouslySetInnerHTML.__html, /<h1[^>]*>Hello<\/h1>/)
  assert.match(el.props.dangerouslySetInnerHTML.__html, /<p>A paragraph\.<\/p>/)
})
