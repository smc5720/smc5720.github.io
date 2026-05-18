import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { PostMeta } from "@/types/post";
import { CategoryBadge } from "./CategoryBadge";

interface Props {
  post: PostMeta;
  featured?: boolean;
  hairline?: boolean;
}

export function PostCard({ post, featured = false, hairline = false }: Props) {
  const date = format(new Date(post.date), "yyyy.MM.dd", { locale: ko });

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative block bg-surface border border-border rounded-lg p-8 md:p-10 overflow-hidden transition-all duration-300 motion-reduce:transition-none hover:border-border-2 hover:bg-surface-2"
      >
        {/* Accent glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 motion-reduce:transition-none pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 30% 50%, color-mix(in srgb, var(--color-accent) 4%, transparent), transparent)" }}
        />

        <div className="relative flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <CategoryBadge category={post.category} />
              <span className="text-xs font-mono text-text-3">FEATURED</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-text group-hover:text-accent transition-colors duration-200 motion-reduce:transition-none leading-tight mb-3">
              {post.title}
            </h2>
            {post.description && (
              <p className="text-text-2 text-base leading-relaxed line-clamp-2 mb-6">
                {post.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs font-mono text-text-3">
              <time>{date}</time>
              <span>·</span>
              <span>{post.readingTime}분 읽기</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-text-3 group-hover:text-accent transition-colors duration-200 motion-reduce:transition-none md:self-center">
            <span className="text-xs font-mono tracking-widest uppercase">Read</span>
            <span className="text-lg">→</span>
          </div>
        </div>
      </Link>
    );
  }

  if (hairline) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="card"
        style={{ display: "block", textDecoration: "none" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <CategoryBadge category={post.category} size="sm" />
          <time className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>{date}</time>
        </div>
        <h3 className="post-title">{post.title}</h3>
        {post.description && (
          <p
            className="post-desc"
            style={{
              WebkitLineClamp: 2,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.description}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
          <span className="mono-label" style={{ color: "var(--color-text-3)" }}>
            {post.readingTime}분 · {post.tags[0] ? `#${post.tags[0]}` : ""}
          </span>
          <span className="mono-label" style={{ color: "var(--color-text-3)" }} aria-hidden="true">→</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-surface border border-border rounded-lg p-6 transition-all duration-300 motion-reduce:transition-none hover:border-border-2 hover:bg-surface-2 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-0 group-hover:w-full h-px bg-accent transition-all duration-500 ease-out motion-reduce:transition-none" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <CategoryBadge category={post.category} size="sm" />
        <time className="text-xs font-mono text-text-3 shrink-0">{date}</time>
      </div>

      <h3 className="font-serif text-lg font-bold text-text group-hover:text-accent transition-colors duration-200 motion-reduce:transition-none leading-snug mb-2 line-clamp-2">
        {post.title}
      </h3>

      {post.description && (
        <p className="text-sm text-text-2 leading-relaxed line-clamp-2 mb-4">
          {post.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-text-3 bg-surface-2 border border-border px-1.5 py-0.5 rounded-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-xs font-mono text-text-3">{post.readingTime}분</span>
      </div>
    </Link>
  );
}
