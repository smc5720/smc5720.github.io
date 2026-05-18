"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/blog", label: "BLOG" },
  { href: "/about", label: "ABOUT" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 motion-reduce:transition-none ${
        scrolled
          ? "bg-bg/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300 motion-reduce:transition-none" />
          <span className="font-serif text-lg font-black tracking-tight text-text group-hover:text-accent transition-colors duration-200 motion-reduce:transition-none">
            RicoCheese
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-xs font-bold tracking-[0.15em] transition-colors duration-200 motion-reduce:transition-none ${
                  active ? "text-accent" : "text-text-3 hover:text-text"
                }`}
              >
                {label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle + mobile menu button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={isLight ? "다크 모드로 전환" : "라이트 모드로 전환"}
            className="p-2 text-text-3 hover:text-text transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-sm"
          >
            {isLight ? (
              /* Sun icon — shown in light mode */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon — shown in dark mode */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴"
          >
            <span
              className={`block h-px w-5 bg-text-2 transition-all duration-200 motion-reduce:transition-none ${mobileOpen ? "rotate-45 translate-y-2.5" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-text-2 transition-all duration-200 motion-reduce:transition-none ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-text-2 transition-all duration-200 motion-reduce:transition-none ${mobileOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-6 flex flex-col gap-5">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-bold tracking-[0.15em] text-text-2 hover:text-accent transition-colors motion-reduce:transition-none"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
