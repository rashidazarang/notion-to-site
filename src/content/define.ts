import type { NtxConfig } from '../types.js'

/** The shape of a notion-to-site content definition — an alias of `NtxConfig`. */
export type ContentDefinition = NtxConfig

/**
 * Identity helper for authoring a typed config. Lets a plain `nts.config.mjs`
 * get full editor autocomplete and type-checking:
 *
 * ```js
 * import { defineContent } from 'notion-to-site'
 * export default defineContent({ database: '…', output: './content', adapter: 'markdown' })
 * ```
 */
export function defineContent(config: NtxConfig): NtxConfig {
  return config
}
