import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export function getAllPosts() {
  if (!fs.existsSync(contentDir)) return []

  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(contentDir, filename), 'utf-8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title || slug,
        created: data.created || null,
        main_tag: data.main_tag || null,
        cover_image: data.cover_image || null,
      }
    })
    .sort((a, b) => (b.created || '').localeCompare(a.created || ''))
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(contentDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data, content }
}
