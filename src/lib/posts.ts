import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta, Category } from "@/types/post";
export { CATEGORY_LABELS } from "./constants";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const { minutes } = readingTime(content);

  if (data.cover && !data.coverAlt) {
    console.warn(`[M4-5] cover 있음, coverAlt 없음: ${slug}`);
  }

  return {
    slug,
    title: data.title ?? "Untitled",
    description: data.description ?? "",
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    published_at: data.published_at ? new Date(data.published_at).toISOString() : undefined,
    category: (data.category as Category) ?? "etc",
    tags: data.tags ?? [],
    cover: data.cover,
    coverAlt: data.coverAlt,
    readingTime: Math.ceil(minutes),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => {
      const ta = new Date(a.published_at ?? a.date).getTime();
      const tb = new Date(b.published_at ?? b.date).getTime();
      return tb - ta;
    });
}

export function getPostsByCategory(category: Category): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAllTags(): string[] {
  const tags = getAllPosts().flatMap((p) => p.tags);
  return [...new Set(tags)].sort();
}

export function getPrevNextPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const allPosts = getAllPosts(); // 날짜 내림차순 (최신→구)
  const idx = allPosts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  const currentCategory = allPosts[idx].category;

  // prev = 더 오래된 글 (idx+1 방향)
  // 같은 카테고리 우선: idx+1~끝에서 첫 번째 같은 카테고리 글
  // 없으면 allPosts[idx+1]
  let prev: PostMeta | null = null;
  if (idx < allPosts.length - 1) {
    const sameCatPrev = allPosts.slice(idx + 1).find((p) => p.category === currentCategory);
    prev = sameCatPrev ?? allPosts[idx + 1];
  }

  // next = 더 최신 글 (idx-1 방향)
  // 같은 카테고리 우선: 0~idx-1에서 idx에 가장 가까운 같은 카테고리 글 (역순 탐색)
  // 없으면 allPosts[idx-1]
  let next: PostMeta | null = null;
  if (idx > 0) {
    const sameCatNext = allPosts.slice(0, idx).reverse().find((p) => p.category === currentCategory);
    next = sameCatNext ?? allPosts[idx - 1];
  }

  return { prev, next };
}

