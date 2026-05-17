import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { loadConfig } from '../dist/index.js'

async function withTempConfig(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'nts-config-'))
  try {
    return await fn(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test('loadConfig: loads the default nts.config.mjs', async () => {
  await withTempConfig(async (dir) => {
    writeFileSync(
      join(dir, 'nts.config.mjs'),
      `export default { database: 'mjs-db', output: './content', adapter: 'markdown' }\n`,
      'utf-8',
    )

    const config = await loadConfig(dir)
    assert.equal(config.database, 'mjs-db')
    assert.equal(config.adapter, 'markdown')
  })
})

test('loadConfig: keeps supporting legacy CommonJS nts.config.js', async () => {
  await withTempConfig(async (dir) => {
    writeFileSync(
      join(dir, 'nts.config.js'),
      `module.exports = { database: 'js-db', output: './content', adapter: 'json' }\n`,
      'utf-8',
    )

    const config = await loadConfig(dir)
    assert.equal(config.database, 'js-db')
    assert.equal(config.adapter, 'json')
  })
})

test('loadConfig: prefers nts.config.mjs when both config files exist', async () => {
  await withTempConfig(async (dir) => {
    writeFileSync(
      join(dir, 'nts.config.mjs'),
      `export default { database: 'mjs-db', output: './content', adapter: 'mdx' }\n`,
      'utf-8',
    )
    writeFileSync(
      join(dir, 'nts.config.js'),
      `module.exports = { database: 'js-db', output: './content', adapter: 'json' }\n`,
      'utf-8',
    )

    const config = await loadConfig(dir)
    assert.equal(config.database, 'mjs-db')
    assert.equal(config.adapter, 'mdx')
  })
})
