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

/** .env.local 파일을 읽어 process.env에 주입 (이미 설정된 값은 덮어쓰지 않음) */
function loadEnvLocal() {
  const envPath = join(ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
    if (match) process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '').trim();
  }
}
loadEnvLocal();
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

const STOP_WORDS = new Set(['a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','i','you','we','it','if','as','so','do','my','your','its','not','only','just','this','that','how','what','why','when','who','which','about','after','before','can','will','would','could','should','have','has','had','more','some','all','any','up','out','into','than','over','here','there']);

/** 제목에서 의미 있는 키워드 2개 추출 */
function extractKeywords(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w))
    .slice(0, 2);
}

async function fetchPexelsImages(tags, title = '') {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.log('\n[이미지 제안 비활성화] PEXELS_API_KEY가 설정되지 않았습니다.');
    console.log('  1. 프로젝트 루트에 .env.local 파일을 생성하세요.');
    console.log('  2. 아래 내용을 입력하세요:');
    console.log('       PEXELS_API_KEY=발급받은_키');
    console.log('  3. Pexels API 키 발급: https://www.pexels.com/api/');
    return;
  }

  const keywords = tags.length > 0 ? tags.slice(0, 2) : extractKeywords(title);
  const query = keywords.join(' ');
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
    { headers: { Authorization: apiKey } }
  );
  if (!res.ok) {
    console.log(`body_images : (Pexels API 오류: ${res.status})`);
    return;
  }

  const { photos = [] } = await res.json();
  if (photos.length === 0) {
    console.log('body_images : (검색 결과 없음)');
    return;
  }

  console.log(`\n[ Pexels 이미지 제안 — "${query}" 검색 결과 ]\n`);
  photos.forEach((photo, i) => {
    console.log(`${i + 1}. ${photo.src.large}`);
    console.log(`   작가: ${photo.photographer}  출처: ${photo.url}`);
    console.log();
  });
  console.log('삽입 형식: ![설명](URL)');
  console.log('           *Photo by [작가명](작가URL) on [Pexels](출처URL)*');
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
  const tagList = Array.isArray(article.tag_list) ? article.tag_list : [];
  console.log(`tags       : ${tagList.join(', ') || '(없음)'}`);
  const coverImage = article.cover_image || article.social_image || '';
  console.log(`cover_image: ${coverImage || '(없음)'}`);
  console.log(sep);
  console.log('\n--- body_markdown ---\n');
  console.log(article.body_markdown ?? '(본문 없음)');
  console.log(`\n${sep}`);

  await fetchPexelsImages(tagList, article.title);

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
