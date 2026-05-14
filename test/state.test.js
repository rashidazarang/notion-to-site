import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { loadState, saveState, needsUpdate, recordPage } from '../dist/index.js'

const samplePage = {
  pageId: 'page1',
  slug: 'p1',
  lastEditedTime: '2026-01-01T00:00:00.000Z',
  outputPath: '/out/p1.md',
  imageHashes: {},
}

test('needsUpdate: untracked pages always need an update', () => {
  const state = { version: 1, lastFullSync: null, pages: {} }
  assert.equal(needsUpdate(state, 'page1', '2026-01-01T00:00:00.000Z'), true)
})

test('recordPage: records an entry in place', () => {
  const state = { version: 1, lastFullSync: null, pages: {} }
  recordPage(state, samplePage)
  assert.equal(needsUpdate(state, 'page1', '2026-01-01T00:00:00.000Z'), false)
  assert.equal(needsUpdate(state, 'page1', '2026-02-01T00:00:00.000Z'), true)
})

test('recordPage: distinct-key writes accumulate without clobbering', () => {
  const state = { version: 1, lastFullSync: null, pages: {} }
  for (let i = 0; i < 50; i++) {
    recordPage(state, { ...samplePage, pageId: `page${i}`, slug: `p${i}` })
  }
  assert.equal(Object.keys(state.pages).length, 50)
})

test('loadState: returns a fresh state for a directory with no state file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-empty-'))
  try {
    const state = loadState(dir)
    assert.equal(state.version, 1)
    assert.equal(state.lastFullSync, null)
    assert.deepEqual(state.pages, {})
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('loadState: recovers from a corrupt state file instead of crashing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-corrupt-'))
  try {
    writeFileSync(join(dir, '.nts-state.json'), '{ this is not valid json', 'utf-8')
    const state = loadState(dir)
    assert.equal(state.version, 1)
    assert.deepEqual(state.pages, {})
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('saveState / loadState: round-trips state to disk', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-state-'))
  try {
    const state = {
      version: 1,
      lastFullSync: '2026-01-01T00:00:00.000Z',
      pages: { page1: samplePage },
    }
    saveState(dir, state)
    assert.deepEqual(loadState(dir), state)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('saveState: creates the output directory if it does not exist', () => {
  const base = mkdtempSync(join(tmpdir(), 'nts-mkdir-'))
  const dir = join(base, 'nested', 'output')
  try {
    const state = { version: 1, lastFullSync: null, pages: {} }
    saveState(dir, state) // must not throw
    assert.deepEqual(loadState(dir), state)
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
})
