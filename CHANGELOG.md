# Changelog

## 0.2.0

### Added

- `query.filter` config — sync only a subset of a database. The filter object is forwarded to Notion's `databases.query` endpoint as-is, so the full filter syntax (including `and` / `or` composers) is supported.
- `query.page_size` config — override the default database query page size.
- Domain Tags reader — a `Domain Tags` multi-select column is written to `meta.domain_tags` on every page, enabling render-time per-page routing when one Notion database feeds multiple sites.

### Fixed

- `nts --version` now reports the installed version instead of a hardcoded `0.1.0`.
- Callout blocks now keep their Notion emoji icon — an operator-precedence bug previously dropped every emoji.
- The incremental-sync state file is now consistently named `.nts-state.json` (the code was writing `.ntx-state.json`).
- Suppressed `dotenv` startup logging that printed on every command.

### Packaging

- `npm publish` now ships the compiled `dist/` output. A `files` field was added so publishing is no longer affected by `dist/` being git-ignored.
- Removed the undocumented `ntx.config.*` config filename alias; use `nts.config.js` or `nts.config.ts`.

## 0.1.0

Initial release.

- Sync any Notion database to markdown, MDX, or JSON files
- Full block type support: paragraphs, headings, images, callouts, columns, tables, equations, toggles, synced blocks, bookmarks, embeds, video, audio, file, PDF
- Incremental sync via `.nts-state.json` (only re-fetch changed pages)
- Parallel sync with configurable concurrency
- Markdown, MDX, and JSON output adapters
- SEO metadata extraction (seo_title, description, canonical)
- Internal Notion link resolution between pages
- Back-link stripping (removes Notion navigation artifacts)
- Language detection from content
- Image download and WebP conversion pipeline
- Zod schema validation for frontmatter
- Watch mode with configurable polling interval
- Deletion sync (removes local files for pages deleted from Notion)
- Property extraction from Notion: title, slug, status, tags, category, author, featured, language, cover image, and more
