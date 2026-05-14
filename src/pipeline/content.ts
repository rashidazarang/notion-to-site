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

/**
 * Converts a page title into a URL-safe slug. Strips diacritics so accented
 * titles produce clean ASCII slugs (e.g. "Adaptación" → "adaptacion").
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '')
}

/**
 * Returns a slug guaranteed unique within `used`. On collision it suffixes
 * `-2`, `-3`, … — without this, two pages whose titles slugify to the same
 * value would overwrite each other's output file. Does not mutate `used`;
 * the caller records the returned slug.
 */
export function uniquifySlug(slug: string, used: Set<string>): string {
  if (!used.has(slug)) return slug
  let n = 2
  while (used.has(`${slug}-${n}`)) n++
  return `${slug}-${n}`
}

/**
 * Rewrites raw Notion page-id links `(/<id>...)` to `<linkPrefix>/<slug>`.
 * Falls back to the bare hex id when the page is not in the slug map.
 */
export function resolveNotionLinks(
  content: string,
  slugMap: Map<string, string>,
  linkPrefix: string,
): string {
  return content.replace(/\(\/([a-f0-9-]{32,36})([^)]*)\)/g, (_match, pageId, rest) => {
    const hexId = pageId.replace(/-/g, '')
    const slug = slugMap.get(hexId) ?? slugMap.get(pageId)
    if (slug) return `(${linkPrefix}/${slug}${rest})`
    return `(${linkPrefix}/${hexId}${rest})`
  })
}

// Matches any line that is purely a back-navigation element containing ← ↩ ◀
function isBackLink(line: string): boolean {
  const s = line.trim()
  // Heading with arrow (e.g. ### [← Back...](url))
  if (/^#{1,6}\s/.test(s) && /[←↩◀]/.test(s)) return true
  // Bold-only back text: **← Go back**
  if (/^\*{1,3}[←↩◀]/.test(s)) return true
  // Link with arrow: [**← ...**](url) or [← ...](url)
  if (/^\[[\*_]*[←↩◀]/.test(s)) return true
  return false
}

/** Removes Notion back-navigation artifacts and collapses the gaps they leave. */
export function stripBackLinks(content: string): string {
  return content
    .split('\n')
    .filter(line => !isBackLink(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Builds a "## Contents" table of contents from level 2-4 headings.
 * Returns an empty string when there are fewer than three headings.
 */
export function generateToc(content: string): string {
  const headings = content
    .split('\n')
    .filter(l => /^#{2,4}\s/.test(l))
  if (headings.length < 3) return ''

  const items = headings.map(h => {
    const m = h.match(/^(#{2,4})\s+(.+)$/)
    if (!m) return null
    const level = m[1].length - 2
    const text = m[2].replace(/\*\*?|__?/g, '').trim()
    const anchor = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    return `${'  '.repeat(level)}- [${text}](#${anchor})`
  }).filter(Boolean)

  if (items.length === 0) return ''
  return `## Contents\n\n${items.join('\n')}\n\n`
}

/**
 * Extracts a plain-text description from the first real paragraph of content,
 * skipping headings, images, blockquotes, links, tables and HTML.
 */
export function extractDescription(content: string): string {
  for (const line of content.split('\n')) {
    const s = line.trim()
    if (!s || s.startsWith('#') || s.startsWith('!') || s.startsWith('>') ||
        s.startsWith('[') || s.startsWith('|') || s.startsWith('<')) continue
    const plain = s
      .replace(/\*\*?([^*]+)\*\*?/g, '$1')
      .replace(/`[^`]+`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim()
    if (plain.length > 20) return plain.slice(0, 280)
  }
  return ''
}

/** Estimated minutes to read, at 200 words/minute (minimum 1). */
export function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Total word count of the content body. */
export function computeWordCount(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length
}
