import sharp from 'sharp'
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

  const buffer = await fetchImageBuffer(opts.url)
  fs.mkdirSync(writeDir, { recursive: true })
  await sharp(buffer).webp({ quality: opts.quality ?? 80 }).toFile(destPath)

  return { localPath: destPath, urlPath, hash }
}
