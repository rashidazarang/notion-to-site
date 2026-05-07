# notion-to-site

Sync any Notion database to local markdown, MDX, or JSON files.

- **One command sync.** Point `nts` at a Notion database and get structured content files with full frontmatter.
- **All block types.** Paragraphs, headings, images, callouts, columns, tables, equations, toggles, synced blocks, bookmarks, video, audio, file, PDF, embeds.
- **Incremental updates.** Track what changed since the last sync. Only re-fetch updated pages.

## Install

```bash
npm install -g notion-to-site
```

## Quick start

### 1. Create a Notion integration

Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create an internal integration. Copy the API key.

### 2. Share your database

Open your Notion database, click the `...` menu, then "Connections", and add your integration.

### 3. Create a config file

```bash
nts init
```

This creates `nts.config.js` in your project. Open it and set your database ID:

```js
// nts.config.js
export default {
  database: 'your-database-id-here',
  output: './content',
  adapter: 'markdown',
  author: 'Your Name',
  linkPrefix: '/blog',
  images: { download: true, outputDir: './public/images', format: 'webp', quality: 80 },
  schema: { strict: false },
  sync: { concurrency: 5, deletions: true },
  content: { toc: false, stripBackLinks: true },
}
```

### 4. Set your API key and sync

```bash
export NOTION_API_KEY=ntn_your_key_here
nts sync
```

Your content files will appear in `./content`.

## Config reference

| Field | Type | Default | Description |
|---|---|---|---|
| `database` | `string` | (required) | Your Notion database ID |
| `output` | `string` | `'./content'` | Directory for output files |
| `adapter` | `'markdown' \| 'mdx' \| 'json'` | `'markdown'` | Output format |
| `author` | `string` | `''` | Default author name when not set on the page |
| `linkPrefix` | `string` | `'/blog'` | URL prefix for internal Notion links |
| `images.download` | `boolean` | `true` | Download images locally |
| `images.outputDir` | `string` | `'./public/images'` | Where to save downloaded images |
| `images.format` | `'webp' \| 'original'` | `'webp'` | Convert images to WebP or keep original format |
| `images.quality` | `number` | `80` | WebP compression quality (1-100) |
| `schema.strict` | `boolean` | `false` | Validate frontmatter with Zod on every sync |
| `sync.concurrency` | `number` | `5` | Number of pages to sync in parallel |
| `sync.deletions` | `boolean` | `true` | Delete local files for pages removed from Notion |
| `content.toc` | `boolean` | `false` | Insert a table of contents after the first heading |
| `content.stripBackLinks` | `boolean` | `true` | Remove back-navigation links from Notion pages |
| `watch.interval` | `number` | `60` | Polling interval in seconds for `nts watch` |

## CLI commands

| Command | Description |
|---|---|
| `nts init` | Create `nts.config.js` in the current directory |
| `nts sync` | Full sync of your Notion database to local files |
| `nts sync --incremental` | Only sync pages changed since the last run |
| `nts sync --db <id>` | Override the database ID from config |
| `nts watch` | Poll and incrementally sync on a timer |
| `nts watch --interval <seconds>` | Set the polling interval (default: 60) |
| `nts validate` | Validate all output files against the Zod schema |
| `nts status` | Show sync state, tracked pages, and statistics |

## Output format

Each synced page produces a file with YAML frontmatter and rendered content. Here is a sample:

```yaml
---
id: my-first-post
path: /content/my-first-post.md
type: post
intent: ""
version: "1.0"
created: "2026-01-15"
last_updated: "2026-03-20"
source:
  platform: notion
  page_id: abc12345-def6-7890-abcd-ef1234567890
meta:
  title: My First Post
  seo_title: My First Post
  author: Your Name
  description: A short summary extracted from the first paragraph.
  canonical: ""
  category:
    - Engineering
  main_tag: Tutorial
  tags:
    - tutorial
    - getting-started
  featured: false
  featured_at: []
  language: en
  post_type: Post
  status: Published
  reading_time: 4
  word_count: 812
  comment: ""
  cover_image: ""
---

# My First Post

Your content starts here...
```

### Frontmatter fields

- `id` -- The slug, derived from the page title or a custom Slug property in Notion.
- `path` -- Relative file path in the output directory.
- `type` -- From the Type/Kind property in Notion, defaults to `post`.
- `created` / `last_updated` -- Dates from Notion page metadata.
- `source.page_id` -- The original Notion page ID for traceability.
- `meta.seo_title` -- From an SEO Title property, or falls back to the page title.
- `meta.description` -- From a Description property, or auto-extracted from the first paragraph.
- `meta.language` -- From a Language property, or auto-detected from the content.
- `meta.reading_time` -- Estimated minutes to read (200 words/minute).
- `meta.word_count` -- Total word count of the content body.

## Framework guides

### Next.js

Place your config output in `./content` and use a library like `gray-matter` to parse frontmatter at build time. If you use `contentlayer` or `next-mdx-remote`, set `adapter: 'mdx'` and point the output to your content directory. Images go in `./public/images` by default, so they are served statically.

### Astro

Astro's content collections work well with the markdown adapter. Set `output` to `./src/content/blog` and define a matching collection schema in `src/content/config.ts`. Astro will pick up the frontmatter fields automatically. Use `adapter: 'mdx'` if your pages use components.

### SvelteKit

Use `mdsvex` for markdown processing. Set `output` to a directory your routes can import from, and parse frontmatter with `gray-matter` in your `+page.ts` load function. The JSON adapter (`adapter: 'json'`) is also a good fit if you prefer to load content as data rather than rendered markup.

## How it works

`nts` connects to the Notion API, fetches every page in your database, and converts each one to markdown using custom block-type renderers. It extracts metadata from Notion page properties (title, tags, status, author, etc.), builds structured frontmatter, resolves internal links between pages, and writes the result to your chosen output format.

## Environment variables

| Variable | Description |
|---|---|
| `NOTION_API_KEY` | Your Notion integration API key (required) |

You can set this in a `.env` or `.env.local` file in your project root. Both are loaded automatically.

## License

MIT
