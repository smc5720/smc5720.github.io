import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import { BlogList } from "@/components/BlogList";

export const metadata = {
  title: "Blog",
  description: "모든 글 목록",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main>
      {/* ── Header strip ── */}
      <section
        style={{
          paddingTop: "calc(64px + var(--s-8))", /* header offset + spacing */
          paddingBottom: "var(--s-10)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          {/* Breadcrumb + count */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--s-8)",
            }}
          >
            <nav
              aria-label="breadcrumb"
              className="mono-label"
              style={{ display: "flex", gap: "var(--s-3)", alignItems: "center" }}
            >
              <span style={{ color: "var(--color-text-3)" }}>RICOCHEESE</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span style={{ color: "var(--color-text)" }}>BLOG</span>
            </nav>
            <span
              className="mono-label tabular"
              style={{ color: "var(--color-text-3)" }}
            >
              {String(posts.length).padStart(3, "0")} essays
            </span>
          </div>

          {/* Title + lede */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "var(--s-16)",
              alignItems: "end",
            }}
            className="blog-hero-grid"
          >
            <h1
              className="display"
              style={{ margin: 0, fontSize: "clamp(48px,7vw,96px)" }}
            >
              The{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--color-text-2)",
                  fontVariationSettings: '"SOFT" 100',
                }}
              >
                Index
              </em>
              <span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
            <p
              className="lede"
              style={{ maxWidth: 460, color: "var(--color-text-2)" }}
            >
              다섯 가지 카테고리에 흩어진 글들. 검색하거나 카테고리로 좁혀
              읽어보세요.{" "}
              <span style={{ color: "var(--color-text)" }}>
                모든 글은 MDX 원문이 공개
              </span>
              됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── BlogList (controls + results) ── */}
      <Suspense
        fallback={
          <div
            className="container mono-label"
            style={{ paddingTop: "var(--s-8)", color: "var(--color-text-3)" }}
          >
            Loading...
          </div>
        }
      >
        <BlogList posts={posts} />
      </Suspense>
    </main>
  );
}
