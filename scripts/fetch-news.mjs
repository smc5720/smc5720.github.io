#!/usr/bin/env node
/**
 * Dev.to 인기글 수집 스크립트 (최근 7일 기준)
 *
 * 사용법:
 *   node scripts/fetch-news.mjs              # 인기글 목록 (이미 작성한 글 제외)
 *   node scripts/fetch-news.mjs --id <ID>    # 특정 글 본문 전체 출력
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const POSTS_DIR = join(ROOT, 'content', 'posts');

/** 기존 MDX 파일의 source_id 필드를 스캔해 이미 작성된 ID 목록 반환 */
function getWrittenIds() {
  const ids = new Set();
  if (!existsSync(POSTS_DIR)) return ids;

  for (const file of readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.mdx')) continue;
    const content = readFileSync(join(POSTS_DIR, file), 'utf-8');
    const match = content.match(/^source_id:\s*["']?(devto-\d+)["']?/m);
    if (match) ids.add(match[1]);
  }
  return ids;
}

async function fetchTopArticles() {
  const res = await fetch('https://dev.to/api/articles?top=7&per_page=20');
  if (!res.ok) throw new Error(`Dev.to API 오류: ${res.status}`);
  return res.json();
}

async function fetchArticleById(id) {
  const res = await fetch(`https://dev.to/api/articles/${id}`);
  if (!res.ok) throw new Error(`Dev.to API 오류: ${res.status}`);
  return res.json();
}

function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

async function listArticles() {
  const writtenIds = getWrittenIds();
  const articles = await fetchTopArticles();
  const filtered = articles.filter(a => !writtenIds.has(`devto-${a.id}`));

  if (filtered.length === 0) {
    console.log('\n최근 7일 인기글이 모두 작성 완료되었습니다.\n');
    return;
  }

  console.log(`\n[ Dev.to 최근 7일 인기글 — ${filtered.length}개 ]\n`);
  filtered.forEach((a, i) => {
    const num = String(i + 1).padStart(2, ' ');
    console.log(`${num}. [ID: ${a.id}] ${a.title}`);
    console.log(`    작성자: ${a.user.name}`);
    console.log(`    태그: ${a.tag_list.join(', ') || '(없음)'}`);
    console.log(`    반응: ♥ ${a.positive_reactions_count}  댓글: ${a.comments_count}`);
    console.log(`    게시일: ${formatDate(a.published_at)}`);
    console.log(`    URL: ${a.url}`);
    console.log();
  });

  console.log('본문 보기: node scripts/fetch-news.mjs --id <ID>');
}

async function showArticle(id) {
  const article = await fetchArticleById(id);

  const sep = '='.repeat(64);
  console.log(`\n${sep}`);
  console.log(`source_id  : devto-${article.id}`);
  console.log(`title      : ${article.title}`);
  console.log(`author     : ${article.user.name}`);
  console.log(`published  : ${formatDate(article.published_at)}`);
  console.log(`url        : ${article.url}`);
  const tags = Array.isArray(article.tag_list) ? article.tag_list.join(', ') : (article.tag_list || '(없음)');
  console.log(`tags       : ${tags}`);
  console.log(sep);
  console.log('\n--- body_markdown ---\n');
  console.log(article.body_markdown ?? '(본문 없음)');
  console.log(`\n${sep}`);
  console.log('초안 작성 완료 후, 위 source_id를 MDX frontmatter에 포함하세요.');
  console.log('템플릿: docs/news-post-template.md');
  console.log(sep);
}

const args = process.argv.slice(2);
const idIdx = args.indexOf('--id');

if (idIdx !== -1 && args[idIdx + 1]) {
  showArticle(args[idIdx + 1]).catch(e => { console.error(e.message); process.exit(1); });
} else {
  listArticles().catch(e => { console.error(e.message); process.exit(1); });
}
