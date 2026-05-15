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
      <section className="relative min-h-screen flex items-center bg-grid overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 60%, rgba(200,255,0,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 30%, rgba(77,158,255,0.03) 0%, transparent 50%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24 w-full">
          <div className="max-w-4xl">
            <div className="animate-fade-up flex items-center gap-3 mb-10">
              <span className="inline-block w-8 h-px bg-accent" />
              <span className="font-mono text-xs tracking-[0.25em] text-text-3 uppercase">
                Est. 2024
              </span>
            </div>

            <h1 className="font-serif font-black leading-none tracking-tight">
              <span className="animate-fade-up delay-1 block text-[clamp(4rem,12vw,9rem)] text-text">
                Rico
              </span>
              <span
                className="animate-fade-up delay-2 block text-[clamp(4rem,12vw,9rem)]"
                style={{
                  background: "linear-gradient(100deg, #C8FF00 0%, rgba(200,255,0,0.5) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Cheese.
              </span>
            </h1>

            <p className="animate-fade-up delay-3 mt-8 text-lg text-text-2 max-w-xl leading-relaxed">
              개발 이야기, 기술 뉴스, 회고, 그리고 만들어가는 것들을 기록합니다.
            </p>

            <div className="animate-fade-up delay-4 mt-10 flex items-center gap-6">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-3 bg-accent text-bg font-bold text-sm px-6 py-3 rounded-sm hover:bg-white transition-colors duration-200"
              >
                글 보러가기
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
              <Link
                href="/about"
                className="text-sm text-text-3 hover:text-text transition-colors duration-200 font-medium"
              >
                소개 →
              </Link>
            </div>
          </div>

          <div className="absolute bottom-10 left-6 flex items-center gap-3 animate-fade-in delay-6">
            <div className="w-px h-10 bg-border-2" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-text-3 uppercase">Scroll</span>
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
