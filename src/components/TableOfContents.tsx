"use client";

import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

/* ── Headings store ──
   The prose is server-rendered, so the headings (and the ids rehype-slug gave
   them) are already in the DOM at hydration. Reading them through
   useSyncExternalStore instead of copying them into state from an effect keeps
   the snapshot referentially stable — getSnapshot must return the same array
   until the DOM actually changes, or React re-renders forever. */
const NO_HEADINGS: TocItem[] = [];

let headingCache: TocItem[] = NO_HEADINGS;
let headingCacheKey = "";

function subscribeHeadings(onStoreChange: () => void): () => void {
  const prose = document.querySelector(".prose");
  if (!prose) return () => {};
  const observer = new MutationObserver(onStoreChange);
  observer.observe(prose, { childList: true, subtree: true });
  return () => observer.disconnect();
}

function getHeadingsSnapshot(): TocItem[] {
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>(".prose h2, .prose h3")
  );

  const key = headings.map((h) => h.id).join("|");
  if (key !== headingCacheKey) {
    headingCacheKey = key;
    headingCache = headings.map((h) => ({
      id: h.id,
      text: h.textContent?.replace(/#$/, "").trim() ?? "",
      level: parseInt(h.tagName[1]),
    }));
  }
  return headingCache;
}

function getHeadingsServerSnapshot(): TocItem[] {
  return NO_HEADINGS;
}

export function TableOfContents() {
  const [active, setActive] = useState<string>("");

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );

  const items = useSyncExternalStore(
    subscribeHeadings,
    getHeadingsSnapshot,
    getHeadingsServerSnapshot
  );

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

  function scrollToHeading(e: MouseEvent, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  const list = (
    <ul className="toc-list">
      {numberedItems.map(({ id, text, level, num }) => {
        const isActive = active === id;
        const isH3 = level === 3;
        const className = ["toc-item", isH3 ? "h3" : "", isActive ? "active" : ""]
          .filter(Boolean)
          .join(" ");

        return (
          <li key={id}>
            <a
              href={`#${id}`}
              className={className}
              aria-current={isActive ? "location" : undefined}
              onClick={(e) => scrollToHeading(e, id)}
            >
              {num && <span className="num">{num}</span>}
              <span>{text}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* 데스크톱(≥901px) — 좌측 레일에 상시 노출 */}
      <nav className="toc-desktop" aria-label="목차">
        <div className="toc-title">목차</div>
        {list}
      </nav>

      {/* 태블릿·모바일(≤900px) — 본문 위 접힌 블록, 기본 닫힘 */}
      <details className="toc-collapse">
        <summary className="toc-collapse-summary">
          <span className="toc-collapse-summary-label">
            <span className="toc-title">목차</span>
            <span>{h2Count}개 절</span>
          </span>
          <span className="toc-collapse-toggle-closed" aria-hidden="true">
            펼치기 ▾
          </span>
          <span className="toc-collapse-toggle-open" aria-hidden="true">
            접기 ▴
          </span>
        </summary>
        <nav className="toc-collapse-body" aria-label="목차">
          {list}
        </nav>
      </details>
    </>
  );
}
