import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { getAllPostSlugs, getPostBySlug, getPrevNextPosts } from "@/lib/posts";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { MDXContent } from "@/components/MDXContent";
import { PrevNextCards } from "@/components/PrevNextCards";
import { AdUnit } from "@/components/AdUnit";
import { GiscusComments } from "@/components/GiscusComments";

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

  const ogImages = post.cover
    ? [{ url: post.cover, alt: post.coverAlt ?? post.title }]
    : [{ url: '/opengraph-image.png', alt: "RicoCheese's Blog" }];

  const twitterImages = post.cover ? [post.cover] : ['/opengraph-image.png'];

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://smc5720.github.io/blog/${slug}`,
      images: ogImages,
      publishedTime: post.date,
      authors: ['RicoCheese'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: twitterImages,
    },
    alternates: {
      canonical: `https://smc5720.github.io/blog/${slug}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getPrevNextPosts(slug);

  const adSlotTop = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "";
  const adSlotBottom = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM ?? "";

  const date = format(new Date(post.date), "yyyy년 M월 d일", { locale: ko });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'RicoCheese' },
    image: post.cover ?? '/opengraph-image.png',
    url: `https://smc5720.github.io/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                aspectRatio: "16 / 9",
                border: "1px solid var(--color-border-2)",
                borderRadius: "var(--r-xs)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src={post.cover}
                alt={post.coverAlt ?? post.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Ad: top (below cover / above body) ── */}
      {adSlotTop && (
        <div className="container-narrow" style={{ marginBottom: 32 }}>
          <AdUnit slot={adSlotTop} />
        </div>
      )}

      {/* ── Body + TOC ── */}
      <section>
        <div className="container detail-grid">
          {/* ── TOC sidebar (left column) ── */}
          <aside className="toc-aside">
            <TableOfContents />
          </aside>

          {/* ── Main content (center column) ── */}
          <article className="prose-col">
            {/* MDX Content */}
            <MDXContent source={post.content} />
          </article>

          {/* ── Right spacer (third column balances the grid) ── */}
          <aside aria-hidden="true" />
        </div>
      </section>

      {/* ── Ad: bottom (below body / above prev-next) ── */}
      {adSlotBottom && (
        <div className="container-narrow" style={{ marginTop: 56 }}>
          <AdUnit slot={adSlotBottom} />
        </div>
      )}

      {/* ── Comments ── */}
      <section style={{ marginTop: 56 }}>
        <div className="container-narrow">
          <GiscusComments />
        </div>
      </section>

      {/* ── Prev / Next ── */}
      <section style={{ marginTop: 40, paddingBottom: 96 }}>
        <div className="container-narrow">
          <PrevNextCards prev={prev} next={next} />
        </div>
      </section>
    </>
  );
}
