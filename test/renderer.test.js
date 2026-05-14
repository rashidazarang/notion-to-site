import test from 'node:test'
import assert from 'node:assert/strict'

import { tableRowsToMarkdown } from '../dist/index.js'

test('tableRowsToMarkdown: with a column header, row 0 is the header', () => {
  const md = tableRowsToMarkdown(
    [
      ['Name', 'Age'],
      ['Ada', '36'],
      ['Alan', '41'],
    ],
    true,
  )
  assert.deepEqual(md.split('\n'), [
    '| Name | Age |',
    '| --- | --- |',
    '| Ada | 36 |',
    '| Alan | 41 |',
  ])
})

test('tableRowsToMarkdown: without a column header, an empty header row is emitted', () => {
  const md = tableRowsToMarkdown(
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
    false,
  )
  assert.deepEqual(md.split('\n'), ['|  |  |', '| --- | --- |', '| a | b |', '| c | d |'])
})

test('tableRowsToMarkdown: ragged rows are padded to the widest row', () => {
  const md = tableRowsToMarkdown([['a'], ['b', 'c', 'd']], false)
  const lines = md.split('\n')
  assert.equal(lines[1], '| --- | --- | --- |')
  assert.equal(lines[2], '| a |  |  |')
  assert.equal(lines[3], '| b | c | d |')
})

test('tableRowsToMarkdown: empty input returns an empty string', () => {
  assert.equal(tableRowsToMarkdown([], true), '')
})
