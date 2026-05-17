"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import type { PostMeta } from "@/types/post";

interface Props {
  posts: PostMeta[];
}

function PostIndexRow({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="row">
      {/* col 1: date */}
      <span
        className="mono-label tabular"
        style={{ color: "var(--color-text-3)" }}
      >
        {format(new Date(post.date), "yyyy.MM.dd")}
      </span>

      {/* col 2: title + description */}
      <span>
        <span className="row-title">{post.title}</span>
        {post.description && (
          <span className="row-desc">{post.description}</span>
        )}
      </span>

      {/* col 3: reading time */}
      <span
        className="mono-label tabular"
        style={{ color: "var(--color-text-3)" }}
      >
        {post.readingTime}&nbsp;MIN
      </span>
    </Link>
  );
}

export function BlogIndexList({ posts }: Props) {
  const groups = useMemo(() => {
    const g: Record<string, PostMeta[]> = {};
    for (const p of posts) {
      const y = String(new Date(p.date).getFullYear());
      (g[y] = g[y] || []).push(p);
    }
    return Object.entries(g).sort((a, b) => +b[0] - +a[0]);
  }, [posts]);

  return (
    <div className="index-list">
      {groups.map(([year, ps]) => (
        <div className="yr-row" key={year}>
          {/* left sticky column */}
          <div className="yr-col">
            <div className="display display-h2 yr-num">{year}</div>
            <div
              className="mono-label"
              style={{ marginTop: "var(--s-3)" }}
            >
              {String(ps.length).padStart(2, "0")}&nbsp;essays
            </div>
          </div>

          {/* right: list of rows */}
          <div className="yr-rows">
            {ps.map((p) => (
              <PostIndexRow key={p.slug} post={p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
