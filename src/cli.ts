#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config({ quiet: true })
dotenv.config({ path: '.env.local', override: true, quiet: true })

import { Command } from 'commander'
import chalk from 'chalk'
import * as path from 'path'
import * as fs from 'fs'
import matter from 'gray-matter'

import { loadConfig } from './config.js'
import { NotionClient } from './core/client.js'
import { sync, generateTypes } from './core/sync.js'
import { loadState } from './core/state.js'
import { PostFrontmatterSchema } from './schema.js'

const pkg = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'),
) as { version: string }

const program = new Command()
program
  .name('nts')
  .description('Notion to Site — sync any Notion database to local content files')
  .version(pkg.version)

program
  .command('init')
  .description('Create nts.config.js in the current directory')
  .action(async () => {
    const target = path.join(process.cwd(), 'nts.config.js')
    if (fs.existsSync(target)) {
      console.error(chalk.red('nts.config.js already exists. Delete it first to reinitialize.'))
      process.exit(1)
    }
    const template = `// nts.config.js — edit before running nts sync
export default {
  database: 'YOUR_NOTION_DATABASE_ID',
  output: './content',
  adapter: 'markdown',
  author: 'Your Name',
  linkPrefix: '/blog',
  images: { download: true, outputDir: './public/images', format: 'webp', quality: 80 },
  schema: { strict: false },
  sync: { concurrency: 5, deletions: true },
  content: { toc: false, stripBackLinks: true },
}
`
    fs.writeFileSync(target, template, 'utf-8')
    console.log(chalk.green('✓ Created nts.config.js — edit it before running nts sync'))
  })

program
  .command('sync')
  .description('Sync Notion database to local content files')
  .option('--incremental', 'Only sync pages changed since last run', false)
  .option('--db <id>', 'Override the database ID from config')
  .action(async (opts) => {
    const config = await loadConfig()
    const result = await sync({
      config,
      incremental: opts.incremental,
      db: opts.db,
      log: (m) => console.log(chalk.gray(m)),
    })
    if (result.failures > 0) {
      throw new Error(`${result.failures} page(s) failed to sync`)
    }
  })

program
  .command('types')
  .description('Generate TypeScript types from your Notion database schema')
  .action(async () => {
    const config = await loadConfig()
    const schema = await generateTypes(config, new NotionClient(), config.database)
    const typesPath = path.resolve(config.schema?.typesOutput ?? './.notion-to-site/types.ts')
    console.log(
      chalk.green(
        `✓ Generated types for ${schema.properties.length} properties → ${typesPath}`,
      ),
    )
  })

program
  .command('watch')
  .description('Poll and incrementally sync on interval')
  .option('--interval <seconds>', 'Poll interval in seconds', '60')
  .action(async (opts) => {
    const intervalSec = parseInt(opts.interval, 10)
    console.log(chalk.blue(`Watching (interval=${intervalSec}s, Ctrl+C to stop)…`))
    let running = false
    const tick = async () => {
      if (running) {
        console.log(chalk.gray('  (previous sync still running — skipping this tick)'))
        return
      }
      running = true
      console.log(chalk.gray(`[${new Date().toISOString()}] Polling…`))
      try {
        const config = await loadConfig()
        await sync({ config, incremental: true, log: (m) => console.log(chalk.gray(m)) })
      } catch (err: any) {
        console.error(chalk.red(`Error: ${err.message}`))
      } finally {
        running = false
      }
    }
    await tick()
    setInterval(tick, intervalSec * 1000)
  })

program
  .command('validate')
  .description('Validate all output files against Zod schema')
  .action(async () => {
    const config = await loadConfig()
    const mode = config.schema?.mode ?? 'legacy'
    const outputDir = path.resolve(config.output)
    const ext = config.adapter === 'mdx' ? '.mdx' : config.adapter === 'json' ? '.json' : '.md'

    if (!fs.existsSync(outputDir)) {
      console.error(chalk.red(`Output directory does not exist: ${outputDir}`))
      process.exit(1)
    }

    const files = fs.readdirSync(outputDir).filter((f) => f.endsWith(ext))
    let failures = 0

    for (const file of files) {
      const slug = file.replace(ext, '')
      const raw = fs.readFileSync(path.join(outputDir, file), 'utf-8')

      let data: unknown
      if (ext === '.json') {
        data = (JSON.parse(raw) as any).frontmatter
      } else if (ext === '.mdx') {
        const match = raw.match(/export const meta = (\{[\s\S]*?\n\})/)
        if (!match) {
          console.log(chalk.red(`✗ ${slug}: no meta export`))
          failures++
          continue
        }
        try {
          data = JSON.parse(match[1])
        } catch (e: any) {
          console.log(chalk.red(`✗ ${slug}: invalid JSON — ${e.message}`))
          failures++
          continue
        }
      } else {
        data = matter(raw).data
      }

      if (mode === 'typed') {
        // Typed mode: the generated Zod schema lives in the consumer's
        // project, so here we just confirm the file parses and carries its
        // nts identity field.
        if (data && typeof data === 'object' && '_id' in (data as Record<string, unknown>)) {
          console.log(chalk.green(`✓ ${slug}`))
        } else {
          console.log(chalk.red(`✗ ${slug}: missing _id`))
          failures++
        }
        continue
      }

      const result = PostFrontmatterSchema.safeParse(data)
      if (result.success) {
        console.log(chalk.green(`✓ ${slug}`))
      } else {
        const msg = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
        console.log(chalk.red(`✗ ${slug}: ${msg}`))
        failures++
      }
    }

    if (failures > 0) {
      console.error(chalk.red(`\n${failures} file(s) failed`))
      process.exit(1)
    }
    console.log(chalk.blue(`\nAll ${files.length} files valid`))
  })

program
  .command('status')
  .description('Show sync state and statistics')
  .action(async () => {
    const config = await loadConfig()
    const mode = config.schema?.mode ?? 'legacy'
    const outputDir = path.resolve(config.output)
    const state = loadState(outputDir)
    const ext = config.adapter === 'mdx' ? '.mdx' : config.adapter === 'json' ? '.json' : '.md'

    console.log(chalk.bold('\nnts status'))
    console.log(`  Output dir:     ${outputDir}`)
    console.log(`  Schema mode:    ${mode}`)
    console.log(`  Last full sync: ${state.lastFullSync ?? 'never'}`)
    console.log(`  Tracked pages:  ${Object.keys(state.pages).length}`)

    let published = 0
    let other = 0
    let stale = 0
    for (const entry of Object.values(state.pages)) {
      const fp = path.join(outputDir, entry.slug + ext)
      if (!fs.existsSync(fp)) {
        stale++
        continue
      }
      // The Published / Other breakdown is specific to the legacy schema shape.
      if (mode === 'legacy') {
        try {
          const raw = fs.readFileSync(fp, 'utf-8')
          const data: any =
            ext === '.json'
              ? JSON.parse(raw).frontmatter
              : ext === '.mdx'
                ? (() => {
                    const m = raw.match(/export const meta = (\{[\s\S]*?\n\})/)
                    return m ? JSON.parse(m[1]) : {}
                  })()
                : matter(raw).data
          if (data?.meta?.status === 'Published') published++
          else other++
        } catch {
          other++
        }
      }
    }

    if (mode === 'legacy') {
      console.log(`  Published:      ${published}`)
      console.log(`  Other status:   ${other}`)
    }
    console.log(`  Stale entries:  ${stale}\n`)
  })

program.parseAsync(process.argv).catch((err: any) => {
  console.error(chalk.red(`Error: ${err.message}`))
  process.exit(1)
})
