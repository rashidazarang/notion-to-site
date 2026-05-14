export default {
  database: process.env.NOTION_DATABASE_ID,
  output: './src/content/blog',
  adapter: 'markdown',
  images: { download: false, outputDir: './public/images', format: 'webp', quality: 80 },
  schema: { strict: false },
  sync: { concurrency: 5, deletions: true },
  content: { stripBackLinks: true },
}
