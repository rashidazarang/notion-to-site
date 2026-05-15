# Changelog

## 1.1.2

### Added

- **Property-based tests for `renderRichText`** using `fast-check` — generates
  thousands of valid `RichTextItemResponse` arrays (text, equation, and
  user/page/date/link_preview mentions × every annotation combination × every
  color strategy) and asserts the serializer never throws, always returns a
  string, respects color strategies, applies annotations in the documented
  nesting order, resolves page mentions correctly, and preserves item order.
  No bugs surfaced across ~5,000 generated cases.

## 1.1.1

### Fixed

- **Path-traversal hardening for user-set slugs.** A custom slug from a Notion
  `Slug` / `URL` property bypassed `slugify` and went straight into the output
  filename, so a value like `../../etc/passwd` could escape `outputDir`. User-set
  slugs are now passed through `slugify` (same sanitization the title path uses);
  if the cleaned result is empty, the slug falls back to `slugify(title)`.

## 1.1.0

Fulfills the P4b commitment — responsive image sizes and LQIP blur placeholders
land where an `<Image>` component can actually consume them. All new behavior
is opt-in; the default sync is unchanged.

### Added

- **`images.placeholder: boolean`** — generates a tiny base64 WebP blur for
  every downloaded image (~300 bytes), surfaced via the new manifest.
- **`images.sizes: number[]`** — emits resized WebP variants at the given
  widths alongside the full-size file (never enlarges past the source).
- **`<NotionImage>`** server component (`notion-to-site/next`) — looks up the
  placeholder + sizes by `src` from the manifest, renders the image with a
  CSS blur background and a `srcSet` for responsive loading. Falls back to a
  plain `<img>` when no manifest entry exists, so it is always safe to use.
- **`.notion-to-site/images.json`** — emitted by `nts sync` when any image has
  a placeholder or sizes. The manifest the `<NotionImage>` consumer reads.
- **`state.imageHashes` is now actually populated** — finally fulfills the
  dead data-model promise from 0.3.0. `recordPage` receives the canonical-URL
  → content-hash map collected during image resolution, enabling future
  orphaned-image cleanup.
- `generatePlaceholder()` and the `ImageMetadata` type are exported from the
  public API for custom consumers.

## 1.0.1

### Fixed

- **Slug collisions silently dropped pages.** Two pages whose titles slugify to
  the same value wrote to the same output file — the second overwrote the
  first (a live sync of 65 pages produced only 64 files). Colliding slugs are
  now suffixed `-2`, `-3`, … so every page gets its own file.

## 1.0.0

The 1.0 release — `notion-to-site` is now a typed content framework, not just a
markdown sync tool.

### Breaking

- **`schema.mode` now defaults to `'typed'`.** A `nts sync` with a config that
  does not set `schema.mode` produces the flat, typed frontmatter shape that
  mirrors your Notion database — instead of the legacy nested `meta.*` shape.
  Run `nts migrate` to see exactly how this affects your project, and set
  `schema: { mode: 'legacy' }` to keep 0.x behavior unchanged.

### Added

- **`nts migrate`** — checks whether your config pins `schema.mode` and prints
  precise upgrade guidance for the default change. `migrationAdvice()` is also
  exported for programmatic use.

### Notes

- The `notion-to-site/astro` loader pins `legacy` mode internally, so existing
  Astro setups are unaffected by the default change.
- The public API — the `exports` map and the programmatic surface (`sync`,
  `defineContent`, `renderRichText`, the typegen functions, the Astro loader,
  the Next.js helpers) — is considered stable as of 1.0.

## 0.9.0

First-class Next.js integration.

### Added

- **`notion-to-site/next`** — three pieces for Next.js App Router projects:
  - `withNotion()` — a `next.config` wrapper that syncs the Notion content
    before each build / dev start. A sync failure logs a warning and proceeds
    with cached content, so a flaky network can't block a build.
  - `getAllPages()` / `getPageBySlug()` — typed accessors over the generated
    content module. Generic — pass your `NotionContent` type for full typing.
  - `<NotionContent>` — a server component that renders a page body to HTML.
- `next`, `react`, and `react-dom` are declared as optional peer dependencies;
  `marked` is used for `<NotionContent>`'s markdown rendering.

### Changed

- `examples/nextjs` rewritten to use the integration (Next.js 15, App Router) —
  the hand-rolled `lib/posts.ts` and the raw `<pre>` content dump are gone.

## 0.8.0

First-class Astro integration.

### Added

- **`notion-to-site/astro`** — an Astro Content Layer loader. Use `notionLoader()`
  directly in a collection definition; it runs the sync engine in-process when
  Astro builds the collection, so `getCollection()` and `<Content />` work with
  no `nts sync` step and no files on disk.
- The package now has an `exports` map: `notion-to-site` (core) and
  `notion-to-site/astro` (the loader). `astro` is an optional peer dependency.

### Changed

- `examples/astro` rewritten to use the loader (Astro 5, Content Layer).

## 0.7.0

Importable typed content API — the sync engine is now a programmatic `sync()`
function, and every sync emits a typed data module you can import directly.

### Added

- **`sync()`** — the programmatic sync engine behind `nts sync`. Takes a config,
  returns a `SyncResult` (`{ synced, skipped, failures, deleted, pages }`), and
  logs through an injectable callback. The framework integrations build on this.
