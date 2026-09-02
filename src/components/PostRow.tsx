import Link from "next/link";
import Image from "next/image";
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
 * 홈 "최근 글" 행 리스트 항목.
 * 날짜 / 썸네일 44px / 제목+설명 / 읽는 시간 — 4열.
 * 태블릿에서는 썸네일이 숨겨져 3열, 모바일에서는 날짜+읽는시간 / 제목 2행으로 접힌다.
 */
export function PostRow({ post }: Props) {
  const date = formatDate(post.published_at ?? post.date);

  return (
    <Link href={`/blog/${post.slug}`} className="post-row">
      <span className="post-row-date">{date}</span>
      <span className="post-row-thumb">
        {post.cover && (
          <Image
            src={post.cover}
            alt=""
            fill
            style={{ objectFit: "cover" }}
            sizes="44px"
          />
        )}
      </span>
      <span className="post-row-body">
        <span className="post-row-title">{post.title}</span>
        {post.description && <span className="post-row-desc">{post.description}</span>}
      </span>
      <span className="post-row-read">{post.readingTime}분</span>
    </Link>
  );
}
