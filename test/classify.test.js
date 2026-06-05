import test from 'node:test'
import assert from 'node:assert/strict'

import { classifyDatabase, inferRoles } from '../dist/index.js'

const prop = (name, type, extra = {}) => ({ name, type, ...extra })
const schema = (properties, titleProperty = 'Name') => ({
  dataSourceId: 'ds',
  titleProperty,
  properties,
})

test('classifyDatabase: a blog database', () => {
  const c = classifyDatabase(
    schema([
      prop('Name', 'title'),
      prop('Date', 'date'),
      prop('Category', 'multi_select', { options: ['Business'] }),
      prop('Tags', 'multi_select', { options: ['x'] }),
      prop('Status', 'select', { options: ['Published'] }),
      prop('Author', 'rich_text'),
      prop('Description', 'rich_text'),
      prop('Language', 'select', { options: ['en', 'es'] }),
    ]),
  )
  assert.equal(c.kind, 'blog')
  assert.ok(c.confidence >= 0.6, `confidence ${c.confidence}`)
  assert.equal(c.roles.title, 'Name')
  assert.equal(c.roles.date, 'Date')
  assert.equal(c.roles.status, 'Status')
  assert.equal(c.roles.language, 'Language')
  assert.equal(c.roles.category, 'Category')
})

test('classifyDatabase: a people / team database', () => {
  const c = classifyDatabase(
    schema([prop('Name', 'title'), prop('Email', 'email'), prop('Phone', 'phone_number'), prop('Role', 'rich_text')]),
  )
  assert.equal(c.kind, 'people')
})

test('classifyDatabase: a tasks database', () => {
  const c = classifyDatabase(
    schema([
      prop('Name', 'title'),
      prop('Status', 'status', { options: ['Todo', 'Done'] }),
      prop('Due', 'date'),
      prop('Priority', 'select', { options: ['High'] }),
      prop('Assignee', 'people'),
    ]),
  )
  assert.equal(c.kind, 'tasks')
})

test('classifyDatabase: an unknown shape falls back to generic', () => {
  const c = classifyDatabase(schema([prop('Name', 'title'), prop('Notes', 'rich_text')]))
  assert.equal(c.kind, 'generic')
  assert.equal(c.confidence, 0)
})

test('inferRoles: detects slug and cover by name + type', () => {
  const r = inferRoles(
    schema([prop('Name', 'title'), prop('Slug', 'rich_text'), prop('Cover', 'url')]),
  )
  assert.equal(r.title, 'Name')
  assert.equal(r.slug, 'Slug')
  assert.equal(r.cover, 'Cover')
})
