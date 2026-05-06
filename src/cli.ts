#!/usr/bin/env node
import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import * as path from 'path'
import * as fs from 'fs'
import matter from 'gray-matter'

import { loadConfig } from './config.js'
import { NotionClient } from './core/client.js'
import { NtxRenderer } from './core/renderer.js'
import { loadState, saveState, needsUpdate, updatePageState } from './core/state.js'
import { MarkdownAdapter } from './adapters/markdown.js'
import { MdxAdapter } from './adapters/mdx.js'
import { JsonAdapter } from './adapters/json.js'
import { extractProperties, PostFrontmatterSchema, validateFrontmatter } from './schema.js'
import type { PostFrontmatter } from './schema.js'
import { detectLanguage, extractComment } from './pipeline/content.js'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function resolveImagePlaceholders(
  content: string,
  _slug: string,
  _imageDir: string,
  _quality: number = 80,
): Promise<string> {
  return content.replace(/!\[image\]\(notion:[^)]+\)/g, '')
}

async function runSync(opts: { incremental?: boolean; db?: string }): Promise<void> {
  const config = await loadConfig()
  const outputDir = path.resolve(config.output)
  const state = loadState(outputDir)
  const client = new NotionClient()
  const renderer = new NtxRenderer(client)

  const adapter =
    config.adapter === 'mdx'
      ? new MdxAdapter()
      : config.adapter === 'json'
        ? new JsonAdapter()
        : new MarkdownAdapter()

  const databaseId = opts.db ?? config.database
  let synced = 0
  let skipped = 0
  const startTime = Date.now()

  for await (const page of client.paginateDatabase(databaseId)) {
    const props = extractProperties(page)
    if (!props.title) continue

    const slug = slugify(props.title)
    if (!slug) continue

    if (opts.incremental && !needsUpdate(state, page.id, page.last_edited_time)) {
      skipped++
      continue
    }

    const spinner = ora(`Syncing ${slug}...`).start()

    try {
      let content = await renderer.renderPage(page.id)

      if (config.images.download) {
        const imageDir = path.resolve(config.images.outputDir)
        content = await resolveImagePlaceholders(content, slug, imageDir, config.images.quality)
      }

      const language = props.language || detectLanguage(content)
      const comment = extractComment(content, props.title)

      const today = new Date().toISOString().split('T')[0]
      const frontmatter: PostFrontmatter = {
        id: slug,
        path: `/blog/${slug}.md`,
        type: 'essay',
        intent: 'reference',
        version: '1.0',
        created: today,
        last_updated: today,
        source: { platform: 'notion', page_id: page.id },
        meta: {
          title: props.title,
          author: 'Rashid Azarang',
          category: [],
          main_tag: null,
          tags: props.tags,
          featured: props.featured,
          featured_at: props.featured_at,
          language,
          post_type: 'Post',
          status: props.status,
          comment,
          cover_image: props.cover_image,
        },
      }

      if (config.schema.strict) {
        validateFrontmatter(frontmatter)
      }

      adapter.write(slug, frontmatter, content, outputDir)

      const newState = updatePageState(state, {
        pageId: page.id,
        slug,
        lastEditedTime: page.last_edited_time,
        outputPath: path.join(outputDir, slug + '.md'),
        imageHashes: {},
      })
      Object.assign(state, newState)

      spinner.succeed(chalk.green(`✓ ${slug}`))
      synced++
    } catch (err: any) {
      spinner.fail(chalk.red(`✗ ${slug}: ${err.message}`))
    }
  }

  if (!opts.incremental) {
    state.lastFullSync = new Date().toISOString()
  }
  saveState(outputDir, state)

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(chalk.blue(`\nSynced ${synced} pages (${skipped} skipped) in ${elapsed}s`))
}

const program = new Command()
program
  .name('ntx')
  .description('Notion to X — sync any Notion database to local content files')
  .version('0.1.0')

