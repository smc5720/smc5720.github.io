#!/usr/bin/env node
/**
 * MDX 문법 검증 — `next build`와 같은 파서(next-mdx-remote + remark-gfm)로
 * 포스트를 컴파일해 본다. 빌드는 첫 오류에서 멈추지만, 이 스크립트는
 * 깨진 파일을 전부 나열하고 실패 시 exit 1.
 *
 * Usage:
 *   node scripts/validate-mdx.mjs                    # content/posts 전체
 *   node scripts/validate-mdx.mjs a.mdx b.mdx        # 지정 파일만
 *   node scripts/validate-mdx.mjs --changed          # git 변경/신규 포스트만
 *   node scripts/validate-mdx.mjs --changed --revert # 깨진 파일 되돌림 (신규는 삭제)
 *
 * --revert 는 자동화(daily-*.ps1)용: 깨진 글 하나 때문에 main 배포 전체가
 * 막히지 않도록 커밋 전에 걸러낸다. 되돌린 뒤에는 exit 0.
 */
import { execFileSync } from "node:child_process";
import { readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

const POST_DIR = "content/posts";

const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const git = (...a) => execFileSync("git", a, { encoding: "utf8" });

/** git status 기준 변경·신규 .mdx → { file, untracked } */
function changedPosts() {
  return git("status", "--porcelain", "--untracked-files=all", "--", POST_DIR)
    .split("\n")
    .filter((l) => l.endsWith(".mdx") && !l.startsWith(" D") && !l.startsWith("D "))
    .map((l) => ({ file: l.slice(3).trim(), untracked: l.startsWith("??") }));
}

let targets;
if (flags.has("--changed")) {
  targets = changedPosts();
} else if (args.length > 0) {
  targets = args.map((file) => ({ file, untracked: false }));
} else {
  targets = (await readdir(POST_DIR))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ file: path.join(POST_DIR, f), untracked: false }));
}

const failures = [];

for (const target of targets) {
  try {
    const { content } = matter(await readFile(target.file, "utf8"));
    await serialize(content, { mdxOptions: { remarkPlugins: [remarkGfm] } });
  } catch (err) {
    failures.push({ ...target, message: String(err?.message ?? err) });
  }
}

for (const { file, message } of failures) {
  console.error(`✗ ${file}\n  ${message.split("\n").slice(0, 2).join("\n  ")}`);
}

if (failures.length > 0 && flags.has("--revert")) {
  for (const { file, untracked } of failures) {
    if (untracked) await rm(file);
    else git("checkout", "--", file);
    console.error(`  ↩ ${untracked ? "deleted" : "reverted"}: ${file}`);
  }
  console.log(`${failures.length} broken file(s) dropped, ${targets.length - failures.length} OK`);
  process.exit(0);
}

if (failures.length > 0) {
  console.error(`\n${failures.length}/${targets.length} MDX file(s) failed to compile.`);
  process.exit(1);
}

console.log(`✓ ${targets.length} MDX file(s) OK`);
