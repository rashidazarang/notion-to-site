import * as path from 'path'
import * as fs from 'fs'
import { pathToFileURL } from 'url'
import type { NtxConfig } from './types.js'

export async function loadConfig(cwd?: string): Promise<NtxConfig> {
  const dir = cwd ?? process.cwd()
  const configPath = path.join(dir, 'ntx.config.ts')

  if (!fs.existsSync(configPath) && !fs.existsSync(path.join(dir, 'ntx.config.js'))) {
    throw new Error(`No ntx.config.ts found in ${dir}. Run \`ntx init\` to create one.`)
  }

  const jsConfigPath = path.join(dir, 'ntx.config.js')
  const targetPath = fs.existsSync(jsConfigPath) ? jsConfigPath : configPath

  try {
    const mod = await import(pathToFileURL(targetPath).href)
    const config: NtxConfig = mod.default ?? mod
    if (!config.database) throw new Error('ntx.config: `database` is required')
    if (!config.output) throw new Error('ntx.config: `output` is required')
    if (!config.adapter) throw new Error('ntx.config: `adapter` is required')
    return config
  } catch (err: any) {
    if (err.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
      throw new Error(
        'Cannot import ntx.config.ts directly. Either compile it first (tsc), ' +
          'or rename it to ntx.config.js and use ES module syntax.',
      )
    }
    throw err
  }
}
