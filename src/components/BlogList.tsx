"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostCard } from "./PostCard";
import { BlogIndexList } from "./BlogIndexList";
import { EmptyResults } from "./EmptyResults";
import type { PostMeta, Category } from "@/types/post";
import { CAT_ORDER } from "@/lib/constants";

const ALL = "all" as const;
const PAGE_SIZE = 6;
type SortKey = "new" | "long" | "short";
type ViewKey = "grid" | "index";

interface Props {
  posts: PostMeta[];
}

export function BlogList({ posts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL (single source of truth)
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const rawCat = searchParams.get("category") ?? ALL;
  const activeCat: "all" | Category = (
    CAT_ORDER.some((c) => c.id === rawCat) ? rawCat : ALL
  ) as "all" | Category;
  const search = searchParams.get("q") ?? "";
  const rawSort = searchParams.get("sort") ?? "new";
  const sort: SortKey = (["new", "long", "short"].includes(rawSort) ? rawSort : "new") as SortKey;
  const rawView = searchParams.get("view") ?? "grid";
  const view: ViewKey = (["grid", "index"].includes(rawView) ? rawView : "grid") as ViewKey;

  // Local input state to avoid re-render interrupting Korean IME composition
  const [localSearch, setLocalSearch] = useState(search);
  const composingRef = useRef(false);

  // Sync local state when URL param changes externally (e.g. reset button)
  useEffect(() => {
    if (!composingRef.current) {
      setLocalSearch(search);
    }
  }, [search]);

  /** Push a partial URL update, omitting keys whose value is the default */
  const pushParams = useCallback(
    (patch: Partial<{ category: string; q: string; sort: string; view: string; page: number }>) => {
      const next = new URLSearchParams(searchParams.toString());

      const merged = {
        category: activeCat,
        q: search,
        sort,
        view,
        page: 1, // default: filter changes reset to page 1
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
      if (merged.page && merged.page > 1) {
        next.set("page", String(merged.page));
      } else {
        next.delete("page");
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

  // Filtered + sorted posts, then paginated
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
      res.sort((a, b) => new Date(b.published_at ?? b.date).getTime() - new Date(a.published_at ?? a.date).getTime());
    }
    return res;
  }, [posts, activeCat, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.max(1, Math.min(isNaN(rawPage) ? 1 : rawPage, totalPages));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (!composingRef.current) {
                    pushParams({ q: e.target.value });
                  }
                }}
                onCompositionStart={() => { composingRef.current = true; }}
                onCompositionEnd={(e) => {
                  composingRef.current = false;
                  pushParams({ q: (e.target as HTMLInputElement).value });
                }}
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
            <BlogIndexList posts={paginated} />
          ) : (
            <div
              className="blog-card-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                columnGap: 40,
                rowGap: 0,
                borderBottom: "1px solid var(--color-border-2)",
              }}
            >
              {paginated.map((post) => (
                <PostCard key={post.slug} post={post} hairline />
              ))}
            </div>
          )
        ) : (
          <EmptyResults
            search={search}
            activeCat={activeCat}
            onReset={() => pushParams({ category: ALL, q: "", sort: "new" })}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <button
              type="button"
              className="pagination-btn"
              disabled={page <= 1}
              onClick={() => pushParams({ page: page - 1 })}
              aria-label="이전 페이지"
            >
              ← PREV
            </button>
            <span className="pagination-indicator mono-label tabular">
              PAGE {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="pagination-btn"
              disabled={page >= totalPages}
              onClick={() => pushParams({ page: page + 1 })}
              aria-label="다음 페이지"
            >
              NEXT →
            </button>
          </div>
        )}

        {/* End marker: last page OR single page with at least one post */}
        {page >= totalPages && filtered.length > 0 && (
          <div className="end-marker mono-label">— END OF INDEX —</div>
        )}
      </div>
    </>
  );
}
