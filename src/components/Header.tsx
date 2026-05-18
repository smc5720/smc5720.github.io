"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",       label: "Home" },
  { href: "/blog",   label: "Blog" },
  { href: "/about",  label: "About" },
  { href: "/system", label: "System" },
];

export function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLight, setIsLight]       = useState(false);
  const pathname = usePathname();

  /* ── scroll detection ── */
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close mobile menu on route change ── */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ── read theme from DOM on mount ── */
  useEffect(() => {
    setIsLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);

  function toggleTheme() {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("rico-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("rico-theme");
    }
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(7,7,10,.78)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--color-border)"
          : "1px solid transparent",
        transition: "background .25s, border-color .25s",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          height: 72,
        }}
      >
        {/* ── Left: logo block ── */}
        <Link
          href="/"
          aria-label="홈으로"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifySelf: "start",
            textDecoration: "none",
          }}
        >
          {/* icon box */}
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              position: "relative",
              border: "1px solid var(--color-border-3)",
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              background: "var(--color-surface)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-accent)",
                letterSpacing: 0,
                lineHeight: 1,
              }}
            >
              R
            </span>
            {/* accent dot — bottom-right */}
            <span
              style={{
                position: "absolute",
                right: -3,
                bottom: -3,
                width: 6,
                height: 6,
                background: "var(--color-accent)",
              }}
            />
          </span>

          {/* text block */}
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.1,
              gap: 2,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 17,
                letterSpacing: "-.01em",
                color: "var(--color-text)",
              }}
            >
              RicoCheese
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "var(--color-text-3)",
              }}
            >
              the studio log · v2.0
            </span>
          </span>
        </Link>

        {/* ── Centre: pill nav (hidden on mobile) ── */}
        <nav
          className="hdr-pill-nav"
          aria-label="주요 메뉴"
          style={{
            display: "flex",
            gap: 4,
            justifySelf: "center",
            padding: 4,
            border: "1px solid var(--color-border)",
            borderRadius: 2,
            background: "rgba(14,14,20,.6)",
          }}
        >
          {NAV.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="hdr-nav-item"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  padding: "8px 14px",
                  borderRadius: 2,
                  color: active
                    ? "var(--color-text)"
                    : "var(--color-text-2)",
                  background: active
                    ? "rgba(255,255,255,.04)"
                    : "transparent",
                  transition: "color .15s, background .15s",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: cluster ── */}
        <div
          style={{
            justifySelf: "end",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Live · KR status (hidden on mobile) */}
          <span
            className="mono-label hdr-live-meta"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--color-accent)",
                boxShadow: "0 0 8px var(--color-accent)",
                flexShrink: 0,
              }}
            />
            <span>Live · KR</span>
          </span>

          {/* Read posts button (hidden on mobile via hamburger presence) */}
          <Link
            href="/blog"
            className="btn hdr-read-btn"
            style={{ height: 36, padding: "0 14px" }}
            aria-label="블로그 글 읽기"
          >
            <span>Read posts</span>
            <span
              style={{ fontFamily: "var(--font-mono)", opacity: 0.6 }}
              aria-hidden="true"
            >
              →
            </span>
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isLight ? "다크 모드로 전환" : "라이트 모드로 전환"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-3)",
              borderRadius: 2,
            }}
          >
            {isLight ? (
              /* Sun — shown in light mode */
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Moon — shown in dark mode */
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="hdr-hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileOpen}
            style={{
              flexDirection: "column",
              gap: 6,
              padding: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                display: "block",
                height: 1,
                width: 20,
                background: "var(--color-text-2)",
                transition: "transform .2s, opacity .2s",
                transform: mobileOpen ? "rotate(45deg) translateY(5px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                height: 1,
                width: 20,
                background: "var(--color-text-2)",
                transition: "opacity .2s",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                height: 1,
                width: 20,
                background: "var(--color-text-2)",
                transition: "transform .2s, opacity .2s",
                transform: mobileOpen ? "rotate(-45deg) translateY(-5px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div
          style={{
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
            padding: "24px 0",
          }}
        >
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {NAV.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: active ? "var(--color-accent)" : "var(--color-text-2)",
                    textDecoration: "none",
                    transition: "color .15s",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
