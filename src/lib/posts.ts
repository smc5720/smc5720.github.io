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

  return {
    slug,
    title: data.title ?? "Untitled",
    description: data.description ?? "",
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    category: (data.category as Category) ?? "etc",
    tags: data.tags ?? [],
    cover: data.cover,
    readingTime: Math.ceil(minutes),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: Category): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAllTags(): string[] {
  const tags = getAllPosts().flatMap((p) => p.tags);
  return [...new Set(tags)].sort();
}

