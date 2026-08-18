#!/usr/bin/env node
/**
 * Populate data/og-cache.json with OG metadata for every <LinkCard url="..." />
 * in content/posts/.
 *
 * Usage:
 *   node scripts/build-og-cache.mjs             # fetch only URLs missing from the cache
 *   node scripts/build-og-cache.mjs --refresh   # refetch everything
 *   node scripts/build-og-cache.mjs --retry     # also retry entries cached as failures
 *   node scripts/build-og-cache.mjs --prune     # drop entries no longer referenced by any post
 *
 * Run this after adding posts and commit the result — CI builds read the cache
 * and never hit the network.
 */
import { readdirSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { loadCache, saveCache, scrapeOG, mapWithConcurrency } from './lib/og-cache.mjs'

const CONCURRENCY = 4
const POSTS_DIR = resolve('content/posts')

const args = process.argv.slice(2)
const refresh = args.includes('--refresh')
const retryFailed = args.includes('--retry')
const prune = args.includes('--prune')

function collectUrls() {
  const urls = new Set()
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'))

  for (const file of files) {
    const source = readFileSync(join(POSTS_DIR, file), 'utf8')
    for (const match of source.matchAll(/<LinkCard\b[^>]*?\burl=["']([^"']+)["']/g)) {
      urls.add(match[1])
    }
  }
  return [...urls]
}

const urls = collectUrls()
const cache = loadCache()

const targets = urls.filter((url) => {
  if (refresh) return true
  const hit = cache[url]
  if (!hit) return true
  return retryFailed && !hit.ok
})

console.log(
  `posts scanned: ${readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx')).length}, ` +
    `LinkCard URLs: ${urls.length}, cached: ${urls.length - targets.length}, to fetch: ${targets.length}`
)

let done = 0
let failures = 0

await mapWithConcurrency(targets, CONCURRENCY, async (url) => {
  const entry = await scrapeOG(url)
  cache[url] = entry
  done++
  if (!entry.ok) failures++
  if (done % 20 === 0 || done === targets.length) {
    console.log(`  ${done}/${targets.length} fetched (${failures} failed)`)
  }
})

if (prune) {
  const referenced = new Set(urls)
  let removed = 0
  for (const key of Object.keys(cache)) {
    if (!referenced.has(key)) {
      delete cache[key]
      removed++
    }
  }
  if (removed > 0) console.log(`pruned ${removed} unreferenced entries`)
}

saveCache(cache)

console.log(`cache written: ${Object.keys(cache).length} entries, ${failures} failed this run`)
if (failures > 0) {
  console.log('failed URLs are cached as ok:false — rerun with --retry to try again')
}
