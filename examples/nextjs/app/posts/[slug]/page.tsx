import { getAllPosts, getPostBySlug } from '../../../lib/posts'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <article>
      <header style={{ marginBottom: '2rem' }}>
        <h1>{post.frontmatter.title}</h1>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          {post.frontmatter.created && <span>{post.frontmatter.created}</span>}
          {post.frontmatter.main_tag && <span> &middot; {post.frontmatter.main_tag}</span>}
        </div>
      </header>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7 }}>
        {post.content}
      </pre>
    </article>
  )
}
