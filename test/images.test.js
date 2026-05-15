import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { fetchImageBuffer, ImageFetchError, processImage } from '../dist/pipeline/images.js'

// A minimal 1x1 PNG — small enough to embed, real enough for sharp to decode.
const ONE_PX_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==',
  'base64',
)

function pngResponse() {
  const ab = new ArrayBuffer(ONE_PX_PNG.byteLength)
  new Uint8Array(ab).set(ONE_PX_PNG)
  return { ok: true, status: 200, arrayBuffer: async () => ab }
}

function withMockedFetch(impl, fn) {
  const orig = globalThis.fetch
  globalThis.fetch = impl
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      globalThis.fetch = orig
    })
}

test('fetchImageBuffer: a 404 throws a permanent ImageFetchError', () =>
  withMockedFetch(
    async () => ({ ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) }),
    () =>
      assert.rejects(
        () => fetchImageBuffer('https://example.com/x.png'),
        (err) =>
          err instanceof ImageFetchError && err.transient === false && err.status === 404,
      ),
  ))

test('fetchImageBuffer: a 503 throws a transient ImageFetchError', () =>
  withMockedFetch(
    async () => ({ ok: false, status: 503, arrayBuffer: async () => new ArrayBuffer(0) }),
    () =>
      assert.rejects(
        () => fetchImageBuffer('https://example.com/x.png'),
        (err) => err instanceof ImageFetchError && err.transient === true,
      ),
  ))

test('fetchImageBuffer: a 429 is treated as transient', () =>
  withMockedFetch(
    async () => ({ ok: false, status: 429, arrayBuffer: async () => new ArrayBuffer(0) }),
    () =>
      assert.rejects(
        () => fetchImageBuffer('https://example.com/x.png'),
        (err) => err instanceof ImageFetchError && err.transient === true,
      ),
  ))

test('fetchImageBuffer: a network error is transient', () =>
  withMockedFetch(
    async () => {
      throw new Error('ECONNRESET')
    },
    () =>
      assert.rejects(
        () => fetchImageBuffer('https://example.com/x.png'),
        (err) => err instanceof ImageFetchError && err.transient === true,
      ),
  ))

test('fetchImageBuffer: a 200 returns a Buffer of the body', () =>
  withMockedFetch(
    async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => new Uint8Array([1, 2, 3, 4]).buffer,
    }),
    async () => {
      const buf = await fetchImageBuffer('https://example.com/x.png')
      assert.ok(Buffer.isBuffer(buf))
      assert.equal(buf.length, 4)
    },
  ))

test('processImage: stores content-addressed and dedups a repeated URL', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-img-'))
  let fetchCount = 0
  return withMockedFetch(
    async () => {
      fetchCount++
      return pngResponse()
    },
    async () => {
      try {
        const url = 'https://files.notion.example/abc/image.png?signed=xyz'
        const first = await processImage({ url, outputDir: dir, quality: 80 })
        const second = await processImage({ url, outputDir: dir, quality: 80 })
        assert.equal(first.urlPath, second.urlPath)
        assert.ok(first.urlPath.endsWith('.webp'))
        assert.ok(existsSync(first.localPath))
        assert.equal(fetchCount, 1, 'the repeated URL should be served from the stored file')
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
  )
})

test('processImage: dedups the same image across different signed URLs', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-img2-'))
  let fetchCount = 0
  return withMockedFetch(
    async () => {
      fetchCount++
      return pngResponse()
    },
    async () => {
      try {
        const a = await processImage({
          url: 'https://files.notion.example/abc/image.png?sig=AAA',
          outputDir: dir,
        })
        const b = await processImage({
          url: 'https://files.notion.example/abc/image.png?sig=BBB',
          outputDir: dir,
        })
        assert.equal(a.urlPath, b.urlPath, 'same canonical path → same stored file')
        assert.equal(fetchCount, 1)
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
  )
})

test('processImage: placeholder option returns a base64 webp data URL', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-ph-'))
  return withMockedFetch(
    async () => pngResponse(),
    async () => {
      try {
        const result = await processImage({
          url: 'https://x.example/img.png',
          outputDir: dir,
          placeholder: true,
        })
        assert.ok(result.placeholder, 'placeholder should be set')
        assert.match(result.placeholder, /^data:image\/webp;base64,/)
        assert.ok(result.placeholder.length < 4096, 'placeholder should be tiny (LQIP)')
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
  )
})

test('processImage: sizes option emits resized variants beside the full-size file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-sz-'))
  return withMockedFetch(
    async () => pngResponse(),
    async () => {
      try {
        const result = await processImage({
          url: 'https://x.example/img.png',
          outputDir: dir,
          sizes: [10, 20],
        })
        assert.ok(Array.isArray(result.sizes))
        assert.equal(result.sizes.length, 2)
        assert.equal(result.sizes[0].width, 10)
        assert.match(result.sizes[0].urlPath, /-10\.webp$/)
        assert.equal(result.sizes[1].width, 20)
        assert.match(result.sizes[1].urlPath, /-20\.webp$/)
        for (const s of result.sizes) {
          const fname = s.urlPath.split('/').pop()
          assert.ok(existsSync(join(dir, fname)), `${fname} should exist on disk`)
        }
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
  )
})

test('processImage: derivatives can be generated on a cache hit', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nts-cache-deriv-'))
  let fetchCount = 0
  return withMockedFetch(
    async () => {
      fetchCount++
      return pngResponse()
    },
    async () => {
      try {
        // First call writes the full-size file, no placeholder requested.
        await processImage({ url: 'https://x.example/img.png', outputDir: dir })
        assert.equal(fetchCount, 1)
        // Second call hits the cache for full-size but still derives the placeholder.
        const second = await processImage({
          url: 'https://x.example/img.png',
          outputDir: dir,
          placeholder: true,
        })
        assert.equal(fetchCount, 1, 'no second fetch — full-size was cached')
        assert.match(second.placeholder, /^data:image\/webp;base64,/)
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
  )
})
