import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    created: z.string(),
    last_updated: z.string().optional(),
    main_tag: z.string().nullable().optional(),
    cover_image: z.string().optional(),
    description: z.string().optional(),
    language: z.string().optional(),
  }),
})

export const collections = { blog }
