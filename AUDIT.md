# OSS Audit — notion-to-site (rename from ntx → nts)

## Hardcoded values to remove

| File | Line | Current | Fix |
|------|------|---------|-----|
| `src/cli.ts` | 197 | `config.author ?? 'Rashid Azarang'` | Change fallback to `''` (empty string) — require author in config or leave blank |
| `src/cli.ts` | 83 | `(/c/${slug}${rest})` — hardcoded URL prefix | Make configurable via `config.linkPrefix` (default `/blog`) |
| `src/core/renderer.ts` | 174 | `[${slug}](/c/${slug})` — same hardcoded prefix | Use same configurable prefix |
| `src/cli.ts` | 84 | `(/notion/${hexId}${rest})` — fallback for unresolved links | Should use configurable prefix or omit link |
| `src/cli.ts` | 293 | `type: 'essay'` hardcoded in frontmatter | Move to config or remove (schema default handles it) |
| `src/cli.ts` | 294 | `intent: 'reference'` hardcoded in frontmatter | Move to config or remove |
| `ntx.config.example.ts` | 20 | `database: '69f88a28f7ae4a3ab647d86f54282ab0'` | Replace with `'YOUR_NOTION_DATABASE_ID'` |

## Config defaults to generalize

| Item | Location | Issue |
|------|----------|-------|
| Author fallback | `cli.ts:197` | Falls back to personal name — should require config or default to `''` |
| Content type/intent | `cli.ts:293-294`, `schema.ts:34-35` | Defaults `essay`/`reference` — too opinionated for generic tool. Consider `post`/`general` or make them fully optional |
| Link prefix `/c/` | `cli.ts:83`, `renderer.ts:174` | Assumes specific site URL structure — needs `config.linkPrefix` |
| CLI binary name | `package.json:7` | `"ntx"` → `"nts"` |
| Package name | `package.json:2` | `"ntx"` → `"notion-to-site"` |
| Program name | `cli.ts:371` | `.name('ntx')` → `.name('nts')` |
| Config file name | `cli.ts:379,384` | `ntx.config.js` → `nts.config.js` |
| Init template | `cli.ts:384` | References `ntx` in comment |
| State file | `.gitignore` | `.ntx-state.json` → `.nts-state.json` |

## .gitignore gaps

| Path | Current status | Fix |
|------|---------------|-----|
| `ntx.config.js` | **NOT ignored** (only `ntx.config.ts` is in .gitignore) | Add `ntx.config.js` / `nts.config.js` |
| `test-output/` | **NOT ignored** — 350+ personal content files in repo | Add `test-output/` |
| `ntx.config.example.ts` | Tracked (correct — but has personal DB ID) | Fix the ID, keep tracked |

## API surface inventory

### CLI commands
| Command | Flags | Description |
|---------|-------|-------------|
| `nts init` | — | Scaffold config file |
| `nts sync` | `--incremental`, `--db <id>` | Full/incremental sync |
| `nts watch` | `--interval <seconds>` | Poll-based incremental sync |
| `nts validate` | — | Validate output against Zod schema |
| `nts status` | — | Show sync state + statistics |

### NtxConfig (src/types.ts)
```
database: string
output: string
adapter: 'markdown' | 'mdx' | 'json'
author?: string
images: { download, outputDir, format, quality }
schema: { strict }
sync?: { concurrency, deletions }
content?: { toc, stripBackLinks }
watch?: { interval }
```

### Public exports (src/index.ts)
- `NotionClient` — Notion API wrapper
- `NtxRenderer` — block→markdown renderer
- `loadState`, `saveState`, `needsUpdate`, `updatePageState` + types `NtxState`, `PageState`
- `processImage` + types `ImageProcessOptions`, `ImageResult`
- `extractComment`, `detectLanguage`, `stripMarkdownInline`
- `MarkdownAdapter`, `MdxAdapter`, `JsonAdapter`
- `PostFrontmatterSchema`, `validateFrontmatter`, `extractProperties` + types
- `loadConfig` + type `NtxConfig`

### Adapter interface (implicit, not declared)
```ts
write(slug: string, frontmatter: PostFrontmatter, content: string, outputDir: string): void
```
**Note:** No explicit `Adapter` interface/type is exported — each adapter class just implements `write()` by convention.

