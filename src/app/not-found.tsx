import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCardCompact } from "@/components/PostCardCompact";
import { PathnameDisplay } from "@/components/PathnameDisplay";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — 페이지를 찾을 수 없습니다",
  description: "요청한 페이지가 존재하지 않습니다.",
};

// Build hash: static export에는 런타임이 없어 고정 플레이스홀더로 둔다.
// 빌드 시점 값 주입은 이슈 #110 범위 밖.
const BUILD_HASH = "build 2026.09.03-a8e3f1";

export default function NotFound() {
  const allPosts = getAllPosts();
  const suggested = allPosts.slice(0, 3);

  return (
    <section style={{ paddingBottom: 40 }}>
      <div className="frame">
        {/* ── 상태 바 (아트보드 4b) ── */}
        <div className="nf-status">
          <div className="nf-status-left">
            <span className="nf-status-chip">ERROR</span>
            <span>라우트를 찾지 못했습니다</span>
            <span>404</span>
          </div>
          <div>{BUILD_HASH}</div>
        </div>

        {/* ── 2열 히어로: 좌측 대형 404, 우측 제목·리드·요청 경로·CTA ── */}
        <div className="nf-grid">
          <div>
            <p className="nf-number">404</p>
            <div className="nf-number-sub">HTTP 404 · NOT FOUND</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 560 }}>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.3, fontWeight: 700, letterSpacing: "-.03em", color: "var(--color-fg-strong)" }}>
              이 주소에는 글이 없습니다
              <span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>

            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "var(--color-fg-muted)" }}>
              주소가 바뀌었거나 글이 지워졌을 수 있습니다. 제목을 기억한다면 목록에서 검색하는
              편이 빠릅니다.
            </p>

            {/* Pathname display — Client Component (usePathname requires client) */}
            <PathnameDisplay />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/" className="btn btn-primary">
                홈으로
              </Link>
              <Link href="/blog" className="btn">
                전체 글 보기
              </Link>
            </div>
          </div>
        </div>

        {/* ── 추천 글 3편 ── */}
        {suggested.length > 0 && (
          <div style={{ borderTop: "1px solid var(--color-line)", paddingTop: 32 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-fg-muted)" }}>
                최근 글에서 찾아보기
              </div>
              <Link href="/blog" className="arrow-link">
                <span>전체 글</span>
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
