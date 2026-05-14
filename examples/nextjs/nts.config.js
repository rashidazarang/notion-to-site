export default {
  database: process.env.NOTION_DATABASE_ID,
  output: './content',
  adapter: 'markdown',
  images: { download: false, outputDir: './public/images', format: 'webp', quality: 80 },
  // This example uses the legacy frontmatter shape so its pages can read
  // `meta.*` without a per-database generated schema. Drop `mode` (or set
  // 'typed') to get the flat, typed frontmatter that mirrors your database.
  schema: { strict: false, mode: 'legacy' },
  sync: { concurrency: 5, deletions: true },
  content: { stripBackLinks: true },
}
