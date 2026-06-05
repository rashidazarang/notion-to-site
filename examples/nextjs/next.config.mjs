import { withNotion } from 'notion-to-site/next/plugin'

// `withNotion` syncs the Notion content (reading nts.config.mjs) when the
// config loads — before each `next dev` / `next build`. A sync failure logs
// a warning and proceeds with the cached content.
//
// It's imported from `notion-to-site/next/plugin` (not `/next`) so the sync
// engine stays out of your runtime bundle. Use an ESM config (next.config.mjs);
// the package is ESM-only, so next.config.ts won't resolve the subpath export.
export default withNotion({})
