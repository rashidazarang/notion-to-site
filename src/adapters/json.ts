import * as fs from 'fs'
import * as path from 'path'

export class JsonAdapter {
  write(
    slug: string,
    frontmatter: Record<string, any>,
    content: string,
    outputDir: string,
  ): void {
    fs.mkdirSync(outputDir, { recursive: true })
    const outputPath = path.join(outputDir, slug + '.json')

    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const data = {
      slug,
      frontmatter,
      content,
      readingTime,
      generatedAt: new Date().toISOString(),
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')
  }
}
