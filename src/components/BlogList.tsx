"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PostCard } from "./PostCard";
import { CategoryBadge } from "./CategoryBadge";
import type { PostMeta, Category } from "@/types/post";
import { CATEGORY_LABELS } from "@/lib/constants";

const ALL = "all";
type Filter = Category | typeof ALL;

interface Props {
  posts: PostMeta[];
}

export function BlogList({ posts }: Props) {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>(ALL);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && Object.keys(CATEGORY_LABELS).includes(cat)) {
      setFilter(cat as Category);
    }
  }, [searchParams]);

  const categories = [...new Set(posts.map((p) => p.category))] as Category[];

  const filtered = posts.filter((p) => {
    const matchCat = filter === ALL || p.category === filter;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Filters */}
      <div className="mb-10 space-y-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3 text-sm font-mono">
            ⌕
          </span>
          <input
            type="text"
            placeholder="글 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-sm pl-10 pr-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-border-2 transition-colors font-sans"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter(ALL)}
            className={`text-xs font-mono font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-sm border transition-all duration-150 ${
              filter === ALL
                ? "bg-accent text-bg border-accent"
                : "bg-surface text-text-3 border-border hover:border-border-2 hover:text-text-2"
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat === filter ? ALL : cat)}
              className={`inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-sm border transition-all duration-150 ${
                filter === cat
                  ? "bg-surface-2 border-border-2 text-text"
                  : "bg-surface text-text-3 border-border hover:border-border-2 hover:text-text-2"
              }`}
            >
              <CategoryBadge category={cat} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-mono text-text-3">
          {filtered.length}개의 글
          {filter !== ALL && (
            <span className="ml-2 text-text-2">in {CATEGORY_LABELS[filter as Category]}</span>
          )}
        </p>
        {(filter !== ALL || search) && (
          <button
            onClick={() => { setFilter(ALL); setSearch(""); }}
            className="text-xs font-mono text-text-3 hover:text-accent transition-colors"
          >
            초기화 ×
          </button>
        )}
      </div>

      {/* Post grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-serif text-3xl font-bold text-text-3 mb-3">검색 결과가 없습니다.</p>
          <p className="text-sm text-text-3 font-mono">다른 검색어나 카테고리를 시도해보세요.</p>
        </div>
      )}
    </>
  );
}
