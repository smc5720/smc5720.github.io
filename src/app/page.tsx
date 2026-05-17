import Link from "next/link";
import { getAllPosts, CATEGORY_LABELS } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Category } from "@/types/post";

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts[0] ?? null;
  const recent = posts.slice(1, 7);

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
        {/* radial gradient atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 600px at 80% -10%, rgba(200,255,0,0.04), transparent 60%), radial-gradient(900px 500px at -10% 20%, rgba(167,139,250,0.03), transparent 60%)",
          }}
        />

        <div
          className="relative w-full mx-auto px-8"
          style={{ maxWidth: "var(--container)" }}
        >
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
                style={{
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-text-3)",
                  lineHeight: 1.3,
                  textAlign: "right",
                  letterSpacing: 0,
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

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 pb-32">

        {Object.keys(categoryCount).length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono tracking-[0.2em] text-text-3 uppercase">카테고리</span>
              <span className="flex-1 h-px bg-border" />
            </div>
            <div className="flex flex-wrap gap-3">
              {(Object.entries(categoryCount) as [Category, number][]).map(([cat, count]) => (
                <Link
                  key={cat}
                  href={`/blog?category=${cat}`}
                  className="group flex items-center gap-2 bg-surface border border-border rounded-sm px-4 py-2.5 hover:border-border-2 transition-colors"
                >
                  <CategoryBadge category={cat} size="sm" />
                  <span className="text-xs font-mono text-text-3 group-hover:text-text-2 transition-colors">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {featured && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono tracking-[0.2em] text-text-3 uppercase">최신 글</span>
              <span className="flex-1 h-px bg-border" />
            </div>
            <PostCard post={featured} featured />
          </section>
        )}

        {recent.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono tracking-[0.2em] text-text-3 uppercase">최근 글</span>
              <span className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div className="text-center py-32">
            <p className="font-serif text-4xl font-bold text-text-3 mb-4">아직 작성된 글이 없습니다.</p>
            <p className="text-text-3 text-sm font-mono">content/posts/ 에 .mdx 파일을 추가하세요</p>
          </div>
        )}

        {posts.length > 0 && (
          <div className="flex justify-center">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 border border-border text-text-2 hover:text-text hover:border-border-2 font-medium text-sm px-8 py-3 rounded-sm transition-all duration-200"
            >
              전체 글 보기
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
