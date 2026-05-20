import type { ReactNode } from "react";

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

async function fetchOGData(url: string, fallbackTitle?: string): Promise<OGData> {
  const empty: OGData = {
    title: fallbackTitle ?? url,
    description: "",
    image: "",
    siteName: "",
  };

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RicoCheeseBlog/1.0; +https://ricocheese.dev)",
        Accept: "text/html",
      },
      // Build-time fetch — Next.js caches by default; force-cache is fine for static export
      cache: "force-cache",
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return empty;

    const html = await res.text();

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
  } catch {
    return empty;
  }
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
