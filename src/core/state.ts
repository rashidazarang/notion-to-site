import * as fs from 'fs'
import * as path from 'path'

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

export function loadState(outputDir: string): NtxState {
  const filePath = path.join(outputDir, '.nts-state.json')
  if (!fs.existsSync(filePath)) {
    return { version: 1, lastFullSync: null, pages: {} }
  }
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as NtxState
}

export function saveState(outputDir: string, state: NtxState): void {
  const filePath = path.join(outputDir, '.nts-state.json')
  const tmpPath = filePath + '.tmp'
  fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2), 'utf-8')
  fs.renameSync(tmpPath, filePath)
}

export function needsUpdate(state: NtxState, pageId: string, lastEditedTime: string): boolean {
  const existing = state.pages[pageId]
  if (!existing) return true
  return existing.lastEditedTime !== lastEditedTime
}

export function updatePageState(state: NtxState, entry: PageState): NtxState {
  return {
    ...state,
    pages: {
      ...state.pages,
      [entry.pageId]: entry,
    },
  }
}
