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

    const output = matter.stringify(`\n# ${frontmatter.meta.title}\n\n${content}`, frontmatter as any)
    fs.writeFileSync(outputPath, output, 'utf-8')
  }
}
