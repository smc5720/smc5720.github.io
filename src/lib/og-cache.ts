import { readFileSync } from "fs";
import { resolve } from "path";

export interface OGEntry {
  ok: boolean;
  title: string;
  description: string;
  image: string;
  siteName: string;
  fetchedAt: string;
}

/**
 * OG metadata scraped ahead of time by `pnpm og:cache` and committed to the
 * repo. Read once per build process, not once per page — 531 posts render
 * across 3 workers and re-reading the file per LinkCard would be wasteful.
 */
let cache: Record<string, OGEntry> | null = null;

function load(): Record<string, OGEntry> {
  if (cache) return cache;
  try {
    cache = JSON.parse(
      readFileSync(resolve(process.cwd(), "data/og-cache.json"), "utf8"),
    ) as Record<string, OGEntry>;
  } catch {
    // Missing or malformed cache is not fatal — LinkCard falls back to a
    // best-effort live fetch, then to the bare URL.
    cache = {};
  }
  return cache;
}

export function getCachedOG(url: string): OGEntry | undefined {
  const hit = load()[url];
  return hit?.ok ? hit : undefined;
}

/** True when the URL is known to be unfetchable, so we should not retry it. */
export function isKnownBadOG(url: string): boolean {
  return load()[url]?.ok === false;
}
