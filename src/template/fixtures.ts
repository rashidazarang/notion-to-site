import type { CreatePageParameters, BlockObjectRequest } from '@notionhq/client'

/**
 * A sample blog post used to seed a freshly created template database.
 * Authored as a TS module (not JSON) so `tsc` compiles it into `dist/` and it
 * ships with the package (package.json#files only includes `dist`).
 */
export interface SamplePost {
  /** Stable key for idempotency (matched against existing Title/Slug on re-seed). */
  key: string
  title: string
  slug: string
  status: 'Draft' | 'Published'
  category: string[]
  tags: string[]
  language: string
  author: string
  seoTitle: string
  description: string
  /** ISO date (YYYY-MM-DD) → the Date property → frontmatter.created. */
  date: string
  /** Stable external image URL (uploaded Notion covers expire). */
  coverUrl: string
  children: BlockObjectRequest[]
}

function p(text: string): BlockObjectRequest {
  return { type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: text } }] } }
}
function h2(text: string): BlockObjectRequest {
  return { type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: text } }] } }
}
function quote(text: string): BlockObjectRequest {
  return { type: 'quote', quote: { rich_text: [{ type: 'text', text: { content: text } }] } }
}
function image(url: string, caption?: string): BlockObjectRequest {
  return {
    type: 'image',
    image: {
      type: 'external',
      external: { url },
      ...(caption ? { caption: [{ type: 'text', text: { content: caption } }] } : {}),
    },
  }
}