## Dependencies review

| Dep | Used by | Verdict |
|-----|---------|---------|
| `@notionhq/client` | core/client.ts | Required |
| `chalk` | cli.ts | Required (CLI output) |
| `commander` | cli.ts | Required (CLI framework) |
| `dotenv` | cli.ts line 2-4 | **Move to optional/docs** — users should load their own env. At minimum, don't `dotenv.config()` at module level in a library entry point |
| `gray-matter` | adapters/markdown.ts, cli.ts | Required (frontmatter parse/stringify) |
| `notion-to-md` | core/renderer.ts | Required (block→md conversion) |
| `ora` | cli.ts | Required (CLI spinners) |
| `sharp` | pipeline/images.ts | **Should be optional** — only needed when `images.download: true`. Heavy native dep (~30MB). Make it a peer/optional dep |
| `zod` | schema.ts | Required (validation) |

### Recommendations
1. **`sharp`** — move to `optionalDependencies` or `peerDependencies`. Lazy-import it (already done via dynamic `import('./pipeline/images.js')`). Add install note in README.
2. **`dotenv`** — remove from package deps. Document "add dotenv yourself or set NOTION_TOKEN in env". The CLI can conditionally `import('dotenv')` with try/catch.
3. All other deps are justified and necessary.

## Code quality for OSS

### No TODOs/FIXMEs found
Clean.

### Console.log usage
All `console.log` calls in `src/cli.ts` are intentional CLI output (via `chalk`). No debug logging found.

### Missing interface declaration
The `Adapter` pattern is duck-typed. For OSS consumers who want to write custom adapters, export an explicit interface:
```ts
export interface ContentAdapter {
  write(slug: string, frontmatter: PostFrontmatter, content: string, outputDir: string): void
}
```

### Missing JSDoc on public exports
None of the exports in `src/index.ts` have JSDoc. For OSS, at minimum document:
- `NtxRenderer` constructor and `renderPage()`
- `loadConfig()` behavior
- `processImage()` options

### The `dotenv.config()` at CLI top
Lines 2-4 of `cli.ts` call `dotenv.config()` unconditionally on import. This is fine for a CLI binary but problematic if someone imports from the library entry point. Currently safe because `cli.ts` is the bin entry and `index.ts` is the lib entry.

## Rename checklist (ntx → nts / notion-to-site)

| What | Where | Change |
|------|-------|--------|
| Package name | `package.json:2` | `ntx` → `notion-to-site` |
| Binary | `package.json:7` | `ntx` → `nts` |
| Program name | `cli.ts:371` | `.name('ntx')` → `.name('nts')` |
| Description | `cli.ts:372` | `Notion to X` → `Notion to Site` |
| Config filename | `cli.ts:379,384,397` | `ntx.config.js` → `nts.config.js` |
| State filename | `core/state.ts` | `.ntx-state.json` → `.nts-state.json` |
| Config loader | `config.ts` | looks for `ntx.config.*` → `nts.config.*` |
| Placeholder regex | `renderer.ts` | `ntx-img:` prefix → `nts-img:` or keep internal |
| .gitignore | root | `.ntx-state.json` → `.nts-state.json` |
| Example config | `ntx.config.example.ts` | Rename to `nts.config.example.ts` |

## Clean bill / known gaps

**What's good:**
- Clean architecture: adapter pattern, separate client/renderer/state
- Zero personal values in core source (only the fallback author)
- Schema validation with Zod
- Incremental sync with state tracking
- Good CLI UX (spinners, colors, status command)
- No secrets in source files

**Gaps to close before publish:**
1. Remove `'Rashid Azarang'` fallback author (HIGH)
2. Fix `ntx.config.example.ts` database ID (HIGH)
3. Add `ntx.config.js` and `test-output/` to `.gitignore` (HIGH)
4. Make `/c/` link prefix configurable (MEDIUM)
5. Make `sharp` optional (MEDIUM — blocks install on environments without native build tools)
6. Remove `dotenv` from package deps or make it optional (LOW)
7. Export explicit `Adapter` interface (LOW)
8. Add minimal JSDoc on public API (LOW)
9. Execute full rename: ntx → nts / notion-to-site (REQUIRED)
