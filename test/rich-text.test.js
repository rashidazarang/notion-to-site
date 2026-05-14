import test from 'node:test'
import assert from 'node:assert/strict'

import { renderRichText } from '../dist/index.js'

const ctx = (overrides = {}) => ({
  slugMap: new Map(),
  linkPrefix: '/blog',
  color: 'drop',
  ...overrides,
})

const ann = (overrides = {}) => ({
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  code: false,
  color: 'default',
  ...overrides,
})

const text = (content, annotations = {}, link = null) => ({
  type: 'text',
  text: { content, link: link ? { url: link } : null },
  annotations: ann(annotations),
  plain_text: content,
  href: link,
})

test('renderRichText: plain text passes through', () => {
  assert.equal(renderRichText([text('hello world')], ctx()), 'hello world')
})

test('renderRichText: empty / nullish input returns an empty string', () => {
  assert.equal(renderRichText([], ctx()), '')
  assert.equal(renderRichText(undefined, ctx()), '')
  assert.equal(renderRichText(null, ctx()), '')
})

test('renderRichText: applies each annotation', () => {
  assert.equal(renderRichText([text('x', { bold: true })], ctx()), '**x**')
  assert.equal(renderRichText([text('x', { italic: true })], ctx()), '_x_')
  assert.equal(renderRichText([text('x', { code: true })], ctx()), '`x`')
  assert.equal(renderRichText([text('x', { strikethrough: true })], ctx()), '~~x~~')
  assert.equal(renderRichText([text('x', { underline: true })], ctx()), '<u>x</u>')
})

test('renderRichText: nested annotations wrap code innermost, bold outermost', () => {
  assert.equal(
    renderRichText([text('x', { bold: true, italic: true, code: true })], ctx()),
    '**_`x`_**',
  )
})

test('renderRichText: a link wraps the annotated text', () => {
  assert.equal(
    renderRichText([text('click', { bold: true }, 'https://x.com')], ctx()),
    '[**click**](https://x.com)',
  )
})

test('renderRichText: concatenates multiple items in order', () => {
  assert.equal(
    renderRichText([text('a '), text('bold', { bold: true }), text(' c')], ctx()),
    'a **bold** c',
  )
})

test('renderRichText: inline equations render with single dollars', () => {
  const eq = {
    type: 'equation',
    equation: { expression: 'e=mc^2' },
    annotations: ann(),
    plain_text: 'e=mc^2',
    href: null,
  }
  assert.equal(renderRichText([eq], ctx()), '$e=mc^2$')
})

test('renderRichText: a @page mention resolves to a link via slugMap', () => {
  const mention = {
    type: 'mention',
    mention: { type: 'page', page: { id: 'abc-123' } },
    annotations: ann(),
    plain_text: 'My Page',
    href: null,
  }
  const slugMap = new Map([['abc-123', 'my-page']])
  assert.equal(renderRichText([mention], ctx({ slugMap })), '[My Page](/blog/my-page)')
})

test('renderRichText: an unresolved @page mention falls back to plain text', () => {
  const mention = {
    type: 'mention',
    mention: { type: 'page', page: { id: 'unknown-id' } },
    annotations: ann(),
    plain_text: 'Some Page',
    href: null,
  }
  assert.equal(renderRichText([mention], ctx()), 'Some Page')
})

test('renderRichText: user / date mentions use Notion plain_text', () => {
  const userMention = {
    type: 'mention',
    mention: { type: 'user', user: { id: 'u1' } },
    annotations: ann(),
    plain_text: 'Ada Lovelace',
    href: null,
  }
  assert.equal(renderRichText([userMention], ctx()), 'Ada Lovelace')
})

test('renderRichText: color strategy "drop" ignores color', () => {
  assert.equal(renderRichText([text('x', { color: 'red' })], ctx({ color: 'drop' })), 'x')
})

test('renderRichText: color strategy "inline" emits a styled span', () => {
  assert.equal(
    renderRichText([text('x', { color: 'red' })], ctx({ color: 'inline' })),
    '<span style="color:#d44c47">x</span>',
  )
})

test('renderRichText: color strategy "inline" handles background colors', () => {
  assert.equal(
    renderRichText([text('x', { color: 'blue_background' })], ctx({ color: 'inline' })),
    '<span style="background-color:#e7f3f8">x</span>',
  )
})

test('renderRichText: color strategy "class" emits a class span', () => {
  assert.equal(
    renderRichText([text('x', { color: 'green' })], ctx({ color: 'class' })),
    '<span class="notion-color-green">x</span>',
  )
})

test('renderRichText: the default color is never wrapped', () => {
  assert.equal(
    renderRichText([text('x', { color: 'default' })], ctx({ color: 'inline' })),
    'x',
  )
})
