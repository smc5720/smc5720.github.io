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
