import * as path from 'path'
import * as fs from 'fs'
import { pathToFileURL } from 'url'
import type { NtxConfig } from './types.js'

export async function loadConfig(cwd?: string): Promise<NtxConfig> {
  const dir = cwd ?? process.cwd()

  const candidates = [
    path.join(dir, 'nts.config.js'),
    path.join(dir, 'nts.config.ts'),
  ]

  const targetPath = candidates.find(p => fs.existsSync(p))
  if (!targetPath) {
    throw new Error(`No nts.config.js found in ${dir}. Run \`nts init\` to create one.`)
  }

  try {
    const mod = await import(pathToFileURL(targetPath).href)
    const config: NtxConfig = mod.default ?? mod
    if (!config.database) throw new Error('nts.config: `database` is required')
    if (!config.output) throw new Error('nts.config: `output` is required')
    if (!config.adapter) throw new Error('nts.config: `adapter` is required')
    return config
  } catch (err: any) {
    if (err.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
      throw new Error(
        'Cannot import .ts config directly. Either compile it first (tsc), ' +
          'or rename it to nts.config.js and use ES module syntax.',
      )
    }
    throw err
  }
}
