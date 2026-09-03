"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/types/post";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function IndexRow({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-index-row">
      <span className="blog-index-row-date">{formatDate(post.published_at ?? post.date)}</span>
      <span className="blog-index-row-body">
        <span className="blog-index-row-title">{post.title}</span>
        {post.description && <span className="blog-index-row-desc">{post.description}</span>}
      </span>
      <span className="blog-index-row-read">{post.readingTime}분</span>
    </Link>
  );
}

interface Props {
  posts: PostMeta[];
}

/** 글 목록 Index 뷰 (아트보드 2b) — 연도별 그룹, 좌 140px 연도 라벨 + 우 행 리스트. */
export function BlogIndexList({ posts }: Props) {
  const groups = useMemo(() => {
    const g = new Map<number, PostMeta[]>();
    for (const p of posts) {
      const year = new Date(p.published_at ?? p.date).getFullYear();
      (g.get(year) ?? g.set(year, []).get(year)!).push(p);
    }
    return [...g.entries()].sort((a, b) => b[0] - a[0]);
  }, [posts]);

  return (
    <div className="blog-index">
      {groups.map(([year, ps]) => (
        <div className="blog-index-group" key={year}>
          <div className="blog-index-year">
            <span className="blog-index-year-num">{year}</span>
            <span className="blog-index-year-count">{ps.length}편</span>
          </div>
          <div className="blog-index-rows">
            {ps.map((p) => (
              <IndexRow key={p.slug} post={p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
