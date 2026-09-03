"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostCard } from "./PostCard";
import { BlogIndexList } from "./BlogIndexList";
import { EmptyResults } from "./EmptyResults";
import { IndexRailShell } from "@/components/IndexRailShell";
import type { PostMeta, Category } from "@/types/post";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/constants";

const ALL = "all" as const;
const PAGE_SIZE = 24;
const TAG_RAIL_LIMIT = 16;
type SortKey = "new" | "long" | "short";
type ViewKey = "grid" | "index";
type YearCount = { year: number; count: number };
type TagCount = { tag: string; count: number };

/** 페이지 번호를 오름차순 유니크 배열로 받아 연속 구간 사이에 "…"를 끼워 넣는다 */
function withEllipsis(sorted: number[]): (number | "…")[] {
  const out: (number | "…")[] = [];
  let last: number | undefined;
  for (const i of sorted) {
    if (last !== undefined) {
      if (i - last === 2) out.push(last + 1);
      else if (i - last > 2) out.push("…");
    }
    out.push(i);
    last = i;
  }
  return out;
}

/** 데스크톱·태블릿 — 첫/끝 페이지 + 현재 ±3 */
function widePageRange(current: number, total: number): number[] {
  const delta = 3;
  const set = new Set<number>();
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) set.add(i);
  }
  return [...set].sort((a, b) => a - b);
}

/** 모바일 — 현재 ±1 + 마지막만 */
function compactPageRange(current: number, total: number): number[] {
  const set = new Set<number>([Math.max(1, current - 1), current, Math.min(total, current + 1), total]);
  return [...set].sort((a, b) => a - b);
}

interface Props {
  posts: PostMeta[];
  years: YearCount[];
  tags: TagCount[];
}

