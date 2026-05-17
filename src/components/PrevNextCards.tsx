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
          <span className="mono-label pnc-label">← OLDER</span>
          <span className="pnc-title">{prev.title}</span>
          <span className="mono-label tabular pnc-meta">
            {format(new Date(prev.date), "yyyy.MM.dd")} · {prev.readingTime} min
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link href={`/blog/${next.slug}`} className="pnc-card pnc-card--next">
          <span className="mono-label pnc-label">NEWER →</span>
          <span className="pnc-title">{next.title}</span>
          <span className="mono-label tabular pnc-meta">
            {format(new Date(next.date), "yyyy.MM.dd")} · {next.readingTime} min
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
