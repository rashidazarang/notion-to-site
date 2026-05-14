export default {
  database: process.env.NOTION_DATABASE_ID,
  output: './content',
  adapter: 'markdown',
  images: { download: false, outputDir: './public/images', format: 'webp', quality: 80 },
  schema: { strict: false },
  sync: { concurrency: 5, deletions: true },
  content: { stripBackLinks: true },
}
