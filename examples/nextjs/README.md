# nts + Next.js Example

A minimal Next.js 15 (App Router) blog powered by notion-to-site.

There is no manual sync step — `withNotion()` in `next.config.mjs` syncs the
Notion content before each build and dev start.

## Quick Start

1. Copy `.env.example` to `.env` and fill in your Notion API key and database ID
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see your posts.

## How it works

- `next.config.mjs` wraps the config with `withNotion()`, which runs the
  notion-to-site sync engine (reading `nts.config.mjs`) and emits a typed
  content module at `.notion-to-site/`.
- `app/page.tsx` and `app/posts/[slug]/page.tsx` read it through the typed
  `getAllPages()` / `getPageBySlug()` accessors from `notion-to-site/next`.
- `<NotionContent>` renders a page body (markdown) to HTML server-side.
