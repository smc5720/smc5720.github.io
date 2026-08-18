/**
 * OG metadata cache — shared by scripts/build-og-cache.mjs.
 *
 * LinkCard used to scrape OG tags at build time, which fired one external
 * request per card (266 of them, 231 to dev.to) on every CI build. Rate
 * limiting on the runner IP made random pages blow past Next's 60s per-page
 * export limit. The cache is committed to the repo so `next build` needs no
 * network at all.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'

export const CACHE_PATH = resolve('data/og-cache.json')

const USER_AGENT =
  'Mozilla/5.0 (compatible; RicoCheeseBlog/1.0; +https://ricocheese.dev)'

/** @typedef {{ ok: boolean, title: string, description: string, image: string, siteName: string, fetchedAt: string }} OGEntry */

/** @returns {Record<string, OGEntry>} */
export function loadCache() {
  if (!existsSync(CACHE_PATH)) return {}
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
  } catch (err) {
    console.warn(`cache unreadable, starting fresh: ${err.message}`)
    return {}
  }
}

/** @param {Record<string, OGEntry>} cache */
export function saveCache(cache) {
  mkdirSync(dirname(CACHE_PATH), { recursive: true })
  // Sort keys so diffs stay readable as posts accumulate
  const sorted = Object.fromEntries(
    Object.entries(cache).sort(([a], [b]) => a.localeCompare(b))
  )
  writeFileSync(CACHE_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8')
}

function readMeta(html, property) {
  const attrFirst = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
    'i'
  )
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
    'i'
  )
  return (attrFirst.exec(html)?.[1] ?? contentFirst.exec(html)?.[1] ?? '').trim()
}

function decodeEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/**
 * Scrape OG tags for a single URL. Never throws — a failure is cached as
 * `ok: false` so the next build does not retry it.
 *
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<OGEntry>}
 */
export async function scrapeOG(url, timeoutMs = 10000) {
  const stamp = new Date().toISOString().slice(0, 10)
  const failed = {
    ok: false,
    title: '',
    description: '',
    image: '',
    siteName: '',
    fetchedAt: stamp,
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow',
    })
    if (!res.ok) return failed

    const html = await res.text()
    return {
      ok: true,
      title: decodeEntities(readMeta(html, 'og:title')),
      description: decodeEntities(readMeta(html, 'og:description')),
      image: readMeta(html, 'og:image'),
      siteName: decodeEntities(readMeta(html, 'og:site_name')),
      fetchedAt: stamp,
    }
  } catch {
    return failed
  }
}

/**
 * Run `worker` over `items` with a bounded number of in-flight tasks.
 *
 * @template T
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T, index: number) => Promise<void>} worker
 */
export async function mapWithConcurrency(items, limit, worker) {
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      await worker(items[index], index)
    }
  })
  await Promise.all(runners)
}
