# v3 재디자인 소스

Claude Design으로 제작한 v3 재디자인 원본. v3 구현 이슈(#106~#112)가 이 디렉터리를 참조한다.

## 파일

| 파일 | 내용 |
| --- | --- |
| `blog-v3.dc.html` | 디자인 원본. 아트보드 20장, 인라인 스타일. 198KB |

- 출처: Claude Design 프로젝트 `a7e83c7d-9645-44fe-b65d-26951e700b2c`
- 원본 파일명: `Blog v3 홈 - 컨셉 3안.dc.html`
- 브리프: [`docs/design-brief-v3.md`](../../design-brief-v3.md)

> `blog-v3.dc.html`은 첫 줄에서 `./support.js`(Claude Design 캔버스 에디터 런타임)를 불러온다.
> 그 파일은 생성물이고 디자인 내용이 없어 커밋하지 않았다. 따라서 브라우저로 열면 캔버스로는
> 렌더되지 않지만, 인라인 스타일 HTML이라 **소스로 읽는 데는 문제없다.** 아트보드는
> `data-screen-label` 속성으로 찾으면 된다.

## 아트보드

| ID | 라벨 | 내용 |
| --- | --- | --- |
| `1a` | 1a 홈 | **채택안** — 연대기: 좌측 색인 레일 + 단일 열 흐름 (1440) |
| `1b` | 1b 홈 | 미채택 — 에디토리얼: 큰 활자, 비대칭 2열, 강한 명암 |
| `1c` | 1c 홈 | 미채택 |
| `2a` | 2a 목록 Grid | `/blog` Grid 뷰 (1440) |
| `2b` | 2b Index 뷰 | Index 뷰 · 빈 결과 상태 · 목록 끝 마커 |
| `3a` | 3a 글 상세 | `/blog/[slug]` 3열 그리드 + 본문 전체 (1440) |
| `3b` | 3b 상태 명세 | 복사 버튼 2상태 · LinkCard 폴백 · Shiki 팔레트 · 버튼 5상태 |
| `4a` | 4a 소개 | `/about` §01–§08 (1440) |
| `4b` | 4b 404 | 404 — 배경 장식 없이 |
| `5a` | 5a 토큰 | 색 · 타입 · 간격 · radius · shadow · 모션 · focus 명세 |
| `5b` | 5b @theme | **그대로 옮길 수 있는 `@theme` 블록** (아래 전재) |
| `6a` | 6a 태블릿 … | 태블릿 834 — 홈 · 목록 · 상세 |
| `6b` | 6b 모바일 … | 모바일 390 — 홈 · 메뉴 펼침 · 목록 · 상세 |
| `7a` | 7a 아이콘 | 파비콘 · 앱 아이콘 · PWA |
| `7b` | 7b OG 이미지 | 기본 OG 1200×630 (실측 크기) |

## 컨셉 (채택안 1a)

무채색에 액센트 하나. 위계를 크기가 아니라 **위치와 굵기**로 잡는다. 커버 이미지는
`filter: grayscale(1) contrast(0.92)`로 눌러 출처별 사진 톤 불일치를 흡수한다.

좌측 264px 색인 레일이 홈에서는 카운터(전체·연도·카테고리), 목록에서는 필터로 이어진다.
태블릿에서 상단 수평 스트립, 모바일에서 필터 시트 버튼으로 접힌다.

## 확정된 결정

| 항목 | 값 |
| --- | --- |
| 테마 | 다크 단일 (라이트·토글 제거) |
| 폰트 | Pretendard Variable + IBM Plex Mono. **세리프 0개** |
| 폰트 호스팅 | `public/fonts` 셀프 호스트 + `next/font/local` |
| 라이선스 표기 | 본문 CC BY-NC 4.0 · 코드 MIT |
| 사이트 주소 | `smc5720.github.io` (원본의 `ricocheese.dev`는 교정 대상) |
| 목록 탐색 | 24편/페이지 · 페이지 번호 직접 이동 |
| 주 탐색축 | 태그 · 연도 (카테고리 UI는 레일 한 블록으로 축소) |
| 내비게이션 | Home · Blog · About 3개 (`/system` 삭제) |

## `@theme` (아트보드 5b 전재)

```css
@theme {
  /* surface */
  --color-canvas: #0a0a0b;
  --color-bg: #0c0c0d;
  --color-bg-sticky: #0e0e10;
  --color-surface: #101012;
  --color-line: #1a1a1d;
  --color-line-strong: #232327;
  --color-line-hover: #2a2a2e;

  /* text — 전부 AA 이상 */
  --color-fg-strong: #ffffff;  /* 19.7:1 */
  --color-fg: #e6e6e8;         /* 15.7:1 */
  --color-fg-body: #c9c9cf;    /* 11.8:1 */
  --color-fg-muted: #9a9aa2;   /*  6.6:1 */
  --color-fg-subtle: #8d8d95;  /*  5.9:1 */
  --color-fg-faint: #7d7d85;   /*  4.8:1 */

  /* accent + category */
  --color-accent: oklch(0.74 0.13 155);
  --color-accent-text: oklch(0.82 0.10 155);
  --color-cat-news: oklch(0.75 0.13 155);
  --color-cat-dev: oklch(0.75 0.13 250);
  --color-cat-retro: oklch(0.75 0.13 85);
  --color-cat-release: oklch(0.75 0.13 320);
  --color-cat-etc: oklch(0.75 0.02 260);
  --color-warn: oklch(0.80 0.12 85);

  /* code (Shiki) */
  --color-code-bg: #0f1011;
  --color-code-fg: #d6d6da;
  --color-code-key: #7fd0a3;
  --color-code-str: #9fc6d8;
  --color-code-num: #d8c08f;
  --color-code-comment: #7d7d85;

  /* type */
  --font-sans: "Pretendard Variable", Pretendard, system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --text-display: 4rem;      --text-display--line-height: 1.14;
  --text-h1: 2.75rem;        --text-h1--line-height: 1.22;
  --text-h2: 1.75rem;        --text-h2--line-height: 1.35;
  --text-h3: 1.3125rem;      --text-h3--line-height: 1.45;
  --text-lead: 1.1875rem;    --text-lead--line-height: 1.75;
  --text-prose: 1.0625rem;   --text-prose--line-height: 1.85;
  --text-card: 1.125rem;     --text-card--line-height: 1.45;
  --text-ui: 0.9375rem;      --text-ui--line-height: 1.5;
  --text-meta: 0.8125rem;    --text-meta--line-height: 1.6;
  --tracking-tight: -0.02em; --tracking-tighter: -0.035em;

  /* radius · shadow · motion */
  --radius-xs: 4px; --radius-sm: 6px; --radius-md: 8px; --radius-lg: 12px;
  --shadow-overlay: 0 10px 28px rgb(0 0 0 / 0.55);
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 120ms; --dur-base: 180ms; --dur-slow: 260ms;
  --container-prose: 820px; --container-rail: 264px;
}
```

### 사용 규칙 (아트보드 5a 주석)

- 카테고리 색은 **배지 텍스트와 8% 배경으로만** 쓴다. 0편 카테고리는 색을 쓰지 않고 `--color-fg-faint`로 내린다.
- 한글 기준으로 자간은 **음수만**. `text-transform: uppercase`와 넓은 자간 라벨은 쓰지 않는다.
- 굵기는 **400 / 600 / 700** 세 단계.
- 모노스페이스는 코드 블록과 날짜·카운트·경로에만. **라벨 남용 금지.**
- 간격 4px 기반 — 섹션 상하 48, 프레임 좌우 40, 카드 내부 20–22, 본문 요소 간 26.
- radius — 배지·복사 버튼 4–6, 버튼·입력 6, 이미지 8, 카드 12, 칩 full.
- 그림자는 **오버레이에만** (모바일 메뉴·드롭다운). 나머지 층 구분은 선으로.
- `focus-visible` — `outline 2px` · `offset 2px` · `--color-accent`.
- `prefers-reduced-motion`에서 모든 duration 0ms, 스크롤은 즉시 이동.

### 반응형 프레임 값 (아트보드 6a·6b)

| | 데스크톱 | 태블릿 834 | 모바일 390 |
| --- | --- | --- | --- |
| 프레임 좌우 패딩 | 40 | 28 | 18 |
| 헤더 높이 | 68 | 60 | 56 |
| 히어로 타이포 | 64 | 44 | 축소 |
| Grid 열수 | 3 | 2 | 1 |
| 색인 레일 | 264px 좌측 | 상단 수평 스트립 | 필터 시트 버튼 |
| TOC | 좌측 레일 고정 | 본문 위 접힌 블록 | 본문 위 접힌 블록 |

## 정리

v3 구현이 전부 머지되면 v2 때처럼(`f1a64ed`) 이 디렉터리를 정리해도 된다.
