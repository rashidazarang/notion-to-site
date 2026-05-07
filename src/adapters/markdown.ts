import matter from 'gray-matter'
import * as fs from 'fs'
import * as path from 'path'
import type { PostFrontmatter } from '../schema.js'

export class MarkdownAdapter {
  write(slug: string, frontmatter: PostFrontmatter, content: string, outputDir: string): void {
    fs.mkdirSync(outputDir, { recursive: true })
    const outputPath = path.join(outputDir, slug + '.md')

    if (fs.existsSync(outputPath)) {
      const existing = matter(fs.readFileSync(outputPath, 'utf-8'))
      const existingData = existing.data as Partial<PostFrontmatter>
      if (existingData.meta?.status === 'Published') {
        frontmatter.meta.status = 'Published'
      }
      if (typeof existingData.created === 'string' && existingData.created) {
        frontmatter.created = existingData.created
      }
    }

    // Only inject title heading if the content doesn't already open with one
    const hasH1 = /^#\s/.test(content.trimStart())
    const body = hasH1 ? `\n${content}` : `\n# ${frontmatter.meta.title}\n\n${content}`
    const output = matter.stringify(body, frontmatter as any)
    fs.writeFileSync(outputPath, output, 'utf-8')
  }
}
