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
  sync?: {
    concurrency: number
    deletions: boolean
  }
  content?: {
    toc: boolean
    stripBackLinks: boolean
  }
  watch?: {
    interval: number
  }
}
