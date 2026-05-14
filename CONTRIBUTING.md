# Contributing

## Prerequisites

- Node.js 18 or later
- TypeScript
- A Notion integration with API access to at least one database

## Setup

```bash
git clone https://github.com/rashidazarang/notion-to-site.git
cd notion-to-site
npm install
```

## Running locally

1. Create a `.env` file with your Notion API key:

```bash
NOTION_API_KEY=ntn_your_key_here
```

2. Create a config file pointing to your test database:

```bash
cp nts.config.example.js nts.config.js
```

Edit `nts.config.js` and set your database ID.

3. Build and run:

```bash
npm run build
node dist/cli.js sync
```

For continuous rebuilds during development:

```bash
npm run dev
```

Then run commands with `node dist/cli.js` in another terminal.

## Project structure

```
src/
  cli.ts          CLI entry point (commander)
  config.ts       Config file loading
  schema.ts       Zod frontmatter schema + property extraction
  types.ts        TypeScript interfaces
  core/
    client.ts     Notion API wrapper
    renderer.ts   Block-to-markdown rendering
    state.ts      Incremental sync state
  adapters/
    markdown.ts   .md output
    mdx.ts        .mdx output
    json.ts       .json output
  pipeline/
    content.ts    Language detection, comment extraction
    images.ts     Image download + WebP conversion
```

## Pull request guidelines

- One thing per PR. If you are fixing a bug and adding a feature, make two PRs.
- Describe what changed and why in the PR description.
- Run `npm run build` and confirm there are no TypeScript errors before submitting.
- If you add a new block type renderer, test it against a real Notion page containing that block type.
