// nts.config.example.js — copy to nts.config.js and edit before running `nts sync`.
// Every field is shown with its default value; only `database` is required.
export default {
  // Your Notion database ID (required). Find it in the database URL.
  database: 'YOUR_NOTION_DATABASE_ID',

  // Directory where synced content files are written.
  output: './content',

  // Output format: 'markdown' | 'mdx' | 'json'.
  adapter: 'markdown',

  // Default author, used when a page has no Author property.
  author: 'Your Name',

  // URL prefix used when resolving internal Notion links between pages.
  linkPrefix: '/blog',

  images: {
    download: true, // download images locally instead of hotlinking Notion
    outputDir: './public/images', // where downloaded images are saved
    format: 'webp', // 'webp' | 'original'
    quality: 80, // WebP quality, 1-100
  },

  schema: {
    strict: false, // validate frontmatter with Zod on every sync
    // mode: 'legacy', // 'legacy' (default) keeps the blog-shaped frontmatter.
    //                 // 'typed' introspects your Notion database, generates
    //                 // TypeScript types from it, and emits a flat, faithful
    //                 // frontmatter shape. Run `nts types` to (re)generate.
    // typesOutput: './.notion-to-site/types.ts', // where typed mode writes the schema
  },

  sync: {
    concurrency: 5, // pages synced in parallel
    deletions: true, // delete local files for pages removed from Notion
  },

  content: {
    toc: false, // insert a table of contents after the first heading
    stripBackLinks: true, // remove Notion back-navigation artifacts
  },

  watch: {
    interval: 60, // poll interval in seconds for `nts watch`
  },

  // Optional: sync only a subset of the database. `filter` is forwarded to
  // Notion's databases.query endpoint as-is — see the README for examples.
  // query: {
  //   filter: { property: 'Status', select: { equals: 'Published' } },
  //   page_size: 100,
  // },
}
