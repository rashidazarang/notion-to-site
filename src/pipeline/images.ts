import sharp from 'sharp'
import * as https from 'https'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

export interface ImageProcessOptions {
  url: string
  slug: string
  outputDir: string
  quality?: number
}

export interface ImageResult {
  localPath: string
  urlPath: string
  hash: string
}

export async function processImage(opts: ImageProcessOptions): Promise<ImageResult> {
  const u = new URL(opts.url)
  const canonical = u.origin + u.pathname
  const hash = crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 8)
  const filename = `${hash}-${opts.slug}.webp`
  const writeDir = path.join(opts.outputDir, opts.slug)
  const destPath = path.join(writeDir, filename)
  const urlPath = `/images/${opts.slug}/${filename}`

  if (fs.existsSync(destPath)) {
    return { localPath: destPath, urlPath, hash }
  }

  fs.mkdirSync(writeDir, { recursive: true })

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    https.get(opts.url, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })

  await sharp(buffer).webp({ quality: opts.quality ?? 80 }).toFile(destPath)

  return { localPath: destPath, urlPath, hash }
}
