import test from 'node:test'
import assert from 'node:assert/strict'
import fc from 'fast-check'

import { renderRichText } from '../dist/index.js'

// ── Arbitraries that model Notion's RichTextItemResponse shape ───────────────

const colorArb = fc.constantFrom(
  'default',
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
  'default_background',
  'gray_background',
  'brown_background',
  'orange_background',
  'yellow_background',
  'green_background',
  'blue_background',
  'purple_background',
  'pink_background',
  'red_background',
)

const annotationsArb = fc.record({
  bold: fc.boolean(),
  italic: fc.boolean(),
  strikethrough: fc.boolean(),
  underline: fc.boolean(),
  code: fc.boolean(),
  color: colorArb,
})

const textItemArb = fc.record({
  type: fc.constant('text'),
  text: fc.record({
    content: fc.string(),
    link: fc.option(fc.record({ url: fc.webUrl() }), { nil: null }),
  }),
  annotations: annotationsArb,
  plain_text: fc.string(),
  href: fc.option(fc.webUrl(), { nil: null }),
})

const equationItemArb = fc.record({
  type: fc.constant('equation'),
  equation: fc.record({ expression: fc.string() }),
  annotations: annotationsArb,
  plain_text: fc.string(),
  href: fc.option(fc.webUrl(), { nil: null }),
})

const pageMentionArb = fc.record({
  type: fc.constant('mention'),
  mention: fc.record({
    type: fc.constant('page'),
    page: fc.record({ id: fc.uuid() }),
  }),
  annotations: annotationsArb,
  plain_text: fc.string({ minLength: 1 }),
  href: fc.option(fc.webUrl(), { nil: null }),
})

const userMentionArb = fc.record({
  type: fc.constant('mention'),
  mention: fc.record({
    type: fc.constant('user'),
    user: fc.record({ id: fc.uuid() }),
  }),
  annotations: annotationsArb,
  plain_text: fc.string(),
  href: fc.constant(null),
})

const isoDateArb = fc
  .date({ noInvalidDate: true })
  .map((d) => d.toISOString())

const dateMentionArb = fc.record({
  type: fc.constant('mention'),
  mention: fc.record({
    type: fc.constant('date'),
    date: fc.record({
      start: isoDateArb,
      end: fc.option(isoDateArb, { nil: null }),
    }),
  }),
  annotations: annotationsArb,
  plain_text: fc.string(),
  href: fc.constant(null),
})

const linkPreviewMentionArb = fc.record({
  type: fc.constant('mention'),
  mention: fc.record({
    type: fc.constant('link_preview'),
    link_preview: fc.record({ url: fc.webUrl() }),
  }),
  annotations: annotationsArb,
  plain_text: fc.string(),
  href: fc.option(fc.webUrl(), { nil: null }),
})

const richTextItemArb = fc.oneof(
  textItemArb,
  equationItemArb,
  pageMentionArb,
  userMentionArb,
  dateMentionArb,
  linkPreviewMentionArb,
)

const richTextArrayArb = fc.array(richTextItemArb, { maxLength: 20 })

const colorStrategyArb = fc.constantFrom('drop', 'inline', 'class')

const ctxArb = fc.record({
  slugMap: fc.constant(new Map()),
  linkPrefix: fc.constantFrom('/blog', '/posts', '/'),
  color: colorStrategyArb,
})

// ── Properties ───────────────────────────────────────────────────────────────

test('property: renderRichText never throws on any valid items + ctx', () => {
  fc.assert(
    fc.property(richTextArrayArb, ctxArb, (items, ctx) => {
      renderRichText(items, ctx)
      return true
    }),
    { numRuns: 500 },
  )
})

test('property: renderRichText always returns a string', () => {
  fc.assert(
    fc.property(richTextArrayArb, ctxArb, (items, ctx) => {
      return typeof renderRichText(items, ctx) === 'string'
    }),
    { numRuns: 500 },
  )
})

test('property: empty / null / undefined input returns empty string', () => {
  const ctx = { slugMap: new Map(), linkPrefix: '/', color: 'drop' }
  assert.equal(renderRichText([], ctx), '')
  assert.equal(renderRichText(null, ctx), '')
  assert.equal(renderRichText(undefined, ctx), '')
})

test('property: color="drop" never emits a <span>', () => {
  fc.assert(
    fc.property(richTextArrayArb, (items) => {
      const out = renderRichText(items, { slugMap: new Map(), linkPrefix: '/', color: 'drop' })
      return !out.includes('<span')
    }),
    { numRuns: 500 },
  )
})

test('property: color="class" only emits class-based spans (no inline style)', () => {
  fc.assert(
    fc.property(richTextArrayArb, (items) => {
      const out = renderRichText(items, { slugMap: new Map(), linkPrefix: '/', color: 'class' })
      const spans = out.match(/<span[^>]*>/g) || []
      return spans.every((s) => s.includes('class="notion-color-') && !s.includes('style='))
    }),
    { numRuns: 500 },
  )
})

