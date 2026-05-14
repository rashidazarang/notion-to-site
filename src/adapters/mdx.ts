import * as fs from 'fs'
import * as path from 'path'

export class MdxAdapter {
  write(
    slug: string,
    frontmatter: Record<string, any>,
    content: string,
    outputDir: string,
  ): void {
    fs.mkdirSync(outputDir, { recursive: true })
    const outputPath = path.join(outputDir, slug + '.mdx')
    const output = `export const meta = ${JSON.stringify(frontmatter, null, 2)}\n\n${content}`
    fs.writeFileSync(outputPath, output, 'utf-8')
  }
}
