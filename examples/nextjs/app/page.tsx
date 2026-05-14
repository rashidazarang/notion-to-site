import { getAllPages } from 'notion-to-site/next'

export default async function Home() {
  const posts = (await getAllPages()).sort((a, b) =>
    (b.frontmatter.created || '').localeCompare(a.frontmatter.created || ''),
  )

  return (
    <div>
      <h1>Posts</h1>
      {posts.length === 0 ? (
        <p>
          No posts yet — check your <code>NOTION_API_KEY</code> and{' '}
          <code>NOTION_DATABASE_ID</code>.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li key={post.slug} style={{ marginBottom: '1.5rem' }}>
              <a
                href={`/posts/${post.slug}`}
                style={{ fontSize: '1.125rem', fontWeight: 500 }}
              >
                {post.frontmatter.meta.title}
              </a>
              <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                {post.frontmatter.created && <span>{post.frontmatter.created}</span>}
                {post.frontmatter.meta.main_tag && (
                  <span> &middot; {post.frontmatter.meta.main_tag}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
