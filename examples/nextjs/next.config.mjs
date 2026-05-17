import { withNotion } from 'notion-to-site/next'

// `withNotion` syncs the Notion content (reading nts.config.mjs) when the
// config loads — before each `next dev` / `next build`. A sync failure logs
// a warning and proceeds with the cached content.
export default withNotion({})
