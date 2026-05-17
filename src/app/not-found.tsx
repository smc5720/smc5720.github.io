import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCardCompact } from "@/components/PostCardCompact";
import { PathnameDisplay } from "@/components/PathnameDisplay";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — 페이지를 찾을 수 없습니다",
  description: "요청한 페이지가 존재하지 않습니다.",
};

// Build hash: use a fixed placeholder (static export has no runtime)
const BUILD_HASH = "2026.05.18 · a8e3f1";

export default function NotFound() {
  const allPosts = getAllPosts();
  const suggested = allPosts.slice(0, 3);

  // Code rain text lines — shown as background decoration
  const codeRainLines = [
    "GET /unknown → 404",
    "GET /unknown → 404",
    "GET /unknown → 404 not found",
    "fallback: /404",
    "fallback: /404 · static export",
    "[next.js 16] route did not match any frontmatter",
    `[mdx] no file at content/posts/unknown.mdx`,
    `suggestion: did you mean ${suggested[0]?.slug ?? "next16-app-router-migration"}?`,
    "suggestion: try /blog",
    "GET /unknown → 404",
    "GET /unknown → 404 not found",
    "fallback: /404 · static export",
    "[next.js 16] route did not match any frontmatter",
    `suggestion: did you mean ${suggested[0]?.slug ?? "next16-app-router-migration"}?`,
    "suggestion: try /blog",
  ];

  return (
    <section
      style={{
        paddingTop: 48,
        paddingBottom: 120,
        position: "relative",
        minHeight: "70vh",
      }}
    >
      {/* ── ASCII code rain backdrop ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          maskImage:
            "linear-gradient(180deg, transparent, black 30%, black 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, black 30%, black 70%, transparent)",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-3)",
            fontSize: 11,
            lineHeight: 1.4,
            opacity: 0.25,
            padding: "60px 32px",
            whiteSpace: "pre-wrap",
            letterSpacing: 0,
          }}
        >
          {codeRainLines.join("\n")}
        </pre>
      </div>

      <div className="container" style={{ position: "relative" }}>
        {/* ── Status bar ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div className="mono-label" style={{ display: "flex", gap: 12 }}>
            <span style={{ color: "var(--color-red)" }}>● ERROR</span>
            <span style={{ color: "var(--color-text-3)" }}>/</span>
            <span>STATIC ROUTE NOT FOUND</span>
            <span style={{ color: "var(--color-text-3)" }}>/</span>
            <span style={{ color: "var(--color-text-3)" }}>404</span>
          </div>
          <div
            className="mono-label tabular"
            style={{ color: "var(--color-text-3)" }}
          >
            BUILD HASH · {BUILD_HASH}
          </div>
        </div>

        {/* ── 2-column hero: 404 number | description ── */}
        <div className="nf-grid" style={{ marginBottom: 80 }}>
          {/* Left: giant 404 number */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(160px, 24vw, 360px)",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                color: "var(--color-text)",
                fontWeight: 360,
                display: "flex",
                alignItems: "baseline",
                gap: 0,
              }}
            >
              4
              <span
                style={{ color: "var(--color-accent)", fontStyle: "italic" }}
              >
                0
              </span>
              4
              <span
                style={{
                  color: "var(--color-accent)",
                  fontSize: "0.3em",
                  marginLeft: 12,
                }}
              >
                .
              </span>
            </div>
            <div
              className="mono-label"
              style={{ marginTop: 18, color: "var(--color-text-3)" }}
            >
              HTTP STATUS · NOT FOUND
            </div>
          </div>

          {/* Right: heading, lede, pathname echo, buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h1
              className="display display-h2"
              style={{ margin: 0 }}
            >
              여기엔 글이 없어요
              <span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>

            <p
              className="lede"
              style={{ color: "var(--color-text-2)", maxWidth: 460 }}
            >
              주소가 잘못됐거나, 글이 옮겨졌거나, 아직 쓰지 않은 글일 수
              있습니다. 아래 단서 중 하나를 따라가 보세요.
            </p>

            {/* Pathname display — Client Component (usePathname requires client) */}
            <PathnameDisplay />

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/" className="btn btn-primary">
                <span>Take me home</span>
                <span style={{ opacity: 0.6 }}>↩</span>
              </Link>
              <Link href="/blog" className="btn">
                <span>Browse all essays</span>
                <span style={{ opacity: 0.5 }}>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Suggested posts ── */}
        {suggested.length > 0 && (
          <div style={{ borderTop: "1px solid var(--color-border-2)", paddingTop: 32 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div className="mono-label">
                SUGGESTED · YOU MIGHT BE LOOKING FOR
              </div>
              <Link href="/blog" className="arrow-link">
                <span>See all essays</span>
                <span className="arrow" />
              </Link>
            </div>

            <div className="nf-grid-3">
              {suggested.map((post) => (
                <PostCardCompact key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
