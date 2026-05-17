// blog-404.jsx — Not Found page

function NotFoundPage({ onNav, attempted }) {
  const posts = window.POSTS || [];
  const suggested = posts.slice(0, 3);

  return (
    <main style={{ paddingTop: 48, paddingBottom: 120, position: "relative", minHeight: "70vh" }}>
      {/* faint code rain backdrop */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
        maskImage: "linear-gradient(180deg, transparent, black 30%, black 70%, transparent)"
      }}>
        <pre style={{
          margin: 0, fontFamily: "var(--font-mono)", color: "var(--color-text-3)",
          fontSize: 11, lineHeight: 1.4, opacity: .25,
          padding: "60px 32px", whiteSpace: "pre-wrap",
          letterSpacing: 0
        }}>
{`GET ${attempted || "/unknown"} → 404
GET ${attempted || "/unknown"} → 404
GET ${attempted || "/unknown"} → 404 not found
fallback: /404
fallback: /404 · static export
[next.js 16] route did not match any frontmatter
[mdx] no file at content/posts/${(attempted || "/unknown").replace(/^\//, "")}.mdx
suggestion: did you mean ${suggested[0]?.slug || "next16-app-router-migration"}?
suggestion: try /blog`}
        </pre>
      </div>

      <div className="container" style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, flexWrap: "wrap", gap: 12 }}>
          <div className="mono-label" style={{ display: "flex", gap: 12 }}>
            <span style={{ color: "var(--color-red)" }}>● ERROR</span>
            <span style={{ color: "var(--color-text-3)" }}>/</span>
            <span>STATIC ROUTE NOT FOUND</span>
            <span style={{ color: "var(--color-text-3)" }}>/</span>
            <span style={{ color: "var(--color-text-3)" }}>404</span>
          </div>
          <div className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
            BUILD HASH · 2026.05.09 · a8e3f1
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center", marginBottom: 80 }} className="nf-grid">
          <div>
            <div style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(160px, 24vw, 360px)",
              lineHeight: .85,
              letterSpacing: "-.04em",
              color: "var(--color-text)",
              fontWeight: 360,
              display: "flex", alignItems: "baseline", gap: 0
            }}>
              4<span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>0</span>4
              <span style={{ color: "var(--color-accent)", fontSize: ".3em", marginLeft: 12 }}>.</span>
            </div>
            <div className="mono-label" style={{ marginTop: 18, color: "var(--color-text-3)" }}>HTTP STATUS · NOT FOUND</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h1 className="display display-h2" style={{ margin: 0 }}>
              여기엔 글이 없어요<span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
            <p className="lede" style={{ color: "var(--color-text-2)", maxWidth: 460 }}>
              주소가 잘못됐거나, 글이 옮겨졌거나, 아직 쓰지 않은 글일 수 있습니다. 아래 단서 중 하나를 따라가 보세요.
            </p>
            {attempted && (
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 13,
                padding: "12px 16px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-2)",
                color: "var(--color-text-2)",
                wordBreak: "break-all"
              }}>
                <span style={{ color: "var(--color-text-3)" }}>requested</span>{"  "}
                <span style={{ color: "var(--color-red)" }}>{attempted}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => onNav({ name: "home" })}>
                <span>Take me home</span><span style={{ opacity: .6 }}>↩</span>
              </button>
              <button className="btn" onClick={() => onNav({ name: "blog" })}>
                <span>Browse all essays</span><span style={{ opacity: .5 }}>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* suggestions */}
        <div style={{ borderTop: "1px solid var(--color-border-2)", paddingTop: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
            <div className="mono-label">SUGGESTED · YOU MIGHT BE LOOKING FOR</div>
            <ArrowLink onClick={() => onNav({ name: "blog" })}>See all essays</ArrowLink>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            columnGap: 40, rowGap: 0,
            borderBottom: "1px solid var(--color-border-2)"
          }} className="nf-grid-3">
            {suggested.map(p => (
              <PostCard key={p.slug} post={p} onOpen={(pp) => onNav({ name: "post", slug: pp.slug })} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { NotFoundPage });
