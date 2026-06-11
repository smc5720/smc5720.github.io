#!/usr/bin/env node
/**
 * Google News Korea RSS 수집 스크립트
 *
 * 사용법:
 *   node scripts/fetch-kr-news.mjs                      # Google News Korea 인기글 목록 출력
 *   node scripts/fetch-kr-news.mjs --create-issue <N>   # N번째 기사로 GitHub 이슈 생성
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const POSTS_DIR = join(ROOT, 'content', 'posts');

const RSS_URL = 'https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko';

/** 기사 URL을 기반으로 8자 해시 생성 */
function makeHash(url) {
  return createHash('sha256').update(url).digest('hex').slice(0, 8);
}

/** YYYYMMDD 형식 날짜 문자열 반환 */
function toDateStamp(dateStr) {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

/** 날짜를 YYYY-MM-DD 형식으로 포맷 */
function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

/** 기존 MDX 파일의 source_id 필드를 스캔해 이미 작성된 kr-news ID 목록 반환 */
function getWrittenIds() {
  const ids = new Set();
  if (!existsSync(POSTS_DIR)) return ids;

  for (const file of readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.mdx')) continue;
    const content = readFileSync(join(POSTS_DIR, file), 'utf-8');
    const match = content.match(/^source_id:\s*["']?(kr-news-[^"'\s]+)["']?/m);
    if (match) ids.add(match[1]);
  }
  return ids;
}

/** Google News RSS XML을 파싱해 기사 배열 반환 */
function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const block = itemMatch[1];

    const title = (block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                   block.match(/<title>([\s\S]*?)<\/title>/))?.[1]?.trim() ?? '';

    const link = (block.match(/<link>([\s\S]*?)<\/link>/) ||
                  block.match(/<link\s+href="([^"]+)"/))?.[1]?.trim() ?? '';

    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';

    const description = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                         block.match(/<description>([\s\S]*?)<\/description>/))?.[1]?.trim() ?? '';

    // source 태그에서 언론사 이름 추출
    const source = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/))?.[1]?.trim() ?? '';

    if (title && link) {
      items.push({ title, link, pubDate, description, source });
    }
  }

  return items;
}

/** description에서 HTML 태그 제거 */
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

/** Google News RSS 가져오기 */
async function fetchRss() {
  const res = await fetch(RSS_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RicoCheese-Blog-Bot/1.0)',
      'Accept': 'application/rss+xml, application/xml, text/xml',
    },
  });
  if (!res.ok) throw new Error(`Google News RSS 오류: ${res.status} ${res.statusText}`);
  return res.text();
}

/** 인기 기사 목록 출력 (이미 작성된 기사 제외) */
async function listArticles() {
  const xml = await fetchRss();
  const items = parseRssItems(xml);
  const writtenIds = getWrittenIds();

  const filtered = items.filter(item => {
    const hash = makeHash(item.link);
    const dateStamp = item.pubDate ? toDateStamp(item.pubDate) : toDateStamp(new Date().toISOString());
    const sourceId = `kr-news-${dateStamp}-${hash}`;
    return !writtenIds.has(sourceId);
  });

  if (filtered.length === 0) {
    console.log('\nGoogle News Korea의 현재 기사가 모두 작성 완료되었습니다.\n');
    return;
  }

  console.log(`\n[ Google News Korea — ${filtered.length}개 ]\n`);
  filtered.forEach((item, i) => {
    const num = String(i + 1).padStart(2, ' ');
    const hash = makeHash(item.link);
    const dateStamp = item.pubDate ? toDateStamp(item.pubDate) : toDateStamp(new Date().toISOString());
    const sourceId = `kr-news-${dateStamp}-${hash}`;
    const desc = stripHtml(item.description);
    const shortDesc = desc.length > 80 ? desc.slice(0, 80) + '...' : desc;

    console.log(`${num}. ${item.title}`);
    if (item.source) console.log(`    출처: ${item.source}`);
    if (item.pubDate) console.log(`    게시일: ${formatDate(item.pubDate)}`);
    if (shortDesc) console.log(`    요약: ${shortDesc}`);
    console.log(`    URL: ${item.link}`);
    console.log(`    source_id: ${sourceId}`);
    console.log();
  });

  console.log('이슈 생성: node scripts/fetch-kr-news.mjs --create-issue <번호>');
}

/** N번째 기사로 GitHub 이슈 생성 */
async function createIssue(n) {
  // gh CLI 존재 여부 확인
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch {
    console.error('오류: gh CLI가 설치되어 있지 않거나 PATH에 없습니다.');
    console.error('설치 안내: https://cli.github.com/');
    process.exit(1);
  }

  const xml = await fetchRss();
  const items = parseRssItems(xml);
  const writtenIds = getWrittenIds();

  const filtered = items.filter(item => {
    const hash = makeHash(item.link);
    const dateStamp = item.pubDate ? toDateStamp(item.pubDate) : toDateStamp(new Date().toISOString());
    const sourceId = `kr-news-${dateStamp}-${hash}`;
    return !writtenIds.has(sourceId);
  });

  if (filtered.length === 0) {
    console.error('작성 가능한 기사가 없습니다. 모두 이미 작성되었습니다.');
    process.exit(1);
  }

  const idx = Number(n) - 1;
  if (isNaN(idx) || idx < 0 || idx >= filtered.length) {
    console.error(`오류: 유효한 번호를 입력하세요. (1–${filtered.length})`);
    process.exit(1);
  }

  const item = filtered[idx];
  const hash = makeHash(item.link);
  const dateStamp = item.pubDate ? toDateStamp(item.pubDate) : toDateStamp(new Date().toISOString());
  const sourceId = `kr-news-${dateStamp}-${hash}`;
  const pubDateFormatted = item.pubDate ? formatDate(item.pubDate) : '날짜 미상';
  const descClean = stripHtml(item.description);

  const issueTitle = `[news-kr] ${item.title}`;
  const issueBody = `## 원문
- **URL:** ${item.link}
- **발행:** ${pubDateFormatted}
- **출처:** ${item.source || '(미상)'}
- **source_id:** \`${sourceId}\`

## 요약 (RSS)
${descClean || '(RSS에 요약 없음)'}

## 원문 내용
<!-- 원문을 읽고 여기에 붙여넣기 -->
`;

  console.log(`\n이슈 생성 중: ${issueTitle}\n`);

  try {
    const result = execSync(
      `gh issue create --title ${JSON.stringify(issueTitle)} --label "type:content,area:news-kr,status:needs-spec" --body ${JSON.stringify(issueBody)}`,
      { encoding: 'utf-8', cwd: ROOT }
    );
    console.log('이슈 생성 완료:');
    console.log(result.trim());
  } catch (err) {
    console.error('gh issue create 실행 실패:');
    console.error(err.message);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const createIssueIdx = args.indexOf('--create-issue');

if (createIssueIdx !== -1) {
  const n = args[createIssueIdx + 1];
  if (!n) {
    console.error('오류: --create-issue 다음에 번호를 입력하세요.');
    console.error('사용법: node scripts/fetch-kr-news.mjs --create-issue <N>');
    process.exit(1);
  }
  createIssue(n).catch(e => { console.error(e.message); process.exit(1); });
} else {
  listArticles().catch(e => { console.error(e.message); process.exit(1); });
}
