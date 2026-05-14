import test from 'node:test'
import assert from 'node:assert/strict'

import { fetchImageBuffer, ImageFetchError } from '../dist/pipeline/images.js'

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
