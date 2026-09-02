import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPostCountsByYear } from "@/lib/posts";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { Category } from "@/types/post";
import { IndexRail } from "@/components/IndexRail";
import { PostRow } from "@/components/PostRow";
import { TagIndex } from "@/components/TagIndex";

const RECENT_COUNT = 6;
const TAG_LIMIT = 16;

/** 카테고리 → @theme 카테고리 색 토큰. "retrospective"는 토큰명이 "retro"로 줄어든다(5b 전재). */
const CATEGORY_COLOR_VAR: Record<Category, string> = {
  news: "--color-cat-news",
  dev: "--color-cat-dev",
  retrospective: "--color-cat-retro",
  release: "--color-cat-release",
  etc: "--color-cat-etc",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts[0] ?? null;
  const recent = posts.slice(1, 1 + RECENT_COUNT);
  const years = getPostCountsByYear();

  const categoryCounts = posts.reduce<Partial<Record<Category, number>>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  const tagFreq = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1);
  }
  const topTags = [...tagFreq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TAG_LIMIT)
    .map(([tag, count]) => ({ tag, count }));

  return (
    <>
      {/* ── 히어로 ── */}
      <section className="home-hero">
        <div className="frame">
          <div className="home-hero-inner">
            <h1 className="home-hero-title">
              매일의 기술 뉴스를 모으고,
              <br />
              가끔 직접 쓴다.
            </h1>
            <p className="home-hero-lead">
              <span className="home-hero-em">인프라</span>와{" "}
              <span className="home-hero-em">오픈소스</span>, 그리고{" "}
              <span className="home-hero-em">개발 조직</span>에 관한 글을 남기는 개인
              블로그입니다.
            </p>
            <div className="home-hero-actions">
              <Link href="/blog" className="home-cta">
                글 보러가기
              </Link>
              <Link href="/about" className="home-cta-ghost">
                소개
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 레일 + 단일 열 ── */}
      <div className="home-body">
        <IndexRail total={posts.length} years={years} categoryCounts={categoryCounts} />

        <div className="home-column frame">
          {posts.length === 0 ? (
            <div className="home-empty">
              <p className="home-empty-title">아직 작성된 글이 없습니다.</p>
              <p className="home-empty-desc">content/posts/ 에 .mdx 파일을 추가하세요</p>
            </div>
          ) : (
            <>
              {/* ── 피처드 ── */}
              {featured && (
                <section aria-labelledby="home-featured-heading">
                  <div className="home-section-row" style={{ marginBottom: 16 }}>
                    <h2 id="home-featured-heading" className="home-section-label">
                      가장 최근 글
                    </h2>
                    <span className="home-meta-date">
                      {formatDate(featured.published_at ?? featured.date)}
                    </span>
                  </div>

                  <Link href={`/blog/${featured.slug}`} className="home-featured-card">
                    <div className="home-featured-meta">
                      <span style={{ color: `var(${CATEGORY_COLOR_VAR[featured.category]})` }}>
                        {CATEGORY_LABELS[featured.category]}
                      </span>
                      <span>·</span>
                      <span>{featured.readingTime}분</span>
                    </div>

                    <h3 className="home-featured-title">{featured.title}</h3>

                    {featured.description && (
                      <p className="home-featured-desc">{featured.description}</p>
                    )}

                    {featured.tags.length > 0 && (
                      <div className="home-featured-tags">
                        {featured.tags.slice(0, 3).map((t) => (
                          <span key={t} className="home-featured-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="home-featured-cover">
                      {featured.cover ? (
                        <Image
                          src={featured.cover}
                          alt={featured.coverAlt ?? featured.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 900px) 100vw, 300px"
                        />
                      ) : (
                        <div className="home-featured-cover-fallback">cover 16:9</div>
                      )}
                    </div>
                  </Link>
                </section>
              )}

              {/* ── 최근 글 ── */}
              {recent.length > 0 && (
                <section aria-labelledby="home-recent-heading">
                  <div className="home-section-row" style={{ paddingBottom: 14 }}>
                    <h2 id="home-recent-heading" className="home-section-label">
                      최근 글
                    </h2>
                    <span className="home-meta-date">
                      {posts.length}개 중 {recent.length}개
                    </span>
                  </div>

                  <div className="post-row-list">
                    {recent.map((post) => (
                      <PostRow key={post.slug} post={post} />
                    ))}
                  </div>

                  <div className="home-more-row">
                    <Link href="/blog" className="home-more-link">
                      전체 글 보기 →
                    </Link>
                  </div>
                </section>
              )}

              {/* ── 운영 원칙 ── */}
              <div className="home-principle">
                <div className="home-principle-label">운영 원칙</div>
                <p className="home-principle-text">
                  매일 수집되는 뉴스는 기록이고, 직접 쓴 글은 기준이다. 이 블로그는 그
                  둘을 같은 자리에 둔다.
                </p>
              </div>

              {/* ── 태그 인덱스 ── */}
              {topTags.length > 0 && (
                <section aria-labelledby="home-tags-heading">
                  <h2
                    id="home-tags-heading"
                    className="home-section-label"
                    style={{ marginBottom: 16 }}
                  >
                    태그
                  </h2>
                  <TagIndex tags={topTags} />
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
