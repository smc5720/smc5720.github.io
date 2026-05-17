import Link from "next/link";
import type { PostMeta } from "@/types/post";
import { CategoryBadge } from "@/components/CategoryBadge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

interface Props {
  post: PostMeta;
}

export function PostCardCompact({ post }: Props) {
  const firstTag = post.tags[0] ?? "";

  return (
    <Link href={`/blog/${post.slug}`} className="card" style={{ textDecoration: "none", color: "inherit" }}>
      {/* top row: category badge + date */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <CategoryBadge category={post.category} size="sm" />
        <span
          className="mono-label tabular"
          style={{ color: "var(--color-text-3)" }}
        >
          {formatDate(post.date)}
        </span>
      </div>

      {/* title */}
      <h3 className="post-title">{post.title}</h3>

      {/* description */}
      <p
        className="post-desc"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {post.description}
      </p>

      {/* footer meta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 18,
        }}
      >
        <span
          className="mono-label"
          style={{ color: "var(--color-text-3)" }}
        >
          {post.readingTime} min
          {firstTag ? ` · #${firstTag}` : ""}
        </span>
        <span
          className="mono-label"
          style={{ color: "var(--color-text-3)" }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
