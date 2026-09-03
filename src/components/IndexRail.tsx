import Link from "next/link";
import type { Category } from "@/types/post";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/constants";

interface YearCount {
  year: number;
  count: number;
}

interface Props {
  total: number;
  years: YearCount[];
  categoryCounts: Partial<Record<Category, number>>;
}

/**
 * 홈 색인 레일 — 전체 글 수 · 연도별 · 카테고리별 집계.
 * 데스크톱 좌측 세로 레일 / 태블릿 상단 수평 스트립 / 모바일 필터 시트(details·summary, JS 불필요)
 * 세 변형을 함께 렌더링하고 CSS 미디어쿼리로 하나만 노출한다(display:none인 변형은
 * 접근성 트리·탭 순서에서도 자동으로 빠진다).
 */
export function IndexRail({ total, years, categoryCounts }: Props) {
  const activeCategories = CATEGORY_ORDER.filter((c) => (categoryCounts[c] ?? 0) > 0);
  const inactiveCategories = CATEGORY_ORDER.filter((c) => (categoryCounts[c] ?? 0) === 0);
  const inactiveLabel = inactiveCategories.map((c) => CATEGORY_LABELS[c]).join(" · ");
  const inactiveCount = inactiveCategories.reduce((sum, c) => sum + (categoryCounts[c] ?? 0), 0);

  const body = (
    <>
      <div className="idx-rail-block">
        <span className="idx-rail-label">전체</span>
        <span className="idx-rail-total">{total}</span>
      </div>

      {years.length > 0 && (
        <div className="idx-rail-block">
          <span className="idx-rail-label">연도</span>
          <div className="idx-rail-list">
            {years.map((y, i) => (
              <Link
                key={y.year}
                href={`/blog?year=${y.year}`}
                className={i === 0 ? "idx-rail-row idx-rail-row--top" : "idx-rail-row"}
              >
                <span>{y.year}</span>
                <span className="idx-rail-row-count">{y.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="idx-rail-block">
        <span className="idx-rail-label">카테고리</span>
        <div className="idx-rail-list">
          {activeCategories.map((c) => (
            <Link key={c} href={`/blog?category=${c}`} className="idx-rail-row idx-rail-row--plain">
              <span>{CATEGORY_LABELS[c]}</span>
              <span className="idx-rail-row-count">{categoryCounts[c] ?? 0}</span>
            </Link>
          ))}
          {inactiveCategories.length > 0 && (
            <div className="idx-rail-row idx-rail-row--disabled">
              <span>{inactiveLabel}</span>
              <span>{inactiveCount}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const stripYears = years.slice(0, 3);

  return (
    <nav className="idx-rail" aria-label="색인">
      {/* 데스크톱 — 좌측 세로 레일 */}
      <div className="idx-rail-desktop">{body}</div>

      {/* 태블릿 834 — 상단 수평 스트립(가로 스크롤) */}
      <div className="idx-rail-tablet">
        <span className="idx-rail-tablet-total">전체 {total}</span>

        {stripYears.length > 0 && (
          <>
            <span className="idx-rail-tablet-sep" aria-hidden="true" />
            {stripYears.map((y, i) => (
              <Link key={y.year} href={`/blog?year=${y.year}`} className="idx-rail-tablet-item">
                {y.year}{" "}
                <span className={i === 0 ? "idx-rail-tablet-accent" : undefined}>{y.count}</span>
              </Link>
            ))}
          </>
        )}

        {activeCategories.length > 0 && (
          <>
            <span className="idx-rail-tablet-sep" aria-hidden="true" />
            {activeCategories.map((c) => (
              <Link key={c} href={`/blog?category=${c}`} className="idx-rail-tablet-item">
                {CATEGORY_LABELS[c]} {categoryCounts[c] ?? 0}
              </Link>
            ))}
          </>
        )}

        {inactiveCategories.length > 0 && (
          <span className="idx-rail-tablet-disabled">
            {inactiveLabel} {inactiveCount}
          </span>
        )}
      </div>

      {/* 모바일 390 — 필터 시트 버튼 */}
      <details className="idx-rail-mobile">
        <summary className="idx-rail-summary">
          <span>색인 · 전체 {total}</span>
          <span className="idx-rail-summary-icon" aria-hidden="true">⌄</span>
        </summary>
        <div className="idx-rail-mobile-body">{body}</div>
      </details>
    </nav>
  );
}