- **Importable content module** — every write-mode sync emits
  `.notion-to-site/index.js` + `index.d.ts`, so a project can
  `import { pages, pagesBySlug } from './.notion-to-site'` with full types
  (legacy mode types against `PostFrontmatter`, typed mode against the
  generated `NotionContent`).
- **`defineContent()`** — a typed identity helper for authoring `nts.config.js`
  with editor autocomplete.
- Programmatic exports: `sync`, `generateTypes`, `defineContent`,
  `buildContentModule`, `emitContentModule`.

### Changed

- `runSync` moved out of the CLI into `src/core/sync.ts`. The `nts sync`,
  `nts watch`, and `nts types` commands are now thin wrappers over the engine.
- Removed the `ora` dependency — per-page spinners were silent at the default
  concurrency anyway; sync progress is logged plainly.

## 0.6.0

Typed content model — `notion-to-site` can now introspect *your* Notion
database and generate TypeScript types from its real property schema, instead
of forcing every database into a fixed blog shape. Opt-in; the default is
unchanged.

### Added

- **`schema.mode: 'typed'`** — introspects the data source schema, generates a
  TypeScript module (a Zod schema plus its inferred type), and writes a flat
  frontmatter shape that faithfully mirrors your database's properties. The
  default stays `'legacy'` (the existing blog-shaped nested frontmatter), so
  existing projects are untouched.
- **`nts types`** — a command that generates the typed schema module on its
  own. A typed `nts sync` also refreshes it on every run.
- **`schema.typesOutput`** config — where the generated module is written
  (default `./.notion-to-site/types.ts`).
- Programmatic exports for the type generator: `introspectSchema`,
  `propertyToTypes`, `emitTypes`, `extractPropertiesTyped`.

### Changed

- Output adapters now accept any frontmatter shape, not just the legacy one.
  H1-title injection moved from the adapters into the sync step so both schema
  modes share it.
- `nts validate` and `nts status` are schema-mode aware.

### Notes

- Type generation is honest about what Notion's API can't tell it statically:
  `rollup` results are `unknown` and `formula` results are a broad union.
  `select` / `multi_select` / `status` become exact literal unions.
- Relations are emitted as `string[]` of page IDs — resolving them to titles
  would invite cross-data-source recursion, so it is a deliberate non-goal.

## 0.5.0

Renderer fidelity pass — a shared rich-text serializer replaces the lossy
`plain_text` joins in callouts, tables, and code captions.

### Added

- `renderRichText()` — a rich-text serializer that preserves bold / italic /
  strikethrough / underline / code annotations, links, inline equations,
  colors, and mentions (resolving `@page` mentions to internal links).
  Exported for use by framework integrations.
- `content.color` config — how to render Notion's text/background colors:
  `'drop'` (default — ignored), `'inline'` (`<span style>`), or `'class'`
  (`<span class="notion-color-...">`).
- `content.transformers` config — per-block-type rendering overrides, for
  custom handling of any block type.

### Changed

- **Callouts and table cells now carry full rich text.** They previously
  collapsed to plain text, dropping bold, italic, links, and mentions. This
  enriches existing output — re-running `nts sync` will show formatting diffs
  with no semantic change.
- **Tables respect the column-header flag.** Row 0 is treated as a header only
  when Notion's `has_column_header` is set; otherwise an empty header row is
  emitted so the markdown table stays valid.
- Code blocks now preserve their caption (previously dropped).
- Child databases render as a bold titled reference instead of a bare title.

## 0.4.0

### Changed

- **Notion API 2025-09-03.** Migrated to the data-source model that replaced direct
  database queries. `database:` in your config keeps working unchanged — it is resolved
  to its data source automatically — and the internal raw-request workaround is gone.
- **Content-addressed images.** Downloaded images are stored flat and keyed by a hash of
  their canonical URL, so an image referenced from many pages is downloaded, encoded, and
  stored exactly once. Image paths in output change from `/images/<slug>/<hash>-<slug>.webp`
  to `/images/<hash>.webp` — re-run a full `nts sync` to regenerate.

### Added

- `dataSource` config option — pins a specific data source for the rare database that
  contains more than one.

## 0.3.0

Correctness and resilience pass — `nts sync` can no longer lose data or report
success when it actually failed.

### Fixed

- **Data loss:** the deletion pass ran even when pages failed to fetch — a transient
  API error made a page look "removed" and deleted its local file. The deletion pass
  now runs only after a clean full sync.
- **Silent CI success:** `nts sync` exited 0 even when every page failed. It now exits
  non-zero if any page fails.
- **Truncated pages:** `getPageBlocks` fetched only the first 100 child blocks, silently
  cutting off long tables, column lists, and toggles. It now paginates fully.
- **Corrupt state crash:** an unreadable `.nts-state.json` crashed every command. It is
  now detected and a fresh state is used instead, with a warning.
- **Concurrent state race:** parallel page syncs spread a stale state snapshot and could
  clobber each other's entries. State is now updated in place, per page.
- **Fragile image downloads:** image fetches ignored HTTP status, didn't follow redirects,
  and had no timeout — an expired URL fed an error page to the image encoder. Image
  fetches now check status, follow redirects, time out, and distinguish transient failures
  (kept, retried next run) from permanent ones (removed).

### Changed

- Sync progress is flushed to `.nts-state.json` periodically, so a crash mid-sync no longer
  loses all progress.
- Notion API requests are throttled (~3 req/s) and retried with backoff on rate limits and
  server errors, using the official SDK's built-in retry support.
- `nts watch` skips a tick if the previous sync is still running, instead of stacking runs.

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
