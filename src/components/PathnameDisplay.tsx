"use client";

import { usePathname } from "next/navigation";

/**
 * Client component that displays the currently attempted URL.
 * Must be a separate Client Component because usePathname() cannot be
 * called directly in not-found.tsx (Server Component).
 */
export function PathnameDisplay() {
  const pathname = usePathname();

  if (!pathname) return null;

  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        padding: "12px 16px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-2)",
        color: "var(--color-text-2)",
        wordBreak: "break-all",
      }}
    >
      <span style={{ color: "var(--color-text-3)" }}>requested</span>
      {"  "}
      <span style={{ color: "var(--color-red)" }}>{pathname}</span>
    </div>
  );
}
