import type { Category } from "@/types/post";
import { CATEGORY_LABELS } from "@/lib/constants";

const CATEGORY_COLORS: Record<Category, string> = {
  news: "#4D9EFF",
  dev: "#C8FF00",
  retrospective: "#A78BFA",
  release: "#FF4060",
  etc: "#8A8A9A",
};

interface Props {
  category: Category;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "md" }: Props) {
  const color = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium tracking-widest uppercase border rounded-sm ${
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-1"
      }`}
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}
