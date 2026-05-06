export interface NtxConfig {
  database: string
  output: string
  adapter: 'markdown' | 'mdx' | 'json'
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
