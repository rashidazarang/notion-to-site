import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'My Site'

export const metadata: Metadata = {
  title: siteTitle,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
        <nav style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <a href="/" style={{ fontSize: '1.25rem', fontWeight: 600, textDecoration: 'none', color: 'inherit' }}>
            {siteTitle}
          </a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
