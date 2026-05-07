import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'

export default defineConfig({
  srcDir: './src',
  integrations: [mdx()],
})
