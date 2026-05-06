/**
 * Strips inline markdown syntax from a string.
 * Handles: **bold**, *italic*, _italic_, `code`, [text](url), ![alt](url)
 */
export function stripMarkdownInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')       // images → remove entirely
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')       // [text](url) → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')             // **bold** → bold
    .replace(/\*([^*]+)\*/g, '$1')                 // *italic* → italic
    .replace(/_([^_]+)_/g, '$1')                   // _italic_ → italic
    .replace(/`([^`]+)`/g, '$1')                   // `code` → code
    .replace(/~~([^~]+)~~/g, '$1')                 // ~~strike~~ → strike
    .trim()
}

const NAV_ARTIFACT = /^\[.*←.*\]|^\[.*→.*\]/

/**
 * Extracts a clean first-paragraph excerpt from markdown content.
 * Skips: headings, image-only lines, nav artifacts, empty lines.
 * Returns plain text up to 200 chars, truncated at word boundary.
 */
export function extractComment(markdown: string, title: string): string {
  const lines = markdown.split('\n')
  const paragraphLines: string[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      // Empty line = paragraph break. If we already have content, stop.
      if (paragraphLines.length > 0) break
      continue
    }
    if (line.startsWith('#')) continue           // headings
    if (line.startsWith('---')) continue          // hr
    if (/^!\[/.test(line)) continue              // image-only lines
    if (NAV_ARTIFACT.test(line)) continue        // ← → nav artifacts
    if (/^\*\*←/.test(line)) continue           // **← Go back** artifacts
    if (/^\|/.test(line)) continue               // table rows
    if (/^```/.test(line)) break                 // code blocks — stop

    const stripped = stripMarkdownInline(line)
    if (!stripped || stripped === title) continue
    paragraphLines.push(stripped)
  }

  const full = paragraphLines.join(' ').trim()
  if (!full || full === title) return ''

  if (full.length <= 200) return full

  // Truncate at word boundary
  const truncated = full.slice(0, 200)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 150 ? truncated.slice(0, lastSpace) + '…' : truncated + '…'
}

const SPANISH_MARKERS = new Set([
  'de', 'para', 'una', 'con', 'que', 'los', 'las', 'en', 'del', 'por',
  'como', 'fue', 'sus', 'esta', 'son', 'al', 'se', 'mi', 'tu', 'el',
  'la', 'un', 'es', 'lo', 'le', 'yo', 'me', 'te', 'si', 'ni',
  'ya', 'hay', 'más', 'pero', 'sobre', 'entre', 'cuando', 'todo',
  'este', 'estos', 'estas', 'eso', 'ese', 'esa', 'nos', 'su',
])

/**
 * Detects language of text. Returns 'Español', 'English', or '' (uncertain).
 * Only intended for posts with blank language field.
 */
export function detectLanguage(text: string): 'Español' | 'English' | '' {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-záéíóúüñ\s]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2)

  if (tokens.length < 10) return ''

  const spanishCount = tokens.filter(t => SPANISH_MARKERS.has(t)).length
  const ratio = spanishCount / tokens.length

  if (ratio > 0.20) return 'Español'
  if (ratio < 0.08) return 'English'
  return ''
}
