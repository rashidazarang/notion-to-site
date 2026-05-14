import test from 'node:test'
import assert from 'node:assert/strict'

import {
  slugify,
  resolveNotionLinks,
  stripBackLinks,
  generateToc,
  extractDescription,
  computeReadingTime,
  computeWordCount,
  stripMarkdownInline,
  extractComment,
  detectLanguage,
} from '../dist/index.js'

test('slugify: lowercases and hyphenates', () => {
  assert.equal(slugify('Hello World'), 'hello-world')
  assert.equal(slugify('Multiple   Spaces'), 'multiple-spaces')
})

test('slugify: strips diacritics to ASCII', () => {
  assert.equal(slugify('Adaptación Lingüística'), 'adaptacion-linguistica')
  assert.equal(slugify('café résumé'), 'cafe-resume')
})

test('slugify: drops special characters and edge hyphens', () => {
  assert.equal(slugify('Special!@#$%Chars'), 'specialchars')
  assert.equal(slugify('--Leading-and-Trailing--'), 'leading-and-trailing')
  assert.equal(slugify('  trim me  '), 'trim-me')
  assert.equal(slugify(''), '')
})

test('resolveNotionLinks: maps known page ids to slugs', () => {
  const id = 'abcdef0123456789abcdef0123456789'
  const map = new Map([[id, 'my-post']])
  assert.equal(resolveNotionLinks(`[x](/${id})`, map, '/blog'), '[x](/blog/my-post)')
})

test('resolveNotionLinks: unknown ids fall back to the bare hex id', () => {
  const unknown = '00000000000000000000000000000000'
  assert.equal(
    resolveNotionLinks(`[x](/${unknown})`, new Map(), '/blog'),
    '[x](/blog/00000000000000000000000000000000)',
  )
})

test('stripBackLinks: removes Notion back-navigation artifacts', () => {
  const input = [
    '### [← Back to home](/)',
    '',
    '# Real Title',
    '',
    'Normal paragraph stays.',
    '',
    '**← Go back**',
    '[← Previous](/prev)',
  ].join('\n')
  const out = stripBackLinks(input)
  assert.ok(!out.includes('←'), 'arrow artifacts removed')
  assert.ok(out.includes('# Real Title'))
  assert.ok(out.includes('Normal paragraph stays.'))
})

test('stripBackLinks: keeps real headings that merely contain links', () => {
  assert.equal(stripBackLinks('## A real heading'), '## A real heading')
})

test('generateToc: builds a contents list for 3+ headings', () => {
  const toc = generateToc('## Alpha\n## Beta\n## Gamma')
  assert.ok(toc.startsWith('## Contents'))
  assert.ok(toc.includes('- [Alpha](#alpha)'))
  assert.ok(toc.includes('- [Gamma](#gamma)'))
})

test('generateToc: returns empty string below the heading threshold', () => {
  assert.equal(generateToc('## Only one'), '')
  assert.equal(generateToc('## A\n## B'), '')
})

test('extractDescription: returns the first real paragraph', () => {
  const md = '# Heading\n\n![img](x.png)\n\nThe actual first paragraph of content here.'
  assert.equal(extractDescription(md), 'The actual first paragraph of content here.')
})

test('extractDescription: skips short or non-prose content', () => {
  assert.equal(extractDescription('# Just a heading'), '')
  assert.equal(extractDescription('short'), '')
})

test('computeWordCount / computeReadingTime', () => {
  assert.equal(computeWordCount('one two three'), 3)
  assert.equal(computeWordCount(''), 0)
  assert.equal(computeReadingTime('word '.repeat(200).trim()), 1)
  assert.equal(computeReadingTime('word '.repeat(401).trim()), 3)
  assert.equal(computeReadingTime(''), 1)
})

test('stripMarkdownInline: removes inline syntax', () => {
  assert.equal(stripMarkdownInline('**bold** and *italic* and `code`'), 'bold and italic and code')
  assert.equal(stripMarkdownInline('[link](http://x.com)'), 'link')
  assert.equal(stripMarkdownInline('![alt](img.png)'), '')
  assert.equal(stripMarkdownInline('~~strike~~'), 'strike')
})

test('extractComment: pulls the first paragraph, stops at the break', () => {
  assert.equal(
    extractComment('# Title\n\nThe first paragraph of the post.', 'Title'),
    'The first paragraph of the post.',
  )
  assert.equal(extractComment('First para.\n\nSecond para.', 'X'), 'First para.')
})

test('extractComment: empty when content is only a heading', () => {
  assert.equal(extractComment('# Only Heading', 'Only Heading'), '')
})

test('detectLanguage: distinguishes English and Spanish', () => {
  assert.equal(
    detectLanguage('the quick brown fox jumps over the lazy dog and runs fast today'),
    'English',
  )
  assert.equal(
    detectLanguage('hola que tal estoy en la casa de mi amigo con los perros para todo'),
    'Español',
  )
})

test('detectLanguage: empty when there is too little text', () => {
  assert.equal(detectLanguage('short text'), '')
})
