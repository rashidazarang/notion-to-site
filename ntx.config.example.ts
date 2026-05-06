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

const config: NtxConfig = {
  database: '69f88a28f7ae4a3ab647d86f54282ab0',
  output: './blog',
  adapter: 'markdown',
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
