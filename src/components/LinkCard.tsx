import type { ReactNode } from "react";
import { getCachedOG, isKnownBadOG } from "@/lib/og-cache";

interface OGData {
  title: string;
  description: string;
  image: string;
  siteName: string;
}

interface LinkCardProps {
  url: string;
  title?: string;
  author?: string;
  date?: string;
}

/**
 * Hard ceiling for the live-fetch fallback. Next wraps `fetch` for its own
 * caching and the `signal` we hand it is not always honoured, so the race
 * below — not the AbortSignal — is what actually bounds the wait. Without it
 * a slow host stalls the whole page past Next's 60s per-page export limit and
 * fails the build.
 */
const OG_FETCH_TIMEOUT_MS = 4000;

async function raceTimeout<T>(
  work: (signal: AbortSignal) => Promise<T>,
  ms: number
): Promise<T | null> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const bail = new Promise<null>((resolveBail) => {
    timer = setTimeout(() => {
      controller.abort();
      resolveBail(null);
    }, ms);
  });

  try {
    return await Promise.race([work(controller.signal), bail]);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parseOG(html: string, fallbackTitle: string, url: string): OGData {
  function getMeta(property: string): string {
    // property="og:*" or name="og:*"
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["\']${property}["\'][^>]+content=["\']([^"\']*)["\']`,
      "i"
    );
    const re2 = new RegExp(
      `<meta[^>]+content=["\']([^"\']*)["\'][^>]+(?:property|name)=["\']${property}["\']`,
      "i"
    );
    return (re.exec(html)?.[1] ?? re2.exec(html)?.[1] ?? "").trim();
  }

  return {
    title: getMeta("og:title") || fallbackTitle || url,
    description: getMeta("og:description"),
    image: getMeta("og:image"),
    siteName: getMeta("og:site_name"),
  };
}

/**
 * Cache first, network never if we can help it. `pnpm og:cache` fills
 * data/og-cache.json ahead of time so CI builds make zero external requests.
 */
async function fetchOGData(url: string, fallbackTitle?: string): Promise<OGData> {
  const empty: OGData = {
    title: fallbackTitle ?? url,
    description: "",
    image: "",
    siteName: "",
  };

  const cached = getCachedOG(url);
  if (cached) {
    return {
      title: cached.title || fallbackTitle || url,
      description: cached.description,
      image: cached.image,
      siteName: cached.siteName,
    };
  }

  // Cached as unfetchable — don't burn 4s rediscovering that on every build.
  if (isKnownBadOG(url)) return empty;

  const html = await raceTimeout(async (signal) => {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RicoCheeseBlog/1.0; +https://ricocheese.dev)",
        Accept: "text/html",
      },
      cache: "force-cache",
      signal,
    });
    if (!res.ok) return null;
    return res.text();
  }, OG_FETCH_TIMEOUT_MS);

  if (!html) return empty;

  return parseOG(html, fallbackTitle ?? "", url);
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** External link icon (inline SVG, no dependency) */
function ExternalIcon(): ReactNode {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ flexShrink: 0, color: "var(--color-text-3)" }}
    >
      <path
        d="M2.5 2.5h7m0 0v7m0-7L2.5 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Globe placeholder shown when no OG image is available */
function ImagePlaceholder(): ReactNode {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-surface-3)",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: "var(--color-text-3)" }}
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M12 3c2.4 3 4 5.5 4 9s-1.6 6-4 9M12 3c-2.4 3-4 5.5-4 9s1.6 6 4 9M3 12h18"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}

export async function LinkCard({ url, title, author, date }: LinkCardProps) {
  const og = await fetchOGData(url, title);
  const domain = getDomain(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-card"
      aria-label={`${og.title} — 외부 링크 (${domain})`}
    >
      {/* OG image column */}
      <div className="link-card-img">
        {og.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={og.image}
            alt=""
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      {/* Text column */}
      <div className="link-card-body">
        {/* Site name / domain row */}
        <div className="link-card-meta">
          <span className="link-card-domain">
            {og.siteName || domain}
          </span>
          <ExternalIcon />
        </div>

        {/* Title */}
        <p className="link-card-title">{og.title}</p>

        {/* Description */}
        {og.description && (
          <p className="link-card-desc">{og.description}</p>
        )}

        {/* Author + date footer */}
        {(author || date) && (
          <p className="link-card-footer">
            {author && <span>{author}</span>}
            {author && date && <span aria-hidden="true"> · </span>}
            {date && <time dateTime={date}>{date}</time>}
          </p>
        )}
      </div>
    </a>
  );
}
