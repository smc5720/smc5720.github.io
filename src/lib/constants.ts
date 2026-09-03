import type { Category } from "@/types/post";

export const CATEGORY_LABELS: Record<Category, string> = {
  news: "뉴스",
  dev: "개발",
  retrospective: "회고",
  release: "릴리스",
  etc: "기타",
};

/** Display labels for chips (English, matching the v2 design bundle) */
export const CATEGORY_CHIP_LABELS: Record<Category, string> = {
  news: "News",
  dev: "Dev",
  retrospective: "Retrospective",
  release: "Release",
  etc: "Etc",
};

/** Ordered list of category IDs for the chip row (All first, then 5 categories) */
export const CAT_ORDER: Array<{ id: "all" | Category; label: string }> = [
  { id: "all", label: "All" },
  { id: "news", label: "News" },
  { id: "dev", label: "Dev" },
  { id: "retrospective", label: "Retrospective" },
  { id: "release", label: "Release" },
  { id: "etc", label: "Etc" },
];

/** 카테고리 표시 순서 — 뉴스·개발이 활성, 나머지는 현재 0편. 홈 레일·블로그 필터 레일 공용 */
export const CATEGORY_ORDER: Category[] = ["news", "dev", "retrospective", "release", "etc"];

/** 카테고리 → @theme 카테고리 색 토큰. "retrospective"는 토큰명이 "retro"로 줄어든다(5b 전재). */
export const CATEGORY_COLOR_VAR: Record<Category, string> = {
  news: "--color-cat-news",
  dev: "--color-cat-dev",
  retrospective: "--color-cat-retro",
  release: "--color-cat-release",
  etc: "--color-cat-etc",
};
