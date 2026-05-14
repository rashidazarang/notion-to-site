import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

export interface PageState {
  pageId: string
  slug: string
  lastEditedTime: string
  outputPath: string
  imageHashes: Record<string, string>
}

export interface NtxState {
  version: 1
  lastFullSync: string | null
  pages: Record<string, PageState>
}

const STATE_FILE = '.nts-state.json'

function freshState(): NtxState {
  return { version: 1, lastFullSync: null, pages: {} }
}

export function loadState(outputDir: string): NtxState {
  const filePath = path.join(outputDir, STATE_FILE)
  if (!fs.existsSync(filePath)) return freshState()
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as NtxState
  } catch (err: any) {
    console.warn(
      `Warning: ${STATE_FILE} is unreadable (${err.message}); starting from a fresh state.`,
    )
    return freshState()
  }
}

/**
 * Writes state atomically and concurrency-safely: each write goes to a unique
 * temp file, then renames over the target. Concurrent writers cannot corrupt
 * the file — the last rename wins and every rename is a complete state.
 */
export function saveState(outputDir: string, state: NtxState): void {
  fs.mkdirSync(outputDir, { recursive: true })
  const filePath = path.join(outputDir, STATE_FILE)
  const tmpPath = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`
  fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2), 'utf-8')
  fs.renameSync(tmpPath, filePath)
}

export function needsUpdate(state: NtxState, pageId: string, lastEditedTime: string): boolean {
  const existing = state.pages[pageId]
  if (!existing) return true
  return existing.lastEditedTime !== lastEditedTime
}

/**
 * Records a page entry in place. Safe to call from concurrent sync tasks:
 * each task writes a distinct `pageId` key, so there is no read-modify-write
 * race — unlike spreading a stale snapshot of the whole state object.
 */
export function recordPage(state: NtxState, entry: PageState): void {
  state.pages[entry.pageId] = entry
}
