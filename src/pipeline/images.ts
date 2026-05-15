import sharp from 'sharp'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

export interface ImageSizeVariant {
  /** Target width in pixels. */
  width: number
  /** URL path to the resized variant (`/images/<hash>-<width>.webp`). */
  urlPath: string
}

export interface ImageProcessOptions {
  url: string
  outputDir: string
  quality?: number
  /** Generate a tiny base64 blur placeholder in the result (~300 bytes). */
  placeholder?: boolean
  /** Emit resized variants at these widths (px); never enlarges past the source. */
  sizes?: number[]
}

export interface ImageResult {
  localPath: string
  urlPath: string
  hash: string
  /** Base64 data URL of a tiny blur placeholder (only when `placeholder: true`). */
  placeholder?: string
  /** Resized variants (only when `sizes` provided). */
  sizes?: ImageSizeVariant[]
}

/**
 * The per-image entry surfaced via `.notion-to-site/images.json` — what the
 * `<NotionImage>` server component looks up by URL to render a blur-up image
 * with `srcset`.
 */
export interface ImageMetadata {
  placeholder?: string
  sizes?: ImageSizeVariant[]
}

/**
 * Raised when an image cannot be fetched. `transient` distinguishes a
 * temporary failure (network error, timeout, 5xx, 429 — worth keeping the
 * remote URL and retrying on a later sync) from a permanent one (404/410 —
 * the image is genuinely gone).
 */
export class ImageFetchError extends Error {
  constructor(
    message: string,
    readonly transient: boolean,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'ImageFetchError'
  }
}

const FETCH_TIMEOUT_MS = 30_000

/**
 * Fetches an image URL into a Buffer. Checks the HTTP status (an expired S3
 * signed URL returns an error page, not an image), follows redirects, and
 * times out — failures surface as a typed {@link ImageFetchError}.
 */
export async function fetchImageBuffer(url: string): Promise<Buffer> {
  let res: Response
  try {
    res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
  } catch (err: any) {
    // Network failure or timeout — always transient.
    throw new ImageFetchError(`could not reach image URL: ${err.message}`, true)
  }
  if (!res.ok) {
    // 5xx and 429 are transient; 4xx (notably 404/410) are permanent.
    const transient = res.status >= 500 || res.status === 429
    throw new ImageFetchError(`image URL returned HTTP ${res.status}`, transient, res.status)
  }
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Builds a tiny base64-encoded WebP blur placeholder from a source buffer.
 * Returns a `data:image/webp;base64,…` URL ready to use as a CSS background
 * or `<img src>` for blur-up loading. Typical size ~200–500 bytes.
 */
export async function generatePlaceholder(source: Buffer): Promise<string> {
  const blur = await sharp(source)
    .resize(20, null, { fit: 'inside' })
    .blur(2)
    .webp({ quality: 30 })
    .toBuffer()
  return `data:image/webp;base64,${blur.toString('base64')}`
}

export async function processImage(opts: ImageProcessOptions): Promise<ImageResult> {
  const u = new URL(opts.url)
  // Hash the canonical URL — Notion's S3 URLs carry signed, ever-changing
  // query params, so hashing origin + pathname gives a stable key. Images are
  // stored content-addressed and flat, so the same image referenced from many
  // pages is downloaded, encoded, and stored exactly once.
  const canonical = u.origin + u.pathname
  const hash = crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 16)
  const filename = `${hash}.webp`
  const destPath = path.join(opts.outputDir, filename)
  const urlPath = `/images/${filename}`
  const quality = opts.quality ?? 80
  const wantsDerivatives = !!opts.placeholder || (opts.sizes && opts.sizes.length > 0)

  // Source buffer — from fetch on cache miss, or read from cache when we need
  // it to derive a placeholder or resized variants.
  let source: Buffer | null = null
  if (fs.existsSync(destPath)) {
    if (wantsDerivatives) source = fs.readFileSync(destPath)
  } else {
    source = await fetchImageBuffer(opts.url)
    fs.mkdirSync(opts.outputDir, { recursive: true })
    await sharp(source).webp({ quality }).toFile(destPath)
  }

  const result: ImageResult = { localPath: destPath, urlPath, hash }

  if (opts.placeholder && source) {
    result.placeholder = await generatePlaceholder(source)
  }

  if (opts.sizes && opts.sizes.length > 0 && source) {
    result.sizes = []
    for (const width of opts.sizes) {
      const sizeFilename = `${hash}-${width}.webp`
      const sizePath = path.join(opts.outputDir, sizeFilename)
      if (!fs.existsSync(sizePath)) {
        await sharp(source)
          .resize(width, null, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality })
          .toFile(sizePath)
      }
      result.sizes.push({ width, urlPath: `/images/${sizeFilename}` })
    }
  }

  return result
}
