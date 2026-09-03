"use client";

import { usePathname } from "next/navigation";

/**
 * 404 "요청 경로" 표시 — Client Component (usePathname은 not-found.tsx인
 * Server Component에서 직접 호출할 수 없다).
 */
export function PathnameDisplay() {
  const pathname = usePathname();

  if (!pathname) return null;

  return (
    <div className="nf-path">
      <span className="nf-path-label">요청 경로</span>
      <span className="nf-path-value">{pathname}</span>
    </div>
  );
}
