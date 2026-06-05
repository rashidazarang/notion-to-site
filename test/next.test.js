import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  getAllPages,
  getPageBySlug,
  NotionContent,
  NotionImage,
} from '../dist/next/index.js'
// withNotion is the build-time plugin — separate subpath so the runtime barrel
// above stays free of the sync engine (config loader, sharp, @notionhq/client).
import { withNotion } from '../dist/next/plugin.js'

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

test('NotionImage: falls back to a plain <img> when there is no manifest entry', () => {
  // Empty temp dir → no images.json → graceful fallback.
  const dir = mkdtempSync(join(tmpdir(), 'nts-img-noman-'))
  try {
    const el = NotionImage({ src: '/images/foo.webp', alt: 'x', manifestDir: dir })
    assert.equal(el.type, 'img')
    assert.equal(el.props.src, '/images/foo.webp')
    assert.equal(el.props.alt, 'x')
    assert.equal(el.props.srcSet, undefined)
    assert.equal(el.props.style?.backgroundImage, undefined)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('NotionImage: uses placeholder + srcSet from the manifest', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-img-man-'))
  try {
    writeFileSync(
      join(dir, 'images.json'),
      JSON.stringify({
        '/images/abc.webp': {
          placeholder: 'data:image/webp;base64,AAAA',
          sizes: [
            { width: 400, urlPath: '/images/abc-400.webp' },
            { width: 800, urlPath: '/images/abc-800.webp' },
          ],
        },
      }),
      'utf-8',
    )
    const el = NotionImage({ src: '/images/abc.webp', alt: '', manifestDir: dir })
    assert.equal(el.type, 'img')
    assert.equal(el.props.src, '/images/abc.webp')
    assert.equal(el.props.srcSet, '/images/abc-400.webp 400w, /images/abc-800.webp 800w')
    assert.match(el.props.style.backgroundImage, /url\(data:image\/webp;base64,AAAA\)/)
    assert.equal(el.props.style.backgroundSize, 'cover')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runtime barrel (next/index) stays free of the build-time plugin', async () => {
  // Architectural guard: withNotion must NOT be re-exported from the runtime
  // barrel, so pages importing getAllPages/NotionContent don't transitively
  // pull the sync engine into their server bundle or Next's file trace.
  const barrel = await import('../dist/next/index.js')
  assert.equal(barrel.withNotion, undefined)
  assert.equal(typeof barrel.getAllPages, 'function')

  const plugin = await import('../dist/next/plugin.js')
  assert.equal(typeof plugin.withNotion, 'function')
})
