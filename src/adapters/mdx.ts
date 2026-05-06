import * as fs from 'fs'
import * as path from 'path'
import type { PostFrontmatter } from '../schema.js'

export class MdxAdapter {
  write(slug: string, frontmatter: PostFrontmatter, content: string, outputDir: string): void {
    fs.mkdirSync(outputDir, { recursive: true })
    const outputPath = path.join(outputDir, slug + '.mdx')

    const metaJson = JSON.stringify(frontmatter, null, 2)
    const output = `export const meta = ${metaJson}\n\n# ${frontmatter.meta.title}\n\n${content}`

    fs.writeFileSync(outputPath, output, 'utf-8')
  }
}
