import Link from "next/link";
import { format } from "date-fns";
import type { PostMeta } from "@/types/post";

interface Props {
  prev: PostMeta | null;
  next: PostMeta | null;
}

export function PrevNextCards({ prev, next }: Props) {
  return (
    <div className="pnc-grid">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="pnc-card">
          <span className="pnc-label">← 이전 글</span>
          <span className="pnc-title">{prev.title}</span>
          <span className="pnc-meta">
            {format(new Date(prev.date), "yyyy-MM-dd")} · {prev.readingTime}분
          </span>
        </Link>
      ) : (
        <div className="pnc-placeholder" aria-hidden="true">
          이전 글 없음 (가장 오래된 글)
        </div>
      )}

      {next ? (
        <Link href={`/blog/${next.slug}`} className="pnc-card pnc-card--next">
          <span className="pnc-label">다음 글 →</span>
          <span className="pnc-title">{next.title}</span>
          <span className="pnc-meta">
            {format(new Date(next.date), "yyyy-MM-dd")} · {next.readingTime}분
          </span>
        </Link>
      ) : (
        <div className="pnc-placeholder" aria-hidden="true">
          다음 글 없음 (가장 최근 글)
        </div>
      )}
    </div>
  );
}
