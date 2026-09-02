"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",      label: "Home" },
  { href: "/blog",  label: "Blog" },
  { href: "/about", label: "About" },
];

const MENU_LINKS = [
  { href: "/feed.xml",                label: "RSS",    external: false },
  { href: "https://github.com/smc5720", label: "GitHub", external: true },
  { href: "mailto:smc5720@gmail.com",  label: "Email",  external: false },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /* ── 스크롤 감지 — 배경만 --color-bg-sticky로 전환 ── */
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── 모바일 메뉴 ──
     불리언이 아니라 "메뉴를 연 경로"로 들고 있어서,
     라우트가 바뀌면 effect 없이 파생만으로 닫힌다. */
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const mobileOpen = menuPath === pathname;

  /* 하위 경로도 활성 판정 — /blog/xxx 에서도 Blog 활성 */
  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="hdr" data-scrolled={scrolled ? "true" : "false"}>
      <div className="frame hdr-inner">
        {/* ── 워드마크 + 태그라인 ── */}
        <Link href="/" className="hdr-mark" aria-label="홈으로">
          <span className="hdr-mark-name">RicoCheese</span>
          <span className="hdr-tagline">기술 뉴스와 기록</span>
        </Link>

        <div className="hdr-right">
          <nav className="hdr-nav" aria-label="주요 메뉴">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="hdr-nav-item"
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link href="/blog" className="hdr-cta">
            글 목록
          </Link>

          <button
            type="button"
            className="hdr-burger"
            onClick={() => setMenuPath((p) => (p === pathname ? null : pathname))}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <span className="hdr-burger-x" aria-hidden="true">×</span>
            ) : (
              <>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 모바일 메뉴 ── */}
      {mobileOpen && (
        <nav className="frame hdr-menu" aria-label="모바일 메뉴">
          {NAV.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="hdr-menu-item"
                aria-current={active ? "page" : undefined}
              >
                {label}
                {active && <span className="hdr-menu-dot" aria-hidden="true" />}
              </Link>
            );
          })}

          <Link href="/blog" className="hdr-menu-cta">
            글 목록
          </Link>

          <div className="hdr-menu-links">
            {MENU_LINKS.map(({ href, label, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
