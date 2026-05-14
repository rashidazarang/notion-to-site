import test from 'node:test'
import assert from 'node:assert/strict'

import {
  introspectSchema,
  propertyToTypes,
  emitTypes,
  extractPropertiesTyped,
} from '../dist/index.js'

// A representative raw data-source properties map — the shape Notion returns.
const rawProps = {
  Name: { id: 't', name: 'Name', type: 'title', title: {} },
  Status: {
    id: 's',
    name: 'Status',
    type: 'select',
    select: { options: [{ name: 'Draft' }, { name: 'Published' }] },
  },
  Tags: {
    id: 'g',
    name: 'Tags',
    type: 'multi_select',
    multi_select: { options: [{ name: 'guide' }, { name: 'news' }] },
  },
  Featured: { id: 'f', name: 'Featured', type: 'checkbox', checkbox: {} },
  Priority: { id: 'p', name: 'Priority', type: 'number', number: {} },
  Related: {
    id: 'r',
    name: 'Related',
    type: 'relation',
    relation: { database_id: 'db1', data_source_id: 'ds1' },
  },
}

test('introspectSchema: identifies the title property and normalizes options', () => {
  const schema = introspectSchema('ds1', rawProps)
  assert.equal(schema.dataSourceId, 'ds1')
  assert.equal(schema.titleProperty, 'Name')
  assert.equal(schema.properties.length, 6)
  assert.deepEqual(
    schema.properties.find((p) => p.name === 'Status').options,
    ['Draft', 'Published'],
  )
  assert.equal(
    schema.properties.find((p) => p.name === 'Related').relation.dataSourceId,
    'ds1',
  )
})

test('propertyToTypes: select becomes a nullable literal union', () => {
  const { ts, zod } = propertyToTypes({
    name: 'Status',
    type: 'select',
    options: ['Draft', 'Published'],
  })
  assert.equal(ts, '"Draft" | "Published" | null')
  assert.equal(zod, 'z.enum(["Draft", "Published"]).nullable()')
})

test('propertyToTypes: multi_select becomes an array of a literal union', () => {
  assert.equal(
    propertyToTypes({ name: 'Tags', type: 'multi_select', options: ['guide', 'news'] }).ts,
    '("guide" | "news")[]',
  )
})

test('propertyToTypes: primitives map correctly', () => {
  assert.equal(propertyToTypes({ name: 'N', type: 'number' }).ts, 'number | null')
  assert.equal(propertyToTypes({ name: 'C', type: 'checkbox' }).ts, 'boolean')
  assert.equal(propertyToTypes({ name: 'T', type: 'rich_text' }).ts, 'string')
  assert.equal(propertyToTypes({ name: 'R', type: 'relation' }).ts, 'string[]')
})

test('propertyToTypes: rollup and formula are honest about unknown result types', () => {
  assert.equal(propertyToTypes({ name: 'Ro', type: 'rollup' }).ts, 'unknown')
  assert.equal(
    propertyToTypes({ name: 'Fo', type: 'formula' }).ts,
    'string | number | boolean | null',
  )
})

test('propertyToTypes: a select with no options falls back to string', () => {
  assert.equal(propertyToTypes({ name: 'S', type: 'select', options: [] }).ts, 'string | null')
})

test('emitTypes: generates a Zod schema with quoted keys and the inferred type', () => {
  const out = emitTypes(introspectSchema('ds1', rawProps))
  assert.match(out, /import \{ z \} from 'zod'/)
  assert.match(out, /export const NotionContentSchema = z\.object\(\{/)
  assert.match(out, /"Status": z\.enum\(\["Draft", "Published"\]\)\.nullable\(\)/)
  assert.match(out, /_id: z\.string\(\)/)
  assert.match(out, /_notion_id: z\.string\(\)/)
  assert.match(out, /export type NotionContent = z\.infer<typeof NotionContentSchema>/)
})

test('extractPropertiesTyped: reads values by real name and type', () => {
  const schema = introspectSchema('ds1', rawProps)
  const page = {
    id: 'page-1',
    properties: {
      Name: { type: 'title', title: [{ plain_text: 'Hello World' }] },
      Status: { type: 'select', select: { name: 'Published' } },
      Tags: { type: 'multi_select', multi_select: [{ name: 'guide' }, { name: 'news' }] },
      Featured: { type: 'checkbox', checkbox: true },
      Priority: { type: 'number', number: 3 },
      Related: { type: 'relation', relation: [{ id: 'p2' }, { id: 'p3' }] },
    },
  }
  const out = extractPropertiesTyped(page, schema)
  assert.equal(out.Name, 'Hello World')
  assert.equal(out.Status, 'Published')
  assert.deepEqual(out.Tags, ['guide', 'news'])
  assert.equal(out.Featured, true)
  assert.equal(out.Priority, 3)
  assert.deepEqual(out.Related, ['p2', 'p3'])
})

test('extractPropertiesTyped: missing properties get type-appropriate empties', () => {
  const schema = introspectSchema('ds1', rawProps)
  const out = extractPropertiesTyped({ id: 'p', properties: {} }, schema)
  assert.equal(out.Name, '', 'a missing title is an empty string, not null')
  assert.equal(out.Status, null)
  assert.deepEqual(out.Tags, [])
  assert.equal(out.Featured, false)
  assert.equal(out.Priority, null)
  assert.deepEqual(out.Related, [])
})
