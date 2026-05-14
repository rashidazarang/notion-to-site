import test from 'node:test'
import assert from 'node:assert/strict'

import { migrationAdvice } from '../dist/index.js'

test('migrationAdvice: a pinned config needs no action', () => {
  const legacy = migrationAdvice({ schema: { strict: false, mode: 'legacy' } })
  assert.equal(legacy.pinned, true)
  assert.match(legacy.message, /pins schema\.mode: 'legacy'/)

  const typed = migrationAdvice({ schema: { strict: false, mode: 'typed' } })
  assert.equal(typed.pinned, true)
  assert.match(typed.message, /'typed'/)
})

test('migrationAdvice: an unpinned config gets the 1.0 migration guidance', () => {
  const advice = migrationAdvice({ schema: { strict: false } })
  assert.equal(advice.pinned, false)
  assert.match(advice.message, /default schema mode to "typed"/)
  assert.match(advice.message, /mode: 'legacy'/)
})

test('migrationAdvice: handles a config with no schema block at all', () => {
  const advice = migrationAdvice({})
  assert.equal(advice.pinned, false)
})
