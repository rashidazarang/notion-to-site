# nts + Astro Example

A minimal Astro 5 blog powered by notion-to-site's Content Layer loader.

There is **no sync step and no files on disk** — `notionLoader()` pulls the
Notion database directly when Astro builds the content collection.

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

Open [http://localhost:4321](http://localhost:4321) to see your posts.

## How it works

`src/content.config.ts` defines a collection whose `loader` is `notionLoader()`
from `notion-to-site/astro`. On build, the loader runs the notion-to-site sync
engine in-process and populates Astro's content store — so `getCollection()`
and `<Content />` work without an intermediate `content/` directory.