test('property: color="inline" only emits style-based spans (no class=)', () => {
  fc.assert(
    fc.property(richTextArrayArb, (items) => {
      const out = renderRichText(items, { slugMap: new Map(), linkPrefix: '/', color: 'inline' })
      const spans = out.match(/<span[^>]*>/g) || []
      return spans.every((s) => s.includes('style=') && !s.includes('class='))
    }),
    { numRuns: 500 },
  )
})

test('property: bold + non-empty content always wraps in ** ... **', () => {
  fc.assert(
    fc.property(
      // Restrict to non-empty plain content without markdown chars that could confuse the match.
      fc.string({ minLength: 1 }).filter((s) => !/[*_`~<>\[\]()\\]/.test(s) && !/\s$|^\s/.test(s)),
      (content) => {
        const item = {
          type: 'text',
          text: { content, link: null },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: content,
          href: null,
        }
        const out = renderRichText([item], { slugMap: new Map(), linkPrefix: '/', color: 'drop' })
        return out === `**${content}**`
      },
    ),
    { numRuns: 200 },
  )
})

test('property: code annotation wraps content in backticks', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1 }).filter((s) => !/[`*_~<>\[\]()\\]/.test(s)),
      (content) => {
        const item = {
          type: 'text',
          text: { content, link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: true,
            color: 'default',
          },
          plain_text: content,
          href: null,
        }
        const out = renderRichText([item], { slugMap: new Map(), linkPrefix: '/', color: 'drop' })
        return out === `\`${content}\``
      },
    ),
    { numRuns: 200 },
  )
})

test('property: bold + code wraps with code innermost, bold outermost', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1 }).filter((s) => !/[`*_~<>\[\]()\\]/.test(s)),
      (content) => {
        const item = {
          type: 'text',
          text: { content, link: null },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: true,
            color: 'default',
          },
          plain_text: content,
          href: null,
        }
        const out = renderRichText([item], { slugMap: new Map(), linkPrefix: '/', color: 'drop' })
        return out === `**\`${content}\`**`
      },
    ),
    { numRuns: 200 },
  )
})

test('property: a page mention with a known slug resolves to a link', () => {
  fc.assert(
    fc.property(
      fc.uuid(),
      fc.string({ minLength: 1 }).filter((s) => !/[\[\]()]/.test(s)),
      fc.string({ minLength: 1 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
      (pageId, label, slug) => {
        const slugMap = new Map([[pageId, slug]])
        const item = {
          type: 'mention',
          mention: { type: 'page', page: { id: pageId } },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: label,
          href: null,
        }
        const out = renderRichText([item], { slugMap, linkPrefix: '/blog', color: 'drop' })
        return out === `[${label}](/blog/${slug})`
      },
    ),
    { numRuns: 200 },
  )
})

test('property: an unresolved page mention falls back to plain_text', () => {
  fc.assert(
    fc.property(
      fc.uuid(),
      fc.string({ minLength: 1 }).filter((s) => !/[\[\]()]/.test(s)),
      (pageId, label) => {
        const item = {
          type: 'mention',
          mention: { type: 'page', page: { id: pageId } },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: label,
          href: null,
        }
        const out = renderRichText([item], { slugMap: new Map(), linkPrefix: '/', color: 'drop' })
        return out === label
      },
    ),
    { numRuns: 200 },
  )
})

test('property: equation item with no annotations renders as $expression$', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1 }).filter((s) => !/[$*_`~<>\[\]()\\]/.test(s)),
      (expression) => {
        const item = {
          type: 'equation',
          equation: { expression },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: expression,
          href: null,
        }
        const out = renderRichText([item], { slugMap: new Map(), linkPrefix: '/', color: 'drop' })
        return out === `$${expression}$`
      },
    ),
    { numRuns: 200 },
  )
})

test('property: concatenation preserves input order (sentinels)', () => {
  // Items with sentinel content separated by other items — sentinels appear in order in the output.
  fc.assert(
    fc.property(fc.array(fc.string({ minLength: 1, maxLength: 8 }).filter((s) => /^[a-z]+$/.test(s)), { minLength: 2, maxLength: 8 }), (sentinels) => {
      // Make all sentinels unique to avoid accidental substring overlap.
      const uniq = Array.from(new Set(sentinels))
      if (uniq.length < 2) return true
      const items = uniq.map((s) => ({
        type: 'text',
        text: { content: s, link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: s,
        href: null,
      }))
      const out = renderRichText(items, { slugMap: new Map(), linkPrefix: '/', color: 'drop' })
      // Each sentinel appears, and in input order.
      let cursor = 0
      for (const s of uniq) {
        const idx = out.indexOf(s, cursor)
        if (idx < 0) return false
        cursor = idx + s.length
      }
      return true
    }),
    { numRuns: 200 },
  )
})
