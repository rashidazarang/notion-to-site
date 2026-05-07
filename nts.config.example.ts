export interface NtxConfig {
  database: string
  output: string
  adapter: 'markdown' | 'mdx' | 'json'
  author?: string
  linkPrefix?: string
  images: {
    download: boolean
    outputDir: string
    format: 'webp' | 'original'
    quality: number
  }
  schema: {
    strict: boolean
  }
  watch?: {
    interval: number
  }
}

const config: NtxConfig = {
  database: 'YOUR_NOTION_DATABASE_ID',
  output: './content',
  adapter: 'markdown',
  author: 'Your Name',
  linkPrefix: '/blog',
  images: {
    download: true,
    outputDir: './public/images',
    format: 'webp',
    quality: 80,
  },
  schema: {
    strict: true,
  },
  watch: {
    interval: 60,
  },
}
export default config
