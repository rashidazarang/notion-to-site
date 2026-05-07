# Changelog

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
