/**
 * Migration guidance for the 1.0 schema-mode default change. Pure — `nts
 * migrate` inspects the loaded config and prints the result; it never edits
 * the config file (config files are arbitrary JS).
 */
import type { NtxConfig } from './types.js'

export interface MigrationAdvice {
  /** True when the config pins `schema.mode` — the 1.0 flip cannot surprise it. */
  pinned: boolean
  message: string
}

export function migrationAdvice(config: NtxConfig): MigrationAdvice {
  const mode = config.schema?.mode
  if (mode) {
    return {
      pinned: true,
      message:
        `Your config pins schema.mode: '${mode}'. ` +
        'The 1.0 default change does not affect you — nothing to do.',
    }
  }
  return {
    pinned: false,
    message: [
      'notion-to-site 1.0 changed the default schema mode to "typed".',
      'Your config file does not set schema.mode, so `nts sync` will now',
      'produce typed output — a flat frontmatter shape mirroring your Notion',
      'database — instead of the legacy nested `meta.*` shape.',
      '',
      'To keep your current output unchanged, set the mode explicitly:',
      "  schema: { strict: false, mode: 'legacy' }",
      '',
      'To move to typed mode (recommended): run `nts types` to generate the',
      'TypeScript schema, then `nts sync`. Update any site code that reads',
      '`data.meta.*` — typed frontmatter exposes your real Notion property',
      'names at the top level, plus `_id` and `_notion_id`.',
    ].join('\n'),
  }
}