export function BlogList({ posts, years, tags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Read state from URL (single source of truth) ──
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const rawCat = searchParams.get("category") ?? ALL;
  const activeCat: "all" | Category = (
    (CATEGORY_ORDER as string[]).includes(rawCat) ? rawCat : ALL
  ) as "all" | Category;
  const activeTag = searchParams.get("tag") ?? "";
  const rawYear = searchParams.get("year") ?? "";
  const activeYear = /^\d{4}$/.test(rawYear) ? rawYear : "";
  const search = searchParams.get("q") ?? "";
  const rawSort = searchParams.get("sort") ?? "new";
  const sort: SortKey = (["new", "long", "short"].includes(rawSort) ? rawSort : "new") as SortKey;
  const rawView = searchParams.get("view") ?? "grid";
  const view: ViewKey = (["grid", "index"].includes(rawView) ? rawView : "grid") as ViewKey;

  const hasFilter = activeCat !== ALL || !!activeTag || !!activeYear || !!search;

  // Local input state to avoid re-render interrupting Korean IME composition
  const [localSearch, setLocalSearch] = useState(search);
  const composingRef = useRef(false);

  // Sync local state when URL param changes externally (e.g. reset button)
  useEffect(() => {
    if (!composingRef.current) {
      setLocalSearch(search);
    }
  }, [search]);

  // 태블릿 — "태그 · 연도 필터" 토글로 펼치는 전체 레일 시트
  const [tabletSheetOpen, setTabletSheetOpen] = useState(false);

  /** Push a partial URL update, omitting keys whose value is the default */
  const pushParams = useCallback(
    (
      patch: Partial<{
        category: string;
        tag: string;
        year: string;
        q: string;
        sort: string;
        view: string;
        page: number;
      }>
    ) => {
      const next = new URLSearchParams(searchParams.toString());

      const merged = {
        category: activeCat,
        tag: activeTag,
        year: activeYear,
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
      if (merged.tag) {
        next.set("tag", merged.tag);
      } else {
        next.delete("tag");
      }
      if (merged.year) {
        next.set("year", merged.year);
      } else {
        next.delete("year");
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
    [router, searchParams, activeCat, activeTag, activeYear, search, sort, view]
  );

  const resetAll = useCallback(
    () => pushParams({ category: ALL, tag: "", year: "", q: "", sort: "new" }),
    [pushParams]
  );
  const clearTagOnly = useCallback(() => pushParams({ tag: "" }), [pushParams]);

  // Counts per category — always from the full (unfiltered) set, for the rail
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: posts.length };
    for (const cat of CATEGORY_ORDER) {
      c[cat] = posts.filter((p) => p.category === cat).length;
    }
    return c;
  }, [posts]);

  const activeCategories = CATEGORY_ORDER.filter((c) => counts[c] > 0);
  const inactiveCategories = CATEGORY_ORDER.filter((c) => counts[c] === 0);
  const inactiveLabel = inactiveCategories.map((c) => CATEGORY_LABELS[c]).join(" · ");
  const inactiveCount = inactiveCategories.reduce((sum, c) => sum + counts[c], 0);

  // Tag rail — top N by frequency, with the active tag (if any) pinned first
  const topTags = tags.slice(0, TAG_RAIL_LIMIT);
  const activeTagEntry = activeTag ? tags.find((t) => t.tag === activeTag) : undefined;
  const otherTags = activeTag ? topTags.filter((t) => t.tag !== activeTag) : topTags;

  const activeFilterCount = (activeCat !== ALL ? 1 : 0) + (activeYear ? 1 : 0) + (activeTag ? 1 : 0);
  const mobileSummaryLabel =
    activeFilterCount > 0 ? `필터 · ${activeFilterCount}개 적용` : `필터 · 전체 ${posts.length}편`;

  // Filtered + sorted posts, then paginated
  const filtered = useMemo(() => {
    let res = posts;
    if (activeCat !== ALL) {
      res = res.filter((p) => p.category === activeCat);
    }
    if (activeYear) {
      const y = Number(activeYear);
      res = res.filter((p) => new Date(p.published_at ?? p.date).getFullYear() === y);
    }
    if (activeTag) {
      res = res.filter((p) => p.tags.includes(activeTag));
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
    res = [...res];
    if (sort === "long") {
      res.sort((a, b) => b.readingTime - a.readingTime);
    } else if (sort === "short") {
      res.sort((a, b) => a.readingTime - b.readingTime);
    } else {
      res.sort(
        (a, b) => new Date(b.published_at ?? b.date).getTime() - new Date(a.published_at ?? a.date).getTime()
      );
    }
    return res;
  }, [posts, activeCat, activeYear, activeTag, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.max(1, Math.min(isNaN(rawPage) ? 1 : rawPage, totalPages));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const widePages = useMemo(() => withEllipsis(widePageRange(page, totalPages)), [page, totalPages]);
  const compactPages = useMemo(() => withEllipsis(compactPageRange(page, totalPages)), [page, totalPages]);

  const filterFragments: string[] = [];
  if (activeCat !== ALL) filterFragments.push(`카테고리 ${CATEGORY_LABELS[activeCat]}`);
  if (activeYear) filterFragments.push(`${activeYear}년`);
  if (activeTag) filterFragments.push(`태그 ${activeTag}`);
  if (search) filterFragments.push(`"${search}"`);

  // ── 필터 레일 본문(카테고리·연도·태그) — 데스크톱·태블릿 시트·모바일 시트에서 공유 ──
  const railBody = (
    <>
      <div className="idx-rail-block">
        <span className="idx-rail-label">카테고리</span>
        <div className="idx-rail-list">
          <button
            type="button"
            className={`idx-rail-row idx-rail-row--top${activeCat === ALL ? " idx-rail-row--active" : ""}`}
            onClick={() => pushParams({ category: ALL })}
          >
            <span>전체</span>
            <span className="idx-rail-row-count">{counts.all}</span>
          </button>
          {activeCategories.map((c) => (
            <button
              key={c}
              type="button"
              className={`idx-rail-row idx-rail-row--plain${activeCat === c ? " idx-rail-row--active" : ""}`}
              onClick={() => pushParams({ category: c })}
            >
              <span>{CATEGORY_LABELS[c]}</span>
              <span className="idx-rail-row-count">{counts[c]}</span>
            </button>
          ))}
          {inactiveCategories.length > 0 && (
            <div className="idx-rail-row--disabled">
              <span>{inactiveLabel}</span>
              <span>{inactiveCount}</span>
            </div>
          )}
        </div>
      </div>

      {years.length > 0 && (
        <div className="idx-rail-block">
          <span className="idx-rail-label">연도</span>
          <div className="idx-rail-list">
            {years.map((y) => (
              <button
                key={y.year}
                type="button"
                className={`idx-rail-row idx-rail-row--plain${
                  activeYear === String(y.year) ? " idx-rail-row--active" : ""
                }`}
                onClick={() => pushParams({ year: activeYear === String(y.year) ? "" : String(y.year) })}
              >
                <span>{y.year}</span>
                <span className="idx-rail-row-count">{y.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="idx-rail-block">
          <span className="idx-rail-label">태그</span>
          <div className="blog-tag-list">
            {activeTag && (
              <button type="button" className="tag-chip tag-chip--active" onClick={() => pushParams({ tag: "" })}>
                <span>#{activeTag}</span>
                <span className="tag-chip-count">{activeTagEntry?.count ?? 0}</span>
                <span aria-hidden="true">×</span>
              </button>
            )}
            {otherTags.map(({ tag, count }) => (
              <button key={tag} type="button" className="tag-chip" onClick={() => pushParams({ tag })}>
                <span>{tag}</span>
                <span className="tag-chip-count">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const tabletStrip = (
    <>
      <span className="idx-rail-tablet-total">전체 {counts.all}</span>
      <span className="idx-rail-tablet-sep" aria-hidden="true" />
      {years.slice(0, 3).map((y) => (
        <button
          key={y.year}
          type="button"
          className={`idx-rail-tablet-item${activeYear === String(y.year) ? " idx-rail-tablet-accent" : ""}`}
          onClick={() => pushParams({ year: activeYear === String(y.year) ? "" : String(y.year) })}
        >
          {y.year} {y.count}
        </button>
      ))}
      <span className="idx-rail-tablet-sep" aria-hidden="true" />
      <button
        type="button"
        className={`idx-rail-tablet-item${activeCat === ALL ? " idx-rail-tablet-accent" : ""}`}
        onClick={() => pushParams({ category: ALL })}
      >
        전체 {counts.all}
      </button>
      {activeCategories.map((c) => (
        <button
          key={c}
          type="button"
          className={`idx-rail-tablet-item${activeCat === c ? " idx-rail-tablet-accent" : ""}`}
          onClick={() => pushParams({ category: c })}
        >
          {CATEGORY_LABELS[c]} {counts[c]}
        </button>
      ))}
      {inactiveCategories.length > 0 && (
        <span className="idx-rail-tablet-disabled">
          {inactiveLabel} {inactiveCount}
        </span>
      )}
      {activeTag && (
        <>
          <span className="idx-rail-tablet-sep" aria-hidden="true" />
          <button
            type="button"
            className="idx-rail-tablet-item idx-rail-tablet-accent"
            onClick={() => pushParams({ tag: "" })}
          >
            #{activeTag} ×
          </button>
        </>
      )}
      <span className="idx-rail-tablet-sep" aria-hidden="true" />
      <button
        type="button"
        className="idx-rail-tablet-item"
        aria-expanded={tabletSheetOpen}
        onClick={() => setTabletSheetOpen((v) => !v)}
      >
        태그 · 연도 필터 {tabletSheetOpen ? "▴" : "▾"}
      </button>
    </>
  );

  return (
    <>
      {/* ── 필터 레일 — 데스크톱 세로 / 태블릿 수평 스트립 / 모바일 필터 시트 ──
          홈 색인 레일과 동일한 IndexRailShell을 공유한다(이슈 #111). ── */}
      <div className="blog-body">
        <IndexRailShell
          ariaLabel="필터"
          desktop={railBody}
          tabletStrip={tabletStrip}
          tabletExtra={tabletSheetOpen && <div className="idx-rail-tablet-sheet">{railBody}</div>}
          mobileSummary={mobileSummaryLabel}
          mobileBody={railBody}
        />

        <div className="blog-content">
          {/* ── Sticky controls bar ── */}
          <div className="blog-controls">
            <div className="frame blog-controls-inner">
              <div className="blog-search">
                <span className="blog-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  aria-label="글 검색"
                  placeholder="제목 · 설명 · 태그 검색"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    if (!composingRef.current) {
                      pushParams({ q: e.target.value });
                    }
                  }}
                  onCompositionStart={() => {
                    composingRef.current = true;
                  }}
                  onCompositionEnd={(e) => {
                    composingRef.current = false;
                    pushParams({ q: (e.target as HTMLInputElement).value });
                  }}
                />
                <span className="blog-search-hint" aria-hidden="true">/</span>
              </div>

              <div className="blog-seg" role="group" aria-label="정렬">
                {(
                  [
                    ["new", "최신순"],
                    ["long", "긴 글순"],
                    ["short", "짧은 글순"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <button key={key} type="button" aria-pressed={sort === key} onClick={() => pushParams({ sort: key })}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="blog-seg" role="group" aria-label="뷰 전환">
                {(
                  [
                    ["grid", "Grid"],
                    ["index", "Index"],
                  ] as [ViewKey, string][]
                ).map(([key, label]) => (
                  <button key={key} type="button" aria-pressed={view === key} onClick={() => pushParams({ view: key })}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results count row ── */}
          <div className="frame blog-count-row">
            <p className="blog-count-text">
              <strong>{filtered.length}</strong> / {posts.length}편
              {filterFragments.length > 0 && <> · {filterFragments.join(" · ")}</>}
            </p>
            {hasFilter && (
              <button type="button" className="blog-reset-btn" onClick={resetAll}>
                필터 초기화
              </button>
            )}
          </div>

          {/* ── Results ── */}
          <div className="frame blog-results">
            {filtered.length > 0 ? (
              view === "index" ? (
                <BlogIndexList posts={paginated} />
              ) : (
                <div className="blog-grid">
                  {paginated.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )
            ) : (
              <EmptyResults
                search={search}
                activeCat={activeCat}
                activeTag={activeTag}
                activeYear={activeYear}
                onReset={resetAll}
                onClearTag={clearTagOnly}
              />
            )}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="frame blog-pagination">
              <button
                type="button"
                className="blog-pagination-nav"
                disabled={page <= 1}
                onClick={() => pushParams({ page: page - 1 })}
                aria-label="이전 페이지"
              >
                ← 이전
              </button>

              <div className="blog-pagination-numbers blog-pagination-numbers--wide">
                {widePages.map((it, i) =>
                  it === "…" ? (
                    <span key={`w-${i}`} className="blog-pagination-ellipsis">…</span>
                  ) : (
                    <button
                      key={it}
                      type="button"
                      className="blog-pagination-num"
                      aria-current={it === page ? "page" : undefined}
                      disabled={it === page}
                      onClick={() => pushParams({ page: it })}
                    >
                      {it}
                    </button>
                  )
                )}
                <span className="blog-pagination-size">{PAGE_SIZE}편 / 페이지</span>
              </div>

              <div className="blog-pagination-numbers blog-pagination-numbers--compact">
                {compactPages.map((it, i) =>
                  it === "…" ? (
                    <span key={`c-${i}`} className="blog-pagination-ellipsis">…</span>
                  ) : (
                    <button
                      key={it}
                      type="button"
                      className="blog-pagination-num"
                      aria-current={it === page ? "page" : undefined}
                      disabled={it === page}
                      onClick={() => pushParams({ page: it })}
                    >
                      {it}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                className="blog-pagination-nav"
                disabled={page >= totalPages}
                onClick={() => pushParams({ page: page + 1 })}
                aria-label="다음 페이지"
              >
                다음 →
              </button>
            </div>
          )}

          {/* End marker: last page with at least one result */}
          {page >= totalPages && filtered.length > 0 && (
            <div className="frame">
              <div className="blog-end">
                <span className="blog-end-line" aria-hidden="true" />
                <span>목록 끝</span>
                <span className="blog-end-line" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
