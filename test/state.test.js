import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { loadState, saveState, needsUpdate, updatePageState } from '../dist/index.js'

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

test('updatePageState: tracks a page without mutating the input state', () => {
  const state = { version: 1, lastFullSync: null, pages: {} }
  const updated = updatePageState(state, samplePage)

  assert.deepEqual(state.pages, {}, 'original state is untouched')
  assert.equal(needsUpdate(updated, 'page1', '2026-01-01T00:00:00.000Z'), false)
  assert.equal(needsUpdate(updated, 'page1', '2026-02-01T00:00:00.000Z'), true)
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
