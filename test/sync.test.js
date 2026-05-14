import test from 'node:test'
import assert from 'node:assert/strict'

import { buildContentModule, defineContent } from '../dist/index.js'

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

test('defineContent: returns the config unchanged (typed identity helper)', () => {
  const config = { database: 'db', output: './content', adapter: 'markdown' }
  assert.strictEqual(defineContent(config), config)
})
