import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug, getAllPosts, CATEGORY_LABELS } from "@/lib/posts";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { MDXContent } from "@/components/MDXContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prev = allPosts[idx + 1] ?? null;
  const next = allPosts[idx - 1] ?? null;

  const date = format(new Date(post.date), "yyyy년 M월 d일", { locale: ko });

  return (
    <>
      <ReadingProgress />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-32">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-3 hover:text-accent transition-colors mb-12"
        >
          ← 목록으로
        </Link>

        <div className="flex gap-16">
          {/* ── Main content ── */}
          <article className="flex-1 min-w-0 max-w-2xl">
            {/* Post header */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <CategoryBadge category={post.category} />
                <span className="text-xs font-mono text-text-3">
                  {CATEGORY_LABELS[post.category]}
                </span>
              </div>

              <h1 className="font-serif font-black text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-text mb-6">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-lg text-text-2 leading-relaxed mb-8">
                  {post.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-8 border-b border-border">
                <time className="text-sm font-mono text-text-3">{date}</time>
                <span className="text-text-3">·</span>
                <span className="text-sm font-mono text-text-3">{post.readingTime}분 읽기</span>

                {post.tags.length > 0 && (
                  <>
                    <span className="text-text-3">·</span>
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono text-text-3 bg-surface-2 border border-border px-2 py-0.5 rounded-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* MDX Content */}
            <MDXContent source={post.content} />

            {/* Post footer */}
            <div className="mt-16 pt-8 border-t border-border">
              <nav className="grid grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="group block bg-surface border border-border rounded-sm p-5 hover:border-border-2 transition-colors"
                  >
                    <span className="text-[10px] font-mono text-text-3 uppercase tracking-widest block mb-2">← 이전 글</span>
                    <span className="text-sm font-serif font-bold text-text-2 group-hover:text-text transition-colors line-clamp-2">
                      {prev.title}
                    </span>
                  </Link>
                ) : <div />}

                {next ? (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="group block bg-surface border border-border rounded-sm p-5 hover:border-border-2 transition-colors text-right"
                  >
                    <span className="text-[10px] font-mono text-text-3 uppercase tracking-widest block mb-2">다음 글 →</span>
                    <span className="text-sm font-serif font-bold text-text-2 group-hover:text-text transition-colors line-clamp-2">
                      {next.title}
                    </span>
                  </Link>
                ) : <div />}
              </nav>
            </div>
          </article>

          {/* ── TOC sidebar ── */}
          <aside className="hidden xl:block w-56 shrink-0">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
