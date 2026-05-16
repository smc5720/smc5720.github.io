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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
          <span className="inline-block w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300" />
          <span className="font-serif text-lg font-black tracking-tight text-text group-hover:text-accent transition-colors duration-200">
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
                className={`relative text-xs font-bold tracking-[0.15em] transition-colors duration-200 ${
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

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="메뉴"
        >
          <span
            className={`block h-px w-5 bg-text-2 transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2.5" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-text-2 transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-text-2 transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
          />
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-6 flex flex-col gap-5">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-bold tracking-[0.15em] text-text-2 hover:text-accent transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
