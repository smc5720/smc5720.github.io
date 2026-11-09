import { Suspense } from "react";
import { getAllPosts, getPostCountsByYear, getTagCounts } from "@/lib/posts";
import { BlogList } from "@/components/BlogList";

export const metadata = {
  title: "Blog",
  description: "개발 기록과 기술 뉴스를 모아둔 글 목록",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const years = getPostCountsByYear();
  const tags = getTagCounts();

  return (
    <main>
      {/* ── Header strip (아트보드 2a) ── */}
      <section className="blog-head">
        <div className="frame">
          <div className="blog-head-inner">
            <div className="blog-head-top">
              <nav aria-label="breadcrumb" className="blog-crumb">
                <span>RicoCheese</span>
                <span aria-hidden="true">/</span>
                <span className="blog-crumb-current">BLOG</span>
              </nav>
              <span className="blog-crumb">{posts.length}편</span>
            </div>

            <h1 className="blog-head-title">글 목록</h1>
            <p className="blog-head-lede">
              기술 뉴스와 직접 작성한 글을 모아두었습니다. 태그와 연도로 필터링하거나 제목, 설명, 태그로
              검색할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── BlogList (필터 레일 + 컨트롤 + 결과 + 페이지네이션) ── */}
      <Suspense
        fallback={
          <div className="frame" style={{ paddingTop: 32, color: "var(--color-fg-faint)" }}>
            Loading...
          </div>
        }
      >
        <BlogList posts={posts} years={years} tags={tags} />
      </Suspense>
    </main>
  );
}
