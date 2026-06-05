import test from 'node:test'
import assert from 'node:assert/strict'

import { validateFrontmatter, PostFrontmatterSchema, extractProperties } from '../dist/index.js'

const minimalFrontmatter = {
  id: 'my-post',
  path: '/content/my-post.md',
  created: '2026-01-01',
  last_updated: '2026-01-02',
  source: { platform: 'notion', page_id: 'abc123' },
  meta: { title: 'My Post' },
}

test('validateFrontmatter: accepts a minimal object and fills defaults', () => {
  const parsed = validateFrontmatter(minimalFrontmatter)
  assert.equal(parsed.meta.title, 'My Post')
  assert.equal(parsed.type, 'post')
  assert.equal(parsed.version, '1.0')
  assert.equal(parsed.meta.status, 'Not started')
  assert.equal(parsed.meta.post_type, 'Post')
  assert.deepEqual(parsed.meta.tags, [])
  assert.deepEqual(parsed.meta.domain_tags, [])
  assert.equal(parsed.meta.reading_time, 1)
})

test('validateFrontmatter: rejects a missing title', () => {
  assert.throws(() => validateFrontmatter({ ...minimalFrontmatter, meta: {} }))
})

test('validateFrontmatter: rejects a non-notion source platform', () => {
  assert.throws(() =>
    validateFrontmatter({
      ...minimalFrontmatter,
      source: { platform: 'wordpress', page_id: 'abc123' },
    }),
  )
})

test('PostFrontmatterSchema.safeParse: reports issues without throwing', () => {
  const result = PostFrontmatterSchema.safeParse({ id: 'x' })
  assert.equal(result.success, false)
  assert.ok(result.error.issues.length > 0)
})

test('extractProperties: reads common Notion property types', () => {
  const page = {
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'Hello World' }] },
      Status: { type: 'select', select: { name: 'Published' } },
      Tags: { type: 'multi_select', multi_select: [{ name: 'a' }, { name: 'b' }] },
      Featured: { type: 'checkbox', checkbox: true },
      'Domain Tags': { type: 'multi_select', multi_select: [{ name: 'site-a' }] },
    },
    cover: { type: 'external', external: { url: 'https://x.com/cover.png' } },
  }
  const props = extractProperties(page)
  assert.equal(props.title, 'Hello World')
  assert.equal(props.status, 'Published')
  assert.deepEqual(props.tags, ['a', 'b'])
  assert.equal(props.main_tag, 'a')
  assert.equal(props.featured, true)
  assert.deepEqual(props.domain_tags, ['site-a'])
  assert.equal(props.cover_image, 'https://x.com/cover.png')
})

test('extractProperties: returns sane defaults for an empty page', () => {
  const props = extractProperties({ properties: {}, cover: null })
  assert.equal(props.title, '')
  assert.equal(props.slug, null)
  assert.equal(props.status, 'Not started')
  assert.deepEqual(props.tags, [])
  assert.equal(props.featured, false)
  assert.equal(props.post_type, 'Post')
  assert.deepEqual(props.domain_tags, [])
})

test('extractProperties: a user-set slug is sanitized — no path traversal', () => {
  const page = {
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'Whatever' }] },
      Slug: { type: 'rich_text', rich_text: [{ plain_text: '../../etc/passwd' }] },
    },
    cover: null,
  }
  const props = extractProperties(page)
  // The cleaned slug must not contain path separators or `..` traversals.
  assert.ok(props.slug && !props.slug.includes('/'))
  assert.ok(props.slug && !props.slug.includes('..'))
  assert.equal(props.slug, 'etcpasswd')
})

test('extractProperties: a custom slug from a URL property is cleaned the same way', () => {
  const page = {
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'X' }] },
      URL: { type: 'url', url: '/blog/My Cool Post' },
    },
    cover: null,
  }
  const props = extractProperties(page)
  assert.equal(props.slug, 'blogmy-cool-post')
})

test('extractProperties: a slug of only special characters falls back to null', () => {
  const page = {
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'X' }] },
      Slug: { type: 'rich_text', rich_text: [{ plain_text: '....' }] },
    },
    cover: null,
  }
  const props = extractProperties(page)
  // slugify('....') → '' → null fallback, so sync.ts will slugify(title) instead.
  assert.equal(props.slug, null)
})

test('extractProperties: cover_image prefers a Cover url property over page.cover', () => {
  const page = {
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'X' }] },
      Cover: { type: 'url', url: 'https://cdn.example.com/from-prop.webp' },
    },
    cover: { type: 'external', external: { url: 'https://x.com/page-cover.png' } },
  }
  assert.equal(extractProperties(page).cover_image, 'https://cdn.example.com/from-prop.webp')
})

test('extractProperties: cover_image reads the first file from a Cover files property', () => {
  const page = {
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'X' }] },
      Cover: {
        type: 'files',
        files: [{ type: 'external', external: { url: 'https://cdn.example.com/file.webp' } }],
      },
    },
    cover: null,
  }
  assert.equal(extractProperties(page).cover_image, 'https://cdn.example.com/file.webp')
})

test('extractProperties: cover_image falls back to page.cover when no Cover property', () => {
  const page = {
    properties: { Name: { type: 'title', title: [{ plain_text: 'X' }] } },
    cover: { type: 'external', external: { url: 'https://x.com/page-cover.png' } },
  }
  assert.equal(extractProperties(page).cover_image, 'https://x.com/page-cover.png')
})

test('extractProperties: created reads a Date property', () => {
  const page = {
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'X' }] },
      Date: { type: 'date', date: { start: '2026-02-01' } },
    },
    cover: null,
  }
  assert.equal(extractProperties(page).created, '2026-02-01')
})

test('extractProperties: created normalizes a datetime to YYYY-MM-DD', () => {
  const page = {
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'X' }] },
      Published: { type: 'date', date: { start: '2026-02-01T10:00:00.000Z' } },
    },
    cover: null,
  }
  assert.equal(extractProperties(page).created, '2026-02-01')
})

test('extractProperties: created is null without a Date property', () => {
  const props = extractProperties({ properties: {}, cover: null })
  assert.equal(props.created, null)
})
