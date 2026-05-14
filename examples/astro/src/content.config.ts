import { defineCollection, z } from 'astro:content'
import { notionLoader } from 'notion-to-site/astro'

// The Notion database is loaded directly via the Content Layer loader —
// no `nts sync` step and no files on disk. Set NOTION_API_KEY and
// NOTION_DATABASE_ID in your environment (see .env.example).
const blog = defineCollection({
  loader: notionLoader({
    database: process.env.NOTION_DATABASE_ID ?? '',
  }),
  // The loader produces notion-to-site's default ("legacy") frontmatter shape,
  // where page metadata lives under `meta`. `.passthrough()` keeps every other
  // field without having to enumerate them.
  schema: z
    .object({
      created: z.string().optional(),
      meta: z
        .object({
          title: z.string(),
          description: z.string().optional(),
          main_tag: z.string().nullable().optional(),
          cover_image: z.string().optional(),
        })
        .passthrough(),
    })
    .passthrough(),
})

export const collections = { blog }
