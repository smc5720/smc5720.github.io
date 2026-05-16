import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import { BlogList } from "@/components/BlogList";

export const metadata = {
  title: "Blog",
  description: "모든 글 목록",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-32">
      {/* Page header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block w-8 h-px bg-accent" />
          <span className="font-mono text-xs tracking-[0.25em] text-text-3 uppercase">
            {posts.length} Posts
          </span>
        </div>
        <h1 className="font-serif font-black text-[clamp(3rem,8vw,6rem)] leading-none tracking-tight text-text">
          Blog
        </h1>
        <p className="mt-4 text-text-2 text-base max-w-lg leading-relaxed">
          개발, 뉴스, 회고, 릴리스 — 기록해두고 싶은 모든 것들
        </p>
      </div>

      <Suspense fallback={<div className="text-text-3 font-mono text-sm">Loading...</div>}>
        <BlogList posts={posts} />
      </Suspense>
    </div>
  );
}
