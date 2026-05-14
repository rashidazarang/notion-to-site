/**
 * `withNotion` — a Next.js config wrapper that syncs the Notion content before
 * each build / dev start. A sync failure logs a warning and proceeds with the
 * cached content, so a flaky network can't block a build.
 *
 * ```js
 * // next.config.mjs
 * import { withNotion } from 'notion-to-site/next'
 * export default withNotion({ /* your next config *\/ })
 * ```
 */
import { sync } from '../core/sync.js'
import { loadConfig } from '../config.js'
import type { NtxConfig } from '../types.js'

export interface WithNotionOptions {
  /** A config object, used instead of loading `nts.config.js`. */
  config?: NtxConfig
  /** Sync only pages changed since the last run. Default `true`. */
  incremental?: boolean
}

/**
 * Wraps a Next.js config object so the Notion content is synced when the
 * config loads. Returns an async config function — Next.js supports that.
 */
export function withNotion<T extends Record<string, any>>(
  nextConfig: T = {} as T,
  options: WithNotionOptions = {},
): () => Promise<T> {
  return async () => {
    try {
      const config = options.config ?? (await loadConfig())
      await sync({
        config,
        incremental: options.incremental ?? true,
        log: (m) => console.log(`[notion-to-site] ${m}`),
      })
    } catch (err: any) {
      console.warn(`[notion-to-site] sync failed, using cached content: ${err.message}`)
    }
    return nextConfig
  }
}
