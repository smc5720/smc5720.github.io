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

  return (
    <nav className="space-y-1">
      <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-text-3 uppercase mb-4">
        목차
      </p>
      {items.map(({ id, text, level }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`block text-xs leading-relaxed transition-colors duration-150 py-0.5 ${
            level === 3 ? "pl-3" : ""
          } ${
            active === id
              ? "text-accent font-medium"
              : "text-text-3 hover:text-text-2"
          }`}
        >
          {active === id && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-1.5 mb-0.5" />
          )}
          {text}
        </a>
      ))}
    </nav>
  );
}
