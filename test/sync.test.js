import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { buildContentModule, defineContent, emitContentModule } from '../dist/index.js'
import { readSyncedPage } from '../dist/core/sync.js'

const pages = [
  { slug: 'beta', frontmatter: { title: 'Beta' }, content: '# Beta\n\nbody' },
  { slug: 'alpha', frontmatter: { title: 'Alpha' }, content: '# Alpha\n\nbody' },
]

test('buildContentModule: emits pages sorted by slug for stable output', () => {
  const { js } = buildContentModule(pages, {
    importPath: './types.js',
    typeName: 'NotionContent',
  })
  assert.ok(js.indexOf('"alpha"') < js.indexOf('"beta"'), 'alpha should come before beta')
})

test('buildContentModule: js exports pages and pagesBySlug', () => {
  const { js } = buildContentModule(pages, {
    importPath: './types.js',
    typeName: 'NotionContent',
  })
  assert.match(js, /export const pages = /)
  assert.match(js, /export const pagesBySlug = Object\.fromEntries/)
})

test('buildContentModule: dts references the given frontmatter type', () => {
  const { dts } = buildContentModule(pages, {
    importPath: 'notion-to-site',
    typeName: 'PostFrontmatter',
  })
  assert.match(dts, /import type \{ PostFrontmatter \} from "notion-to-site"/)
  assert.match(dts, /frontmatter: PostFrontmatter/)
  assert.match(dts, /export declare const pages: ContentPage\[\]/)
  assert.match(dts, /export declare const pagesBySlug: Record<string, ContentPage>/)
})

test('buildContentModule: the generated js is valid ESM and round-trips the data', async () => {
  const { js } = buildContentModule(pages, {
    importPath: './types.js',
    typeName: 'NotionContent',
  })
  const mod = await import(`data:text/javascript,${encodeURIComponent(js)}`)
  assert.equal(mod.pages.length, 2)
  assert.equal(mod.pages[0].slug, 'alpha')
  assert.equal(mod.pagesBySlug.beta.frontmatter.title, 'Beta')
})

test('emitContentModule: marks the generated directory as ESM for Node 18', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-content-module-'))
  try {
    emitContentModule(pages, dir, {
      importPath: './types.js',
      typeName: 'NotionContent',
    })
    assert.deepEqual(JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8')), {
      type: 'module',
    })
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('defineContent: returns the config unchanged (typed identity helper)', () => {
  const config = { database: 'db', output: './content', adapter: 'markdown' }
  assert.strictEqual(defineContent(config), config)
})

// Regression: an incremental sync that skips a page must still include it in
// the emitted content module. readSyncedPage reconstructs the page from disk so
// an all-skipped run does not emit an empty module.
test('readSyncedPage: round-trips a markdown file into a SyncedPage', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-read-'))
  try {
    writeFileSync(
      join(dir, 'hello.md'),
      '---\nid: hello\nmeta:\n  title: Hi\n---\n# Hi\n\nbody text',
      'utf-8',
    )
    const page = readSyncedPage(dir, 'hello', 'markdown')
    assert.equal(page.slug, 'hello')
    assert.equal(page.frontmatter.meta.title, 'Hi')
    assert.match(page.content, /# Hi/)
    assert.match(page.content, /body text/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('readSyncedPage: returns null for a missing file', () => {
  assert.equal(readSyncedPage('/tmp/nts-definitely-missing-xyz', 'nope', 'markdown'), null)
})
