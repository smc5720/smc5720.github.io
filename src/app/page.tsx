import Link from "next/link";
import { getAllPosts, CATEGORY_LABELS } from "@/lib/posts";
import type { Category } from "@/types/post";
import { Marquee } from "@/components/Marquee";
import { SectionHead } from "@/components/SectionHead";
import { PostCardFeatured } from "@/components/PostCardFeatured";
import { PostCardCompact } from "@/components/PostCardCompact";

// Canonical category order for the cat-grid (01~05)
const CAT_ORDER: Category[] = ["news", "dev", "retrospective", "release", "etc"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts[0] ?? null;
  const recent = posts.slice(1, 7);

  // Tag index: frequency descending, same-frequency alphabetical, top 16
  const tagFreq = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) {
      tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1);
    }
  }
  const topTags = [...tagFreq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 16);

  const updatedDate = posts[0] ? formatDate(posts[0].date) : "";
  const oldestDate =
    posts.length > 0 ? formatDate(posts[posts.length - 1].date) : "";

  const categoryCount = posts.reduce<Partial<Record<Category, number>>>(
    (acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }),
    {}
  );

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative bg-grid overflow-hidden"
        style={{ paddingTop: 48, paddingBottom: 80 }}
      >
        <div className="container relative">
          {/* ── Meta strip ── */}
          <div
            className="mono-label flex justify-between items-center flex-wrap"
            style={{ marginBottom: 56, gap: 12 }}
          >
            {/* left: RICOCHEESE / STUDIO LOG / EST. 2022 */}
            <div className="flex items-center flex-wrap" style={{ gap: 14 }}>
              <span>RICOCHEESE / STUDIO LOG</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span style={{ color: "var(--color-text-3)" }}>EST. 2022</span>
            </div>

            {/* right: NOW PLAYING — only when there is at least one post */}
            {featured && (
              <div
                className="mono-label tabular flex items-center"
                style={{ gap: 10, maxWidth: 360, overflow: "hidden" }}
              >
                <span style={{ whiteSpace: "nowrap" }}>NOW PLAYING</span>
                <span
                  style={{
                    color: "var(--color-accent)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  ●{" "}
                  {featured.title.length > 24
                    ? featured.title.slice(0, 24) + "…"
                    : featured.title}
                </span>
              </div>
            )}
          </div>

          {/* ── 2-col hero grid ── */}
          <div
            className="hero-grid animate-fade-up"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 80,
              alignItems: "end",
              marginBottom: 48,
            }}
          >
            {/* Left: giant serif title */}
            <div>
              <h1
                className="display display-hero"
                style={{ margin: 0, color: "var(--color-text)" }}
              >
                <span
                  style={{
                    fontStyle: "italic",
                    fontVariationSettings: '"opsz" 144, "SOFT" 100',
                  }}
                >
                  Rico
                </span>
                <br />
                Cheese
                <span
                  style={{
                    color: "var(--color-accent)",
                    display: "inline-block",
                    transform: "translateY(.1em)",
                  }}
                >
                  .
                </span>
              </h1>
            </div>

            {/* Right: ASCII + lede + CTA */}
            <div
              className="animate-fade-up delay-2"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignItems: "flex-end",
                paddingBottom: 18,
              }}
            >
              {/* ASCII art */}
              <pre
                aria-hidden="true"
                className="ascii-box"
                style={{
                  margin: 0,
                  fontSize: 10,
                  color: "var(--color-text-3)",
                  lineHeight: 1.3,
                  textAlign: "right",
                }}
              >{`         ╱╲    ╱╲
        ╱  ╲  ╱  ╲
       ╱    ╲╱    ╲
       ──── ✦ ────
       writing as
       making things`}</pre>

              {/* Lede copy */}
              <p
                className="lede"
                style={{
                  maxWidth: 380,
                  textAlign: "right",
                  color: "var(--color-text-2)",
                  margin: 0,
                }}
              >
                개발자 한 명이 쓰는 작업실 일지.
                <br />
                <span style={{ color: "var(--color-text)" }}>코드</span>,{" "}
                <span style={{ color: "var(--color-text)" }}>회고</span>,{" "}
                <span style={{ color: "var(--color-text)" }}>릴리스 노트</span>
                를 한 곳에 모읍니다 — 천천히, 그러나 꾸준히.
              </p>

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <Link href="/blog" className="btn btn-primary">
                  <span>글 보러가기</span>
                  <span style={{ opacity: 0.6 }}>→</span>
                </Link>
                <Link href="/about" className="btn btn-ghost">
                  소개
                </Link>
              </div>
            </div>
          </div>

          {/* ── Scroll indicator ── */}
          <div
            className="flex items-center gap-3 animate-fade-in delay-6"
            style={{ marginTop: 0 }}
          >
            <div className="w-px h-10 bg-border-2" />
            <span
              style={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.2em",
                color: "var(--color-text-3)",
                textTransform: "uppercase",
              }}
            >
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ── Category counter grid ── */}
      <section
        aria-label="카테고리별 글 수"
        style={{ maxWidth: "var(--container)", margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}
      >
        <nav className="cat-grid">
          {/* Total cell */}
          <Link href="/blog" className="cat-cell">
            <span className="mono-label" style={{ color: "var(--color-text-3)" }}>Total</span>
            <span className="cat-cell-count">
              {String(posts.length).padStart(2, "0")}
            </span>
            <span className="mono-label" style={{ color: "var(--color-text-3)" }}>essays · since 2022</span>
          </Link>

          {/* Per-category cells */}
          {CAT_ORDER.map((cat, i) => (
            <Link key={cat} href={`/blog?category=${cat}`} className="cat-cell">
              <span className="mono-label" style={{ color: "var(--color-text-3)" }}>
                {String(i + 1).padStart(2, "0")} · {CATEGORY_LABELS[cat]}
              </span>
              <span className="cat-cell-count">
                {String(categoryCount[cat] ?? 0).padStart(2, "0")}
                <span
                  className="cat-cell-dot"
                  aria-hidden="true"
                  style={{ background: `var(--cat-${cat})` }}
                />
              </span>
              <span className="mono-label" style={{ color: "var(--color-text-3)" }}>view filter →</span>
            </Link>
          ))}
        </nav>
      </section>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Featured ── */}
      {posts.length === 0 ? (
        <section style={{ marginTop: 64 }}>
          <div className="container">
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--color-text-3)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  marginBottom: 12,
                }}
              >
                아직 작성된 글이 없습니다.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.14em",
                }}
              >
                content/posts/ 에 .mdx 파일을 추가하세요
              </p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ── 01 Featured ── */}
          <section style={{ marginTop: 64 }}>
            <div className="container">
              <SectionHead
                num="01"
                kicker="Featured · this week"
                title="가장 최근의 긴 글"
                right={
                  <Link href="/blog" className="arrow-link">
                    <span>All posts</span>
                    <span className="arrow" />
                  </Link>
                }
              />
              {featured && (
                <PostCardFeatured
                  post={featured}
                  index={1}
                  total={posts.length}
                />
              )}
            </div>
          </section>

          {/* ── 02 Recent grid ── */}
          <section style={{ marginTop: 88 }}>
            <div className="container">
              <SectionHead
                num="02"
                kicker="Recently written"
                title="새 글 여섯 편"
                right={
                  <div
                    className="mono-label tabular"
                    style={{ display: "flex", gap: 18 }}
                  >
                    <span>UPDATED</span>
                    <span style={{ color: "var(--color-text)" }}>
                      {updatedDate}
                    </span>
                  </div>
                }
              />
              {recent.length > 0 && (
                <div className="recent-grid">
                  {recent.map((post) => (
                    <PostCardCompact key={post.slug} post={post} />
                  ))}
                </div>
              )}
              {/* bottom strip */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 36,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div
                  className="mono-label"
                  style={{ display: "flex", gap: 14 }}
                >
                  <span style={{ color: "var(--color-text-3)" }}>
                    Showing {Math.min(6, posts.length - 1)} of {posts.length}
                  </span>
                  {oldestDate && (
                    <>
                      <span style={{ color: "var(--color-text-3)" }}>·</span>
                      <span>oldest essay: {oldestDate}</span>
                    </>
                  )}
                </div>
                <Link href="/blog" className="btn">
                  <span>Read all {posts.length} essays</span>
                  <span style={{ opacity: 0.5 }}>→</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ── 03 Pull quote ── */}
          <section style={{ marginTop: 120 }}>
            <div className="container">
              <div className="pull-quote-grid">
                <div>
                  <div className="mono-label" style={{ marginBottom: 18 }}>
                    03 · A NOTE
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "var(--color-text-2)",
                    }}
                  >
                    매번 더 좋은 글을 쓰려다 보니, 매번 시작하지 못했습니다.
                    2026년부터는 다른 규칙으로 운영합니다.
                  </p>
                </div>
                <blockquote className="pull-quote">
                  <span style={{ color: "var(--color-accent)", marginRight: 6 }}>
                    &ldquo;
                  </span>
                  주 한 편. 길어도 좋고 짧아도 좋다.
                  <span style={{ color: "var(--color-text-2)" }}>
                    {" "}
                    빠지는 주는 메모로 대체.
                  </span>{" "}
                  초안은 한 번에 끝낸다 — 다듬기는 다음 날 30분
                  <span style={{ color: "var(--color-accent)" }}>.</span>
                </blockquote>
              </div>
            </div>
          </section>

          {/* ── 04 Tag index ── */}
          <section style={{ marginTop: 120, marginBottom: 96 }}>
            <div className="container">
              <SectionHead
                num="04"
                kicker="Tag index"
                title="자주 쓰는 주제들"
              />
              <div className="tag-index">
                {topTags.map(([tag, count]) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="chip"
                  >
                    <span style={{ color: "var(--color-text-2)" }}>
                      #{tag}
                    </span>
                    <span className="count">
                      {String(count).padStart(2, "0")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
