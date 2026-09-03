import { notFound } from "next/navigation";
import { format } from "date-fns";
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

  const date = format(new Date(post.date), "yyyy-MM-dd");

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

      {/* ── 3열 그리드: TOC 레일(264) · 본문(1fr, 최대 820) · 균형용 여백(200) ── */}
      <div className="detail-grid">
        {/* ── 좌측 레일 — 데스크톱 전용, 스크롤 고정 ── */}
        <aside className="detail-toc-rail">
          <div className="detail-toc-rail-inner">
            <Link href="/blog" className="detail-back-link">
              ← 목록으로
            </Link>
            <TableOfContents />
          </div>
        </aside>

        {/* ── 본문 컬럼 ── */}
        <div className="detail-article">
          {/* 히어로 — 메타 · 제목 · 리드 · 태그 · 커버 · 상단 광고 */}
          <div className="detail-hero">
            {/* 태블릿·모바일 전용 — 레일이 사라지므로 상단에 별도 노출 */}
            <Link href="/blog" className="detail-back-link detail-back-link--mobile">
              ← 목록으로
            </Link>

            <div className="detail-meta">
              <CategoryBadge category={post.category} size="md" />
              <span>{date}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}분</span>
            </div>

            <h1 className="detail-title">{post.title}</h1>

            {post.description && <p className="detail-lede">{post.description}</p>}

            {post.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="badge badge-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {post.cover && (
              <div className="detail-cover">
                <Image
                  src={post.cover}
                  alt={post.coverAlt ?? post.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}

            {/* 태블릿·모바일 전용 — 좌측 레일이 사라지므로 본문 위 접힌 블록으로 노출 */}
            <div className="detail-toc-inline">
              <TableOfContents />
            </div>

            {adSlotTop && <AdUnit slot={adSlotTop} />}
          </div>

          {/* 본문 흐름 — prose · 하단 광고 · 이전/다음 · 댓글 (같은 26px 리듬 공유) */}
          <div className="detail-flow">
            <MDXContent source={post.content} />

            {adSlotBottom && <AdUnit slot={adSlotBottom} />}

            <PrevNextCards prev={prev} next={next} />

            <div className="detail-comments">
              <div className="detail-comments-head">
                <span className="detail-comments-title">댓글</span>
                <span className="detail-comments-badge">GitHub Discussions</span>
              </div>
              <GiscusComments />
            </div>
          </div>
        </div>

        {/* ── 우측 여백 — 그리드 균형용, 좌측 hairline만 ── */}
        <aside className="detail-spacer" aria-hidden="true" />
      </div>
    </>
  );
}
