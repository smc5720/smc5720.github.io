"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostCard } from "./PostCard";
import { BlogIndexList } from "./BlogIndexList";
import type { PostMeta, Category } from "@/types/post";
import { CAT_ORDER } from "@/lib/constants";

const ALL = "all" as const;
type SortKey = "new" | "long" | "short";
type ViewKey = "grid" | "index";

interface Props {
  posts: PostMeta[];
}

export function BlogList({ posts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL (single source of truth)
  const rawCat = searchParams.get("category") ?? ALL;
  const activeCat: "all" | Category = (
    CAT_ORDER.some((c) => c.id === rawCat) ? rawCat : ALL
  ) as "all" | Category;
  const search = searchParams.get("q") ?? "";
  const rawSort = searchParams.get("sort") ?? "new";
  const sort: SortKey = (["new", "long", "short"].includes(rawSort) ? rawSort : "new") as SortKey;
  const rawView = searchParams.get("view") ?? "grid";
  const view: ViewKey = (["grid", "index"].includes(rawView) ? rawView : "grid") as ViewKey;

  /** Push a partial URL update, omitting keys whose value is the default */
  const pushParams = useCallback(
    (patch: Partial<{ category: string; q: string; sort: string; view: string }>) => {
      const next = new URLSearchParams(searchParams.toString());

      const merged = {
        category: activeCat,
        q: search,
        sort,
        view,
        ...patch,
      };

      // Only keep non-default values to keep URLs clean
      if (merged.category && merged.category !== ALL) {
        next.set("category", merged.category);
      } else {
        next.delete("category");
      }
      if (merged.q) {
        next.set("q", merged.q);
      } else {
        next.delete("q");
      }
      if (merged.sort && merged.sort !== "new") {
        next.set("sort", merged.sort);
      } else {
        next.delete("sort");
      }
      if (merged.view && merged.view !== "grid") {
        next.set("view", merged.view);
      } else {
        next.delete("view");
      }

      const qs = next.toString();
      router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    },
    [router, searchParams, activeCat, search, sort, view]
  );

  // Counts per category for chip labels
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: posts.length };
    for (const cat of CAT_ORDER) {
      if (cat.id !== ALL) {
        c[cat.id] = posts.filter((p) => p.category === cat.id).length;
      }
    }
    return c;
  }, [posts]);

  // Filtered + sorted posts
  const filtered = useMemo(() => {
    let res = [...posts];
    if (activeCat !== ALL) {
      res = res.filter((p) => p.category === activeCat);
    }
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q)
      );
    }
    if (sort === "long") {
      res.sort((a, b) => b.readingTime - a.readingTime);
    } else if (sort === "short") {
      res.sort((a, b) => a.readingTime - b.readingTime);
    } else {
      res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return res;
  }, [posts, activeCat, search, sort]);

  return (
    <>
      {/* ── Sticky controls bar ── */}
      <div className="controls-bar">
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "var(--s-4)",
            paddingBottom: "var(--s-4)",
            gap: "var(--s-4)",
          }}
        >
          {/* Category chips */}
          <div
            role="group"
            aria-label="카테고리 필터"
            style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}
          >
            {CAT_ORDER.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="chip"
                aria-pressed={activeCat === cat.id}
                onClick={() => pushParams({ category: cat.id })}
              >
                <span>{cat.label}</span>
                <span className="count">
                  {String(counts[cat.id] ?? 0).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>

          {/* Right-side controls: search · sort · view */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", flexWrap: "wrap" }}>
            {/* Search */}
            <div className="search-box">
              <span className="mono-label" style={{ color: "var(--color-text-3)" }} aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                aria-label="Search posts"
                placeholder="Search title, desc, tags…"
                value={search}
                onChange={(e) => pushParams({ q: e.target.value })}
              />
              <span className="mono-label" style={{ color: "var(--color-text-3)" }} aria-hidden="true">
                ⌘K
              </span>
            </div>

            {/* Sort segmented control */}
            <div
              className="seg-ctrl"
              role="group"
              aria-label="정렬"
            >
              {(
                [
                  ["new", "Newest"],
                  ["long", "Longest"],
                  ["short", "Shortest"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={sort === key}
                  onClick={() => pushParams({ sort: key })}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div
              className="seg-ctrl"
              role="group"
              aria-label="뷰 전환"
            >
              {(
                [
                  ["grid", "Grid"],
                  ["index", "Index"],
                ] as [ViewKey, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={view === key}
                  onClick={() => pushParams({ view: key })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results count row ── */}
      <div className="container" style={{ paddingTop: "var(--s-6)", paddingBottom: "var(--s-32)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--s-6)",
          }}
        >
          <p className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
            {String(filtered.length).padStart(3, "0")} / {String(posts.length).padStart(3, "0")} essays
          </p>
          {(activeCat !== ALL || search) && (
            <button
              type="button"
              className="mono-label"
              style={{ color: "var(--color-text-3)", cursor: "pointer", background: "none", border: 0, padding: 0 }}
              onClick={() => pushParams({ category: ALL, q: "", sort: "new" })}
            >
              초기화 ×
            </button>
          )}
        </div>

        {/* Post grid / index list */}
        {filtered.length > 0 ? (
          view === "index" ? (
            <BlogIndexList posts={filtered} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )
        ) : (
          <div style={{ textAlign: "center", padding: "var(--s-24) 0" }}>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(22px,2.8vw,32px)",
                color: "var(--color-text-3)",
                marginBottom: "var(--s-3)",
              }}
            >
              검색 결과가 없습니다.
            </p>
            <p className="mono-label" style={{ color: "var(--color-text-3)" }}>
              다른 검색어나 카테고리를 시도해보세요.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
