import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/types/post";
import { CATEGORY_LABELS, CATEGORY_COLOR_VAR } from "@/lib/constants";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

interface Props {
  post: PostMeta;
}

/**
 * 글 목록 Grid 뷰 카드 (아트보드 2a). 커버 158px(그레이스케일) · 카테고리·날짜 ·
 * 제목 · 설명 2줄 · 하단 hairline 메타 행(읽는 시간·대표 태그·이동 화살표).
 */
export function PostCard({ post }: Props) {
  const date = formatDate(post.published_at ?? post.date);

  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <span className="blog-card-cover">
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.coverAlt ?? post.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        ) : (
          <span className="blog-card-cover-fallback" aria-hidden="true" />
        )}
      </span>

      <span className="blog-card-meta">
        <span style={{ color: `var(${CATEGORY_COLOR_VAR[post.category]})` }}>
          {CATEGORY_LABELS[post.category]}
        </span>
        <span aria-hidden="true">·</span>
        <span>{date}</span>
      </span>

      <span className="blog-card-title">{post.title}</span>

      {post.description && <span className="blog-card-desc">{post.description}</span>}

      <span className="blog-card-footer">
        <span>
          {post.readingTime}분{post.tags[0] ? ` · #${post.tags[0]}` : ""}
        </span>
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
