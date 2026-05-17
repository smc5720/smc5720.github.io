import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { getAllPostSlugs, getPostBySlug, getAllPosts } from "@/lib/posts";
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

      {/* ── Hero header ── */}
      <section style={{ paddingTop: 56, paddingBottom: 24 }}>
        <div className="container-narrow">
          {/* Back link */}
          <Link
            href="/blog"
            className="arrow-link arrow-link-back"
            style={{ marginBottom: 40, color: "var(--color-text-2)", display: "inline-flex" }}
          >
            <span className="arrow" />
            <span>목록으로</span>
          </Link>

          {/* Meta strip */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 26, flexWrap: "wrap" }}>
            <CategoryBadge category={post.category} size="md" />
            <span className="mono-label tabular">
              PUBLISHED · {date}
            </span>
            <span className="mono-label" style={{ color: "var(--color-text-3)" }}>·</span>
            <span className="mono-label tabular">{post.readingTime} MIN READ</span>
          </div>

          {/* Title */}
          <h1
            className="display"
            style={{
              fontSize: "clamp(40px, 5.4vw, 78px)",
              lineHeight: 1.04,
              letterSpacing: "-.022em",
              fontWeight: 380,
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            {post.title}
          </h1>

          {/* Lede */}
          {post.description && (
            <p
              className="lede"
              style={{ marginTop: 24, color: "var(--color-text-2)", maxWidth: 640 }}
            >
              {post.description}
            </p>
          )}

          {/* Tag strip */}
          {post.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
              {post.tags.map((tag) => (
                <span key={tag} className="badge badge-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Cover image (conditional) ── */}
      {post.cover && (
        <section style={{ marginBottom: 56 }}>
          <div className="container-narrow">
            <div
              style={{
                aspectRatio: "16 / 8",
                border: "1px solid var(--color-border-2)",
                borderRadius: 2,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src={post.cover}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Body + TOC ── */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="flex gap-16">
          {/* ── Main content ── */}
          <article className="flex-1 min-w-0 max-w-2xl">
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
