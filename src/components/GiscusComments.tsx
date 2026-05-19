"use client";

import { useEffect, useState } from "react";
import Giscus from "@giscus/react";

const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}` | undefined;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

function resolveTheme(): "light" | "dark_dimmed" {
  if (typeof document === "undefined") return "dark_dimmed";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark_dimmed";
}

export function GiscusComments() {
  const [theme, setTheme] = useState<"light" | "dark_dimmed">("dark_dimmed");

  useEffect(() => {
    setTheme(resolveTheme());

    const observer = new MutationObserver(() => {
      setTheme(resolveTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  if (!REPO || !REPO_ID || !CATEGORY || !CATEGORY_ID) return null;

  return (
    <Giscus
      repo={REPO}
      repoId={REPO_ID}
      category={CATEGORY}
      categoryId={CATEGORY_ID}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="ko"
      loading="lazy"
    />
  );
}
