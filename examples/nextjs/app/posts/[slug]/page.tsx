import { getAllPages, getPageBySlug, NotionContent } from 'notion-to-site/next'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await getAllPages()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPageBySlug(slug)
  if (!post) notFound()

  return (
    <article>
      <header style={{ marginBottom: '2rem' }}>
        <h1>{post.frontmatter.meta.title}</h1>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          {post.frontmatter.created && <span>{post.frontmatter.created}</span>}
          {post.frontmatter.meta.main_tag && (
            <span> &middot; {post.frontmatter.meta.main_tag}</span>
          )}
        </div>
      </header>
      <NotionContent body={post.content} />
    </article>
  )
}
