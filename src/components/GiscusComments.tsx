"use client";

import Giscus from "@giscus/react";

const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}` | undefined;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

export function GiscusComments() {
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
      theme="dark_dimmed"
      lang="ko"
      loading="lazy"
    />
  );
}
