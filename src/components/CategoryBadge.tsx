import type { Category } from "@/types/post";
import { CATEGORY_LABELS } from "@/lib/constants";

interface Props {
  category: Category;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "md" }: Props) {
  const label = CATEGORY_LABELS[category];
  const cssVar = `var(--cat-${category})`;

  return (
    <span
      className={`inline-flex items-center font-mono font-medium tracking-widest uppercase border rounded-sm ${
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-1"
      }`}
      style={{
        color: cssVar,
        borderColor: `color-mix(in srgb, ${cssVar} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${cssVar} 8%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}
