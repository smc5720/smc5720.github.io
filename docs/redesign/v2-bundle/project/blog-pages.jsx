// blog-pages.jsx — Home / BlogList / BlogDetail

const { useEffect, useMemo, useRef, useState } = React;

// ──────────────────────────────────────────────────────────────
// HOME
// ──────────────────────────────────────────────────────────────
function HomePage({ onNav, tweaks }) {
  const posts = window.POSTS || [];
  const featured = posts.find(p => p.featured) || posts[0];
  const recent = posts.filter(p => p.slug !== featured.slug).slice(0, 6);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section style={{ position: "relative", paddingTop: 48, paddingBottom: 80 }}>
        {tweaks.gridLines && <div className="grid-bg" />}
        <div className="container" style={{ position: "relative" }}>
          {/* meta strip */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 56, flexWrap: "wrap", gap: 12 }}>
            <div className="mono-label" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <span>RICOCHEESE / STUDIO LOG</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span style={{ color: "var(--color-text-3)" }}>VOL. 02 · ISSUE 14</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span style={{ color: "var(--color-text-3)" }}>EST. 2022</span>
            </div>
            <div className="mono-label tabular" style={{ display: "flex", gap: 10, alignItems: "center", maxWidth: 360, overflow: "hidden" }}>
              <span style={{ whiteSpace: "nowrap" }}>NOW PLAYING</span>
              <span style={{ color: "var(--color-accent)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                ● {featured.title.length > 24 ? featured.title.slice(0, 24) + "…" : featured.title}
              </span>
            </div>
          </div>

          {/* hero headline */}
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 80, alignItems: "end", marginBottom: 48 }}>
            <div>
              <h1 className="display" style={{
                fontSize: "clamp(72px, 11.5vw, 188px)",
                margin: 0, color: "var(--color-text)"
              }}>
                <span style={{ fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>The</span><br/>
                Studio<br/>
                Log<span style={{ color: "var(--color-accent)", display: "inline-block", transform: "translateY(.1em)" }}>.</span>
              </h1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-end", paddingBottom: 18 }}>
              <pre style={{
                margin: 0, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-3)",
                lineHeight: 1.3, textAlign: "right", letterSpacing: 0
              }}>{`         ╱╲    ╱╲
        ╱  ╲  ╱  ╲
       ╱    ╲╱    ╲
       ──── ✦ ────
       writing as
       making things`}</pre>
              <p className="lede" style={{ maxWidth: 380, textAlign: "right", color: "var(--color-text-2)" }}>
                개발자 한 명이 쓰는 작업실 일지.<br/>
                <span style={{ color: "var(--color-text)" }}>코드</span>, <span style={{ color: "var(--color-text)" }}>회고</span>, <span style={{ color: "var(--color-text)" }}>릴리스 노트</span>를 한 곳에 모읍니다 — 천천히, 그러나 꾸준히.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => onNav({ name: "blog" })} className="btn btn-primary">
                  <span>Latest essays</span><span style={{ opacity: .6 }}>→</span>
                </button>
                <a className="btn btn-ghost" href="#rss">
                  <span>Subscribe · RSS</span>
                </a>
              </div>
            </div>
          </div>

          {/* category counts */}
          <CategoryCounts posts={posts} onFilter={(id) => onNav({ name: "blog", category: id })} />
        </div>
      </section>

      {/* ===== Marquee ===== */}
      <Marquee />

      {/* ===== Featured ===== */}
      <section style={{ marginTop: 64 }}>
        <div className="container">
          <SectionHead num="01" kicker="Featured · this week" title="가장 최근의 긴 글" right={<ArrowLink onClick={() => onNav({ name: "blog" })}>All posts</ArrowLink>} />
          <PostCardFeatured post={featured} onOpen={(p) => onNav({ name: "post", slug: p.slug })} />
        </div>
      </section>

      {/* ===== Recent grid ===== */}
      <section style={{ marginTop: 88 }}>
        <div className="container">
          <SectionHead num="02" kicker="Recently written" title="새 글 여섯 편" right={
            <div className="mono-label tabular" style={{ display: "flex", gap: 18 }}>
              <span>UPDATED</span>
              <span style={{ color: "var(--color-text)" }}>{formatDate(posts[0].date)}</span>
            </div>
          } />
          <div className="recent-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            columnGap: 40, rowGap: 8,
            borderBottom: "1px solid var(--color-border-2)"
          }}>
            {recent.map((p, i) => (
              <PostCard key={p.slug} post={p} onOpen={(pp) => onNav({ name: "post", slug: pp.slug })} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36 }}>
            <div className="mono-label" style={{ display: "flex", gap: 14 }}>
              <span style={{ color: "var(--color-text-3)" }}>Showing 6 of {posts.length}</span>
              <span style={{ color: "var(--color-text-3)" }}>·</span>
              <span>oldest essay: 2022.03.04</span>
            </div>
            <button className="btn" onClick={() => onNav({ name: "blog" })}>
              <span>Read all {posts.length} essays</span>
              <span style={{ opacity: .5 }}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== Pull quote ===== */}
      <section style={{ marginTop: 120 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 56, alignItems: "start" }}>
            <div>
              <div className="mono-label" style={{ marginBottom: 18 }}>03 · A NOTE</div>
              <p className="small">매번 더 좋은 글을 쓰려다 보니, 매번 시작하지 못했습니다. 2026년부터는 다른 규칙으로 운영합니다.</p>
              <button onClick={() => onNav({ name: "post", slug: "2026-spring-retrospective" })} className="arrow-link" style={{ marginTop: 18 }}>
                <span>Read the manifesto</span>
                <span className="arrow"></span>
              </button>
            </div>
            <blockquote style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.4vw, 52px)",
              lineHeight: 1.18, letterSpacing: "-.018em",
              color: "var(--color-text)",
              fontWeight: 360
            }}>
              <span style={{ color: "var(--color-accent)", marginRight: 6 }}>“</span>
              주 한 편. 길어도 좋고 짧아도 좋다.
              <span style={{ color: "var(--color-text-2)" }}> 빠지는 주는 메모로 대체.</span> 초안은 한 번에 끝낸다 — 다듬기는 다음 날 30분<span style={{ color: "var(--color-accent)" }}>.</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ===== Tag cloud / index ===== */}
      <section style={{ marginTop: 120 }}>
        <div className="container">
          <SectionHead num="04" kicker="Tag index" title="자주 쓰는 주제들" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "16px 0", borderTop: "1px solid var(--color-border-2)", borderBottom: "1px solid var(--color-border-2)" }}>
            {[
              ["next.js", 8], ["typescript", 14], ["mdx", 3], ["shiki", 2], ["react", 11],
              ["css", 9], ["tailwind", 6], ["rsc", 4], ["dx", 7], ["typography", 5],
              ["retro", 6], ["workflow", 9], ["release", 4], ["ai", 3], ["korean", 4], ["tooling", 8]
            ].map(([t, n]) => (
              <button key={t} className="chip" style={{ height: 32 }}>
                <span style={{ color: "var(--color-text-2)" }}>#{t}</span>
                <span className="count">{String(n).padStart(2,"0")}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────
// Section head
// ──────────────────────────────────────────────────────────────
function SectionHead({ num, kicker, title, right }) {
  return (
    <div className="sec-head" style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: 24,
      alignItems: "end",
      paddingBottom: 24,
      marginBottom: 0
    }}>
      <div className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>§ {num}</div>
      <div>
        <div className="mono-label" style={{ marginBottom: 8 }}>{kicker}</div>
        <h2 className="display display-h2" style={{ margin: 0 }}>{title}</h2>
      </div>
      <div style={{ alignSelf: "end" }}>{right}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Marquee
// ──────────────────────────────────────────────────────────────
function Marquee() {
  const words = [
    "글쓰기는 사고를 압축하는 일", "writing as making things",
    "코드 옆에 회고를", "the studio log", "한 주에 한 편",
    "deploy on push to main", "thinking in public"
  ];
  const items = words.concat(words);
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {items.map((w, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 56 }}>
            <span>{w}</span>
            <span className="dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// BLOG LIST
// ──────────────────────────────────────────────────────────────
function BlogListPage({ route, onNav, tweaks }) {
  const posts = window.POSTS || [];
  const cats = window.CATEGORIES || [];
  const [activeCat, setActiveCat] = useState(route.category || "all");
  const [view, setView] = useState("list"); // 'list' | 'grid'
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new"); // 'new' | 'long' | 'short'
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    // mimic SSG hydration tick — show skeleton briefly
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(id);
  }, [activeCat, search, sort, view]);

  useEffect(() => {
    if (route.category && route.category !== activeCat) setActiveCat(route.category);
  // eslint-disable-next-line
  }, [route.category]);

  useEffect(() => { setPage(1); }, [activeCat, search, sort]);

  const filtered = useMemo(() => {
    let res = posts;
    if (activeCat !== "all") res = res.filter(p => p.category === activeCat);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q)
      );
    }
    res = [...res];
    if (sort === "long") res.sort((a, b) => b.readMin - a.readMin);
    else if (sort === "short") res.sort((a, b) => a.readMin - b.readMin);
    else res.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return res;
  }, [posts, activeCat, search, sort]);

  const paged = (tweaks && tweaks.pagination === "paged") ? filtered.slice(0, page * perPage) : filtered;
  const hasMore = paged.length < filtered.length;

  const counts = useMemo(() => {
    const c = { all: posts.length };
    for (const cat of cats) if (cat.id !== "all") c[cat.id] = posts.filter(p => p.category === cat.id).length;
    return c;
  }, [posts, cats]);

  return (
    <main>
      {/* Header strip */}
      <section style={{ paddingTop: 32, paddingBottom: 40, borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div className="mono-label" style={{ display: "flex", gap: 12 }}>
              <span>BREADCRUMB</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span>RICOCHEESE</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span style={{ color: "var(--color-text)" }}>BLOG</span>
            </div>
            <div className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
              {String(filtered.length).padStart(3, "0")} / {String(posts.length).padStart(3, "0")} essays
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
            <h1 className="display display-h1" style={{ margin: 0 }}>
              The <span style={{ fontStyle: "italic", color: "var(--color-text-2)" }}>Index</span><span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
            <p className="lede" style={{ maxWidth: 460, color: "var(--color-text-2)" }}>
              60편의 글이 다섯 가지 카테고리에 흩어져 있습니다. 검색하거나 카테고리로 좁혀 읽어보세요. <span style={{ color: "var(--color-text)" }}>모든 글은 MDX 원문이 공개</span>됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="list-sticky" style={{
        position: "sticky", top: 72, zIndex: 30,
        background: "rgba(7,7,10,.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--color-border)"
      }}>
        <div className="container list-controls" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", paddingTop: 16, paddingBottom: 16, gap: 16 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cats.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className="chip"
                aria-pressed={activeCat === c.id}
              >
                <span>{c.label}</span>
                <span className="count">{String(counts[c.id] || 0).padStart(2,"0")}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div className="search-box" style={{
              display: "flex", alignItems: "center", gap: 8,
              border: "1px solid var(--color-border-2)",
              padding: "0 10px", height: 36, minWidth: 220,
              background: "var(--color-surface)"
            }}>
              <span className="mono-label" style={{ color: "var(--color-text-3)" }}>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, desc, tags…"
                style={{
                  border: 0, outline: 0, background: "transparent",
                  color: "var(--color-text)", fontFamily: "var(--font-mono)",
                  fontSize: 12, letterSpacing: ".04em", flex: 1, padding: 0, height: "100%"
                }}
              />
              <span className="mono-label" style={{ color: "var(--color-text-3)" }}>⌘K</span>
            </div>
            {/* Sort */}
            <div style={{ display: "flex", border: "1px solid var(--color-border-2)", height: 36 }}>
              {[["new", "Newest"], ["long", "Longest"], ["short", "Shortest"]].map(([k, l], i) => (
                <button
                  key={k}
                  onClick={() => setSort(k)}
                  style={{
                    padding: "0 12px",
                    fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase",
                    color: sort === k ? "var(--color-bg)" : "var(--color-text-2)",
                    background: sort === k ? "var(--color-text)" : "transparent",
                    borderLeft: i > 0 ? "1px solid var(--color-border-2)" : 0
                  }}
                >{l}</button>
              ))}
            </div>
            {/* View toggle */}
            <div style={{ display: "flex", border: "1px solid var(--color-border-2)", height: 36 }}>
              {[["list", "Index"], ["grid", "Grid"]].map(([k, l], i) => (
                <button
                  key={k}
                  onClick={() => setView(k)}
                  style={{
                    padding: "0 12px",
                    fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase",
                    color: view === k ? "var(--color-bg)" : "var(--color-text-2)",
                    background: view === k ? "var(--color-text)" : "transparent",
                    borderLeft: i > 0 ? "1px solid var(--color-border-2)" : 0
                  }}
                >{l}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div className="container">
          {loading ? (
            <ListSkeleton view={view} />
          ) : filtered.length === 0 ? (
            <EmptyState search={search} onReset={() => { setActiveCat("all"); setSearch(""); }} />
          ) : view === "grid" ? (
            <div className="recent-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              columnGap: 40, rowGap: 0,
              borderBottom: "1px solid var(--color-border-2)"
            }}>
              {paged.map((p) => (
                <PostCard key={p.slug} post={p} onOpen={(pp) => onNav({ name: "post", slug: pp.slug })} />
              ))}
            </div>
          ) : (
            <IndexList posts={paged} onOpen={(pp) => onNav({ name: "post", slug: pp.slug })} />
          )}

          {/* Pagination footer */}
          {!loading && filtered.length > 0 && (
            <div style={{
              marginTop: 48, paddingTop: 24,
              borderTop: "1px solid var(--color-border-2)",
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
            }}>
              <div className="mono-label tabular" style={{ display: "flex", gap: 14, color: "var(--color-text-3)" }}>
                <span>SHOWING {String(paged.length).padStart(3,"0")} / {String(filtered.length).padStart(3,"0")}</span>
                {hasMore && <span>· PAGE {String(page).padStart(2, "0")} / {String(Math.ceil(filtered.length / perPage)).padStart(2, "0")}</span>}
              </div>
              {hasMore ? (
                <button className="btn btn-primary" onClick={() => setPage(p => p + 1)}>
                  <span>Load more</span>
                  <span style={{ opacity: .6 }}>+{Math.min(perPage, filtered.length - paged.length)}</span>
                </button>
              ) : (
                <div className="mono-label" style={{ color: "var(--color-text-3)" }}>— END OF INDEX —</div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function IndexList({ posts, onOpen }) {
  // group by year
  const groups = useMemo(() => {
    const g = {};
    for (const p of posts) {
      const y = new Date(p.date).getFullYear();
      (g[y] = g[y] || []).push(p);
    }
    return Object.entries(g).sort((a, b) => +b[0] - +a[0]);
  }, [posts]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      {groups.map(([y, ps]) => (
        <div key={y} className="yr-row" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 40, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 168 }}>
            <div className="display display-h2" style={{ fontSize: 60, lineHeight: 1, margin: 0 }}>{y}</div>
            <div className="mono-label" style={{ marginTop: 10 }}>{String(ps.length).padStart(2,"0")} essays</div>
          </div>
          <div>
            {ps.map(p => (
              <PostCard key={p.slug} post={p} onOpen={onOpen} variant="row" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ search, onReset }) {
  return (
    <div style={{
      padding: "80px 40px", textAlign: "center",
      border: "1px dashed var(--color-border-2)",
      display: "flex", flexDirection: "column", gap: 18, alignItems: "center"
    }}>
      <pre style={{
        margin: 0, fontFamily: "var(--font-mono)", color: "var(--color-text-3)",
        fontSize: 11, lineHeight: 1.3
      }}>{`╭─────────────────╮
│   404 in scope  │
│   not the page  │
╰─────────────────╯`}</pre>
      <h2 className="display display-h3" style={{ margin: 0 }}>해당 조건의 글이 없어요</h2>
      <p className="small" style={{ maxWidth: 420 }}>
        {search ? <>“<span style={{ color: "var(--color-text)" }}>{search}</span>”</> : "이 카테고리"}에 해당하는 글이 아직 없습니다. 카테고리·검색어를 바꿔보거나 전체 글로 돌아가 보세요.
      </p>
      <button className="btn btn-primary" onClick={onReset}>
        <span>Reset filters</span><span style={{ opacity: .6 }}>↺</span>
      </button>
    </div>
  );
}

function ListSkeleton({ view }) {
  if (view === "grid") {
    return (
      <div className="recent-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        columnGap: 40, rowGap: 0,
        borderBottom: "1px solid var(--color-border-2)"
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            borderTop: "1px solid var(--color-border-2)",
            padding: "24px 0",
            display: "flex", flexDirection: "column", gap: 12
          }}>
            <div className="skel" style={{ height: 18, width: 72 }} />
            <div className="skel" style={{ height: 26, width: "92%" }} />
            <div className="skel" style={{ height: 14, width: "80%" }} />
            <div className="skel" style={{ height: 14, width: "65%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <div className="skel" style={{ height: 12, width: 90 }} />
              <div className="skel" style={{ height: 12, width: 30 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      <div className="yr-row" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 40, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="skel" style={{ height: 60, width: 100 }} />
          <div className="skel" style={{ height: 12, width: 80 }} />
        </div>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "92px 1fr auto",
              alignItems: "center",
              gap: 24, padding: "18px 12px",
              borderTop: "1px solid var(--color-border)"
            }}>
              <div className="skel" style={{ height: 12, width: 70 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="skel" style={{ height: 22, width: "85%" }} />
                <div className="skel" style={{ height: 12, width: 160 }} />
              </div>
              <div className="skel" style={{ height: 12, width: 12 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// BLOG DETAIL
// ──────────────────────────────────────────────────────────────
function BlogDetailPage({ slug, onNav }) {
  const posts = window.POSTS || [];
  const post = posts.find(p => p.slug === slug) || posts[0];
  const idx = posts.findIndex(p => p.slug === post.slug);
  const prev = posts[idx + 1];
  const next = posts[idx - 1];
  const articleRef = useRef(null);

  // scroll to top on post change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [slug]);

  return (
    <main ref={articleRef} style={{ position: "relative" }}>
      <ReadingProgress targetRef={articleRef} />

      {/* hero */}
      <section style={{ paddingTop: 56, paddingBottom: 24 }}>
        <div className="container-narrow">
          <button className="arrow-link" onClick={() => onNav({ name: "blog" })} style={{ marginBottom: 40, color: "var(--color-text-2)" }}>
            <span style={{ transform: "rotate(180deg)", display: "inline-block" }} className="arrow"></span>
            <span>Back to index</span>
          </button>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 26 }}>
            <CategoryBadge category={post.category} size="md" strong />
            <span className="mono-label tabular">PUBLISHED · {formatDate(post.date, { long: true })}</span>
            <span className="mono-label" style={{ color: "var(--color-text-3)" }}>·</span>
            <span className="mono-label tabular">{post.readMin} MIN READ</span>
          </div>
          <h1 className="display" style={{
            fontSize: "clamp(40px, 5.4vw, 78px)",
            margin: 0, lineHeight: 1.04, letterSpacing: "-.022em",
            color: "var(--color-text)",
            fontWeight: 380
          }}>
            {post.title}
          </h1>
          <p className="lede" style={{
            marginTop: 24, color: "var(--color-text-2)",
            maxWidth: 640
          }}>
            {post.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
            {post.tags.map(t => (
              <span key={t} className="badge" style={{ borderColor: "var(--color-border)" }}>
                #{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* cover */}
      {post.cover && (
        <section style={{ marginBottom: 56 }}>
          <div className="container-narrow">
            <div style={{
              aspectRatio: "16 / 8",
              border: "1px solid var(--color-border-2)",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
              background: `
                radial-gradient(900px 400px at 80% 0%, rgba(200,255,0,.14), transparent 60%),
                linear-gradient(180deg, var(--color-surface), var(--color-bg) 90%)`
            }}>
              {/* axis lines */}
              <svg viewBox="0 0 800 400" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <g stroke="rgba(255,255,255,.05)" strokeWidth="1">
                  {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="400" />)}
                  {Array.from({ length: 6 }).map((_, i) => <line key={i} x1="0" y1={i * 80} x2="800" y2={i * 80} />)}
                </g>
                <path d="M0,300 C150,260 200,180 320,200 C460,224 520,140 640,150 C720,156 760,128 800,120"
                      fill="none" stroke="#C8FF00" strokeWidth="2" opacity=".9" />
                <path d="M0,330 C200,310 280,260 400,240 C520,220 600,210 800,160"
                      fill="none" stroke="rgba(167,139,250,.6)" strokeWidth="1.5" strokeDasharray="2 4" />
              </svg>
              <div style={{ position: "absolute", inset: 0, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="mono-label">FIG 01 · build pipeline (before / after)</span>
                  <span className="mono-label tabular">23s ──→ 7.4s</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                  <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-3)", lineHeight: 1.3 }}>{`x-axis: route count
y-axis: build duration (s)
─── v2 (next 16, app router)
- - - v1 (pages router)`}</pre>
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(80px, 10vw, 160px)",
                    color: "rgba(237,237,239,.06)",
                    letterSpacing: "-.04em", lineHeight: .85
                  }}>16</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* body + TOC */}
      <section>
        <div className="container detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr min(720px, 100%) 1fr",
          gap: 56,
          alignItems: "start"
        }}>
          <aside style={{
            position: "sticky", top: 110, padding: "0 0 0 0",
            justifySelf: "end", width: "100%", maxWidth: 220,
            display: "block"
          }}>
            <TableOfContents blocks={post.body} />
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--color-border-2)" }}>
              <div className="toc-title">Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="link-mono link" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Copy link</button>
                <a className="link-mono link" href={`#mdx-${post.slug}`}>View MDX source</a>
                <a className="link-mono link" href={`#edit-${post.slug}`}>Edit on GitHub</a>
                <a className="link-mono link" href="#rss">Subscribe · RSS</a>
              </div>
            </div>
          </aside>

          <article>
            <MDXBody blocks={post.body} />

            {/* footnote / signature */}
            <div style={{
              marginTop: 80, paddingTop: 32,
              borderTop: "1px solid var(--color-border-2)",
              display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start"
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 999,
                background: "linear-gradient(135deg, #C8FF00, #FF8C42 60%, #A78BFA)",
                border: "1px solid var(--color-border-3)"
              }} />
              <div>
                <div className="mono-label" style={{ marginBottom: 6 }}>Written by</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, letterSpacing: "-.01em" }}>RicoCheese · 송민철</div>
                <p className="small" style={{ marginTop: 6, maxWidth: 520 }}>
                  서울에서 일하는 프론트엔드 엔지니어. 디자인 시스템, 빌드 파이프라인, 그리고 한국어 타이포그래피에 시간을 많이 씁니다.
                  의견이나 정정이 필요하면 <a className="link" href="#mail">hello@ricocheese.dev</a>으로 보내주세요.
                </p>
              </div>
            </div>
          </article>

          <aside />
        </div>
      </section>

      {/* prev/next */}
      <section style={{ marginTop: 96 }}>
        <div className="container-narrow">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {prev ? (
              <button onClick={() => onNav({ name: "post", slug: prev.slug })}
                style={{
                  textAlign: "left", padding: 24,
                  border: "1px solid var(--color-border-2)",
                  display: "flex", flexDirection: "column", gap: 8,
                  transition: "border-color .2s, background .2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-accent-line)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border-2)"; }}
              >
                <span className="mono-label" style={{ color: "var(--color-text-3)" }}>← OLDER</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, lineHeight: 1.2, color: "var(--color-text)" }}>{prev.title}</span>
                <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>{formatDate(prev.date)} · {prev.readMin} min</span>
              </button>
            ) : <div />}
            {next ? (
              <button onClick={() => onNav({ name: "post", slug: next.slug })}
                style={{
                  textAlign: "right", padding: 24,
                  border: "1px solid var(--color-border-2)",
                  display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end",
                  transition: "border-color .2s, background .2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-accent-line)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border-2)"; }}
              >
                <span className="mono-label" style={{ color: "var(--color-text-3)" }}>NEWER →</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, lineHeight: 1.2, color: "var(--color-text)" }}>{next.title}</span>
                <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>{formatDate(next.date)} · {next.readMin} min</span>
              </button>
            ) : <div />}
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { HomePage, BlogListPage, BlogDetailPage, SectionHead, Marquee });
