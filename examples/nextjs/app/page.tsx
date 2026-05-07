import { getAllPosts } from '../lib/posts'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div>
      <h1>Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet. Run <code>npm run sync</code> to pull content from Notion.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li key={post.slug} style={{ marginBottom: '1.5rem' }}>
              <a href={`/posts/${post.slug}`} style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                {post.title}
              </a>
              <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                {post.created && <span>{post.created}</span>}
                {post.main_tag && <span> &middot; {post.main_tag}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