program
  .command('init')
  .description('Create ntx.config.ts in the current directory')
  .action(async () => {
    const target = path.join(process.cwd(), 'ntx.config.ts')
    if (fs.existsSync(target)) {
      console.error(chalk.red('ntx.config.ts already exists. Delete it first to reinitialize.'))
      process.exit(1)
    }

    const templatePath = '/Users/rashid/Desktop/notion-x/ntx.config.example.ts'
    const template = fs.readFileSync(templatePath, 'utf-8')
    fs.writeFileSync(target, template, 'utf-8')
    console.log(chalk.green('✓ Created ntx.config.ts — edit it before running ntx sync'))
  })

program
  .command('sync')
  .description('Sync Notion database to local content files')
  .option('--incremental', 'Only sync pages changed since last run', false)
  .option('--db <id>', 'Override the database ID from config')
  .action(async (opts) => {
    try {
      await runSync(opts)
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`))
      process.exit(1)
    }
  })

program
  .command('watch')
  .description('Poll and incrementally sync on interval')
  .option('--interval <seconds>', 'Poll interval in seconds', '60')
  .action(async (opts) => {
    const intervalSec = parseInt(opts.interval, 10)
    console.log(chalk.blue('Watching... (Ctrl+C to stop)'))

    const tick = async () => {
      console.log(chalk.gray(`[${new Date().toISOString()}] Polling...`))
      try {
        await runSync({ incremental: true })
      } catch (err: any) {
        console.error(chalk.red(`Error: ${err.message}`))
      }
    }

    await tick()
    setInterval(tick, intervalSec * 1000)
  })

program
  .command('validate')
  .description('Validate all output files against the Zod schema')
  .action(async () => {
    const config = await loadConfig()
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
      const fullPath = path.join(outputDir, file)
      const raw = fs.readFileSync(fullPath, 'utf-8')

      let data: unknown
      if (ext === '.json') {
        const parsed = JSON.parse(raw) as { frontmatter?: unknown }
        data = parsed.frontmatter
      } else if (ext === '.mdx') {
        const match = raw.match(/export const meta = (\{[\s\S]*?\n\})/)
        if (!match) {
          console.log(chalk.red(`✗ ${slug}: could not find meta export`))
          failures++
          continue
        }
        try {
          data = JSON.parse(match[1])
        } catch (err: any) {
          console.log(chalk.red(`✗ ${slug}: invalid meta JSON — ${err.message}`))
          failures++
          continue
        }
      } else {
        data = matter(raw).data
      }

      const result = PostFrontmatterSchema.safeParse(data)
      if (result.success) {
        console.log(chalk.green(`✓ ${slug}`))
      } else {
        const msg = result.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ')
        console.log(chalk.red(`✗ ${slug}: ${msg}`))
        failures++
      }
    }

    if (failures > 0) {
      console.error(chalk.red(`\n${failures} file(s) failed validation`))
      process.exit(1)
    }
    console.log(chalk.blue(`\nAll ${files.length} files valid`))
  })

program
  .command('status')
  .description('Show sync state and statistics')
  .action(async () => {
    const config = await loadConfig()
    const outputDir = path.resolve(config.output)
    const state = loadState(outputDir)
    const ext = config.adapter === 'mdx' ? '.mdx' : config.adapter === 'json' ? '.json' : '.md'

    console.log(chalk.bold('ntx status'))
    console.log(`  Output dir:        ${outputDir}`)
    console.log(`  Last full sync:    ${state.lastFullSync ?? 'never'}`)
    console.log(`  Tracked pages:     ${Object.keys(state.pages).length}`)

    let published = 0
    let other = 0
    let stale = 0

    for (const entry of Object.values(state.pages)) {
      const filePath = path.join(outputDir, entry.slug + ext)
      if (!fs.existsSync(filePath)) {
        stale++
        continue
      }

      try {
        let data: any
        const raw = fs.readFileSync(filePath, 'utf-8')
        if (ext === '.json') {
          data = JSON.parse(raw).frontmatter
        } else if (ext === '.mdx') {
          const match = raw.match(/export const meta = (\{[\s\S]*?\n\})/)
          data = match ? JSON.parse(match[1]) : {}
        } else {
          data = matter(raw).data
        }
        if (data?.meta?.status === 'Published') published++
        else other++
      } catch {
        other++
      }
    }

    console.log(`  Published:         ${published}`)
    console.log(`  Other status:      ${other}`)
    console.log(`  Stale entries:     ${stale}`)
  })

program.parse(process.argv)
