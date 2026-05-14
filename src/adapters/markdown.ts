import matter from 'gray-matter'
import * as fs from 'fs'
import * as path from 'path'

export class MarkdownAdapter {
  write(
    slug: string,
    frontmatter: Record<string, any>,
    content: string,
    outputDir: string,
  ): void {
    fs.mkdirSync(outputDir, { recursive: true })
    const outputPath = path.join(outputDir, slug + '.md')

    // Preserve a locally-set "Published" status and the original created date
    // on overwrite. Only meaningful for the legacy nested frontmatter shape —
    // skipped when the active frontmatter is the flat typed shape.
    if (fs.existsSync(outputPath) && frontmatter.meta) {
      const existing = matter(fs.readFileSync(outputPath, 'utf-8')).data as any
      if (existing?.meta?.status === 'Published') frontmatter.meta.status = 'Published'
      if (typeof existing?.created === 'string' && existing.created) {
        frontmatter.created = existing.created
      }
    }

    fs.writeFileSync(outputPath, matter.stringify(`\n${content}`, frontmatter), 'utf-8')
  }
}
