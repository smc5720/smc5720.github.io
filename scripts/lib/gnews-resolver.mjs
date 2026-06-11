/**
 * Google News 리다이렉트 URL을 실제 기사 URL로 해소하고 본문을 추출합니다.
 */
import { chromium } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * @param {string} gnewsUrl
 * @returns {Promise<{ resolvedUrl: string|null, title: string, textContent: string }>}
 */
export async function fetchArticle(gnewsUrl) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();

  try {
    // networkidle: JS 리다이렉트 포함 모든 내비게이션 완료 후 반환
    await page.goto(gnewsUrl, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});

    const resolvedUrl = page.url();
    if (resolvedUrl.includes('news.google.com')) {
      return { resolvedUrl: null, title: '', textContent: '' };
    }

    const html = await page.content();
    const dom = new JSDOM(html, { url: resolvedUrl });
    const article = new Readability(dom.window.document).parse();

    return {
      resolvedUrl,
      title: article?.title?.trim() ?? '',
      textContent: article?.textContent?.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim() ?? '',
    };
  } finally {
    await browser.close();
  }
}
