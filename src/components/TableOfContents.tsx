"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".prose h2, .prose h3")
    );

    setItems(
      headings.map((h) => ({
        id: h.id,
        text: h.textContent?.replace(/#$/, "").trim() ?? "",
        level: parseInt(h.tagName[1]),
      }))
    );
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  // Build h2 counter map for numbering
  let h2Count = 0;
  const numberedItems = items.map((item) => {
    if (item.level === 2) {
      h2Count++;
      return { ...item, num: String(h2Count).padStart(2, "0") };
    }
    return { ...item, num: "" };
  });

  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="toc-title">On this page</div>
      <ul className="toc-list">
        {numberedItems.map(({ id, text, level, num }) => {
          const isActive = active === id;
          const isH3 = level === 3;
          const className = [
            "toc-item",
            isH3 ? "h3" : "",
            isActive ? "active" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={className}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start",
                  });
                }}
              >
                {num && <span className="num">{num}</span>}
                <span>{text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
