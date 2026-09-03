import Link from "next/link";
import type { PostMeta } from "@/types/post";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

interface Props {
  post: PostMeta;
}

/**
 * 404 "최근 글에서 찾아보기" 3열 카드 (아트보드 4b).
 * 상단 hairline + 날짜·읽는시간 메타 + 제목 + 설명. 배지 없음 — nf-grid-3 전용.
 */
export function PostCardCompact({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="nf-card">
      <span className="nf-card-meta">
        {formatDate(post.published_at ?? post.date)} · {post.readingTime}min
      </span>
      <span className="nf-card-title">{post.title}</span>
      {post.description && <span className="nf-card-desc">{post.description}</span>}
    </Link>
  );
}
