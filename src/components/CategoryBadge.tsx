import type { Category } from "@/types/post";
import { CATEGORY_LABELS, CATEGORY_COLOR_VAR } from "@/lib/constants";

interface Props {
  category: Category;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "md" }: Props) {
  const label = CATEGORY_LABELS[category];
  const cssVar = `var(${CATEGORY_COLOR_VAR[category]})`;

  return (
    <span
      className={`inline-flex items-center font-mono border ${
        size === "sm" ? "text-[11px] px-[6px] py-[2px]" : "text-[12px] px-[7px] py-[3px]"
      }`}
      style={{
        color: cssVar,
        borderColor: `color-mix(in oklab, ${cssVar} 40%, transparent)`,
        borderRadius: "var(--radius-xs)",
      }}
    >
      {label}
    </span>
  );
}