/** Neutral, reusable samples shipped with the template (one per category). */
export const SAMPLE_POSTS: SamplePost[] = [
  {
    key: 'welcome',
    title: 'Welcome to your Notion-powered blog',
    slug: 'welcome-to-your-notion-blog',
    status: 'Published',
    category: ['Company'],
    tags: ['getting-started'],
    language: 'en',
    author: 'Your Name',
    seoTitle: 'Welcome to your Notion-powered blog',
    description: 'This post was written in Notion and synced to your site with notion-to-site. Edit it, or delete it and write your own.',
    date: '2026-01-15',
    coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
    children: [
      p('Everything you see here lives in a Notion database. notion-to-site reads that database, converts each page to Markdown, downloads its images, and hands your site fully typed content.'),
      h2('How it works'),
      p('Write in Notion. Set Status to Published. Run a sync (or just build your site). The post appears.'),
      quote('Your content, your shape. Notion is the editor, your site is the renderer.'),
      p('Delete these sample posts whenever you are ready and start writing your own.'),
    ],
  },
  {
    key: 'blocks',
    title: 'Write once, publish with rich Notion blocks',
    slug: 'rich-notion-blocks',
    status: 'Published',
    category: ['Technology'],
    tags: ['markdown', 'notion'],
    language: 'en',
    author: 'Your Name',
    seoTitle: 'Write once, publish with rich Notion blocks',
    description: 'Headings, paragraphs, quotes, images, lists and more, authored in Notion and rendered on your site.',
    date: '2026-02-02',
    coverUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&q=80',
    children: [
      p('notion-to-site supports the block types you actually use when writing: headings, paragraphs, callouts, quotes, images, tables, code, and more.'),
      h2('Images come along for free'),
      image('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80', 'Inline images are downloaded and optimized at sync time.'),
      p('Set a Cover (URL property) and a Date, and your card shows a hero image and a publish date.'),
    ],
  },
  {
    key: 'draft',
    title: 'A draft you can preview before publishing',
    slug: 'draft-preview',
    status: 'Draft',
    category: ['Business'],
    tags: ['workflow'],
    language: 'en',
    author: 'Your Name',
    seoTitle: 'A draft you can preview before publishing',
    description: 'Posts with Status other than Published stay out of your live site until you flip the switch.',
    date: '2026-02-10',
    coverUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
    children: [
      p('This post has Status = Draft, so a site filtering on Published will hide it. Flip Status to Published when it is ready.'),
    ],
  },
  {
    key: 'welcome-es',
    title: 'Bienvenido a tu blog con Notion',
    slug: 'bienvenido-a-tu-blog-con-notion',
    status: 'Published',
    category: ['Company'],
    tags: ['primeros-pasos'],
    language: 'es',
    author: 'Tu nombre',
    seoTitle: 'Bienvenido a tu blog con Notion',
    description: 'Esta entrada se escribió en Notion y se sincronizó a tu sitio con notion-to-site. Edítala, o bórrala y escribe la tuya.',
    date: '2026-01-15',
    coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
    children: [
      p('Todo lo que ves aquí vive en una base de datos de Notion. notion-to-site la lee, convierte cada página a Markdown, descarga sus imágenes y entrega a tu sitio contenido totalmente tipado.'),
      h2('Cómo funciona'),
      p('Escribe en Notion. Cambia el estado a Publicado. Sincroniza (o simplemente construye tu sitio). La entrada aparece.'),
      quote('Tu contenido, tu forma. Notion es el editor, tu sitio es el renderizador.'),
      p('Borra estas entradas de ejemplo cuando quieras y empieza a escribir las tuyas.'),
    ],
  },
  {
    key: 'blocks-es',
    title: 'Escribe una vez, publica con bloques de Notion',
    slug: 'bloques-de-notion',
    status: 'Published',
    category: ['Technology'],
    tags: ['markdown', 'notion'],
    language: 'es',
    author: 'Tu nombre',
    seoTitle: 'Escribe una vez, publica con bloques de Notion',
    description: 'Encabezados, párrafos, citas, imágenes, listas y más, escritos en Notion y renderizados en tu sitio.',
    date: '2026-02-02',
    coverUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&q=80',
    children: [
      p('notion-to-site soporta los tipos de bloque que de verdad usas al escribir: encabezados, párrafos, callouts, citas, imágenes, tablas, código y más.'),
      h2('Las imágenes vienen incluidas'),
      image('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80', 'Las imágenes en línea se descargan y optimizan al sincronizar.'),
      p('Define una portada (propiedad URL) y una fecha, y tu tarjeta muestra una imagen y la fecha de publicación.'),
    ],
  },
  {
    key: 'draft-es',
    title: 'Un borrador que puedes previsualizar antes de publicar',
    slug: 'borrador-previsualizacion',
    status: 'Draft',
    category: ['Business'],
    tags: ['flujo'],
    language: 'es',
    author: 'Tu nombre',
    seoTitle: 'Un borrador que puedes previsualizar antes de publicar',
    description: 'Las entradas con un estado distinto de Publicado quedan fuera de tu sitio hasta que las publiques.',
    date: '2026-02-10',
    coverUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
    children: [
      p('Esta entrada tiene Estado = Borrador, así que un sitio que filtra por Publicado la oculta. Cambia el estado a Publicado cuando esté lista.'),
    ],
  },
]

/** Builds `pages.create` params for a sample post under a data source. */
export function samplePostToPageParams(
  post: SamplePost,
  dataSourceId: string,
  coverStyle: 'stock' | 'none' = 'stock',
): CreatePageParameters {
  const useCover = coverStyle === 'stock'
  return {
    parent: { type: 'data_source_id', data_source_id: dataSourceId },
    ...(useCover ? { cover: { type: 'external', external: { url: post.coverUrl } } } : {}),
    properties: {
      Title: { title: [{ type: 'text', text: { content: post.title } }] },
      Slug: { rich_text: [{ type: 'text', text: { content: post.slug } }] },
      Status: { select: { name: post.status } },
      Category: { multi_select: post.category.map((name) => ({ name })) },
      Tags: { multi_select: post.tags.map((name) => ({ name })) },
      Language: { select: { name: post.language } },
      Author: { rich_text: [{ type: 'text', text: { content: post.author } }] },
      'SEO Title': { rich_text: [{ type: 'text', text: { content: post.seoTitle } }] },
      Description: { rich_text: [{ type: 'text', text: { content: post.description } }] },
      Date: { date: { start: post.date } },
      Cover: useCover ? { url: post.coverUrl } : { url: null },
    },
    children: post.children,
  } as CreatePageParameters
}
