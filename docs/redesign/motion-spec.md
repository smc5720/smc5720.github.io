---
title: Motion Spec
---

# Motion Spec

## 1. 스펙 표

### 1-1. 페이지 진입 (Page Enter)

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| page-enter | Hero h1 (`.animate-fade-up`) | opacity 0→1, translateY 24px→0 | 700ms | `cubic-bezier(0.22, 1, 0.36, 1)` | 0ms |
| page-enter | Hero right col (`.animate-fade-up.delay-2`) | opacity 0→1, translateY 24px→0 | 700ms | `cubic-bezier(0.22, 1, 0.36, 1)` | 160ms |
| page-enter | Scroll indicator (`.animate-fade-in.delay-6`) | opacity 0→1 | 500ms | `ease` | 480ms |

딜레이 클래스: `.delay-1`=80ms, `.delay-2`=160ms, `.delay-3`=240ms, `.delay-4`=320ms, `.delay-5`=400ms, `.delay-6`=480ms

### 1-2. 카드 호버 (Card Hover)

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| card-hover (PostCard v1) | `.group` 카드 wrapper | border-color, background | 300ms | `ease` (Tailwind default) | 0ms |
| card-hover (PostCard v1) | 제목 h2/h3 color | color → accent | 200ms | `ease` | 0ms |
| card-hover (PostCard v1) | 상단 accent line | width 0→100% | 500ms | `ease-out` | 0ms |
| card-hover (PostCard v1) | 아이콘/화살표 color | color → accent | 200ms | `ease` | 0ms |
| card-hover (PostCardFeatured) | `.featured-title` | color → accent | 200ms | `var(--ease-out)` | 0ms |
| card-hover (`.card` CSS class) | `.post-title` | color → accent | 200ms | `var(--ease-out)` | 0ms |
| row-hover (`.row`) | padding-left 0→14px | padding-left | 250ms | `var(--ease-out)` | 0ms |
| row-hover (`.row`) | `::before` dot | opacity 0→1, translateX → 0 | 200ms / 250ms | `ease` / `var(--ease-out)` | 0ms |
| row-hover (`.row-title`) | color → accent | color | 200ms | `ease` | 0ms |

### 1-3. TOC 활성 (TOC Active)

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| toc-active | `.toc-item` | color, border-color | 150ms | `ease` | 0ms |
| toc-active | `.toc-item` (reduced-motion 꺼진 경우) | padding-left 12→14px | 200ms | `var(--ease-out)` | 0ms |
| toc-scroll | `scrollIntoView` | scroll behavior | — | smooth (reducedMotion 시 auto) | 0ms |

### 1-4. Reading Progress

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| reading-progress | `#reading-progress` bar | width 0→100% | 60ms | `linear` | 0ms |

### 1-5. 마키 (Marquee)

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| marquee | `.marquee-track` | translateX 0 → -50% | 60s | `linear` | 0ms |
| marquee-pause | `.marquee:hover .marquee-track` | animation-play-state: paused | — | — | 0ms |

### 1-6. 헤더 (Header)

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| header-scroll | `<header>` | background, backdrop-filter, border | 300ms | `ease` | 0ms |
| logo-dot hover | 로고 dot span | scale 1→1.5 | 300ms | `ease` | 0ms |
| logo-text hover | 로고 텍스트 | color → accent | 200ms | `ease` | 0ms |
| nav-link hover | 데스크톱 nav 링크 | color | 200ms | `ease` | 0ms |
| theme-toggle hover | 테마 토글 버튼 | color | 200ms | `ease` | 0ms |
| hamburger open/close | 햄버거 bar ×3 | rotate, translate, opacity | 200ms | `ease` | 0ms |
| mobile-nav link hover | 모바일 nav 링크 | color → accent | (Tailwind default) | — | 0ms |

### 1-7. 버튼 / 링크 (Button & Link)

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| btn hover | `.btn` | background, border-color, color | 200ms | `var(--ease-out)` | 0ms |
| arrow-link hover | `.arrow-link .arrow` | width 22→36px | 250ms | `var(--ease-out)` | 0ms |
| chip hover | `.chip` | color, border-color, background | 150ms | `ease` | 0ms |
| seg-ctrl hover | `.seg-ctrl button` | color, background | 150ms | `ease` | 0ms |
| pagination-btn hover | `.pagination-btn` | color, border-color | 150ms | `ease` | 0ms |
| copy-btn hover | `.copy-btn` | color, border-color, background | 150ms | `ease` | 0ms |
| prose-anchor hover | `.prose a` | border-color, color | 200ms | `ease` | 0ms |
| prose-heading anchor | `.prose h2/h3 .anchor` | opacity 0→1 | 200ms | `ease` | 0ms |

### 1-8. 카테고리 카운터 / Elsewhere / Prev-Next

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| cat-cell hover | `.cat-cell` | background | 200ms | `var(--ease-out)` | 0ms |
| elsewhere-card hover | `.elsewhere-card` | background → accent-soft | 200ms | `var(--ease-out)` | 0ms |
| pnc-card hover | `.pnc-card` | border-color → accent-line | 200ms | `ease` | 0ms |

### 1-9. About 페이지

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| about-writing-row hover | `.about-writing-row` | padding-left 0→14px | 250ms | `var(--ease-out)` | 0ms |
| about-writing-row hover | `::before` dot | opacity 0→1, translateX → 0 | 200ms / 250ms | `ease` / `var(--ease-out)` | 0ms |
| about-writing-title hover | `.about-writing-title` | color → accent | 200ms | `ease` | 0ms |

### 1-10. Footer

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| footer-link hover | 푸터 링크 (a, Link) | color → accent | (Tailwind `transition-colors` default = 150ms) | `ease` | 0ms |

### 1-11. System 페이지 — EasingDemo

| Interaction | Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|---|
| easing-demo (sys-slide-0) | `--ease-out` 데모 dot | left 4px → calc(100% - 24px) | 1800ms | `cubic-bezier(.16, 1, .3, 1)` | 0ms |
| easing-demo (sys-slide-1) | `--ease-snap` 데모 dot | left 4px → calc(100% - 24px) | 1800ms | `cubic-bezier(.2, .8, .2, 1)` | 0ms |
| easing-demo (sys-slide-2) | `linear` 데모 dot | left 4px → calc(100% - 24px) | 1800ms | `linear` | 0ms |

---

## 2. Easing 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 기본 진입·exit. 길이감 있는 후퇴 |
| `--ease-snap` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 버튼 click, 짧고 단단하게 |
| `linear` | `linear` | Reading Progress 바 — 입력 비율을 그대로 |
| `cubic-bezier(0.22, 1, 0.36, 1)` | *(비토큰, page-enter 전용)* | fade-up 페이지 진입 |

---

## 3. `prefers-reduced-motion` 가드 현황

### 3-1. CSS (`src/app/globals.css`) — 점검 결과: 모두 커버됨

| 블록 / 선택자 | 가드 위치 | 처리 방식 |
|---|---|---|
| `.animate-fade-up`, `.animate-fade-in` | line 217–224 | `animation: none; opacity: 1; transform: none` |
| `.btn` | line 319–323 | `transition: none` |
| `.copy-btn` | line 562–566 | `transition: none` |
| `.search-box`, `.seg-ctrl button` | line 1031–1036 | `transition: none` |
| `.pagination-btn` | line 1091–1095 | `transition: none` |
| `.marquee-track` | line 1187–1201 | `animation: none` |
| `.arrow-link .arrow` | line 1187–1201 | `transition: none` |
| `.chip`, `.card .post-title`, `.featured-card .featured-title` | line 1187–1201 | `transition: none` |
| `.row`, `.row::before` | line 1429–1438 | `transition: none` |
| `.cat-cell` | line 1256–1259 | `transition: none` |
| `.toc-item` (padding-left만 제거) | line 1571–1575 | `transition: color .15s, border-color .15s` (padding-left 제거) |
| `#reading-progress` | line 1609–1613 | `transition: none` |
| `.pnc-card` | line 1668–1672 | `transition: none` |
| `.elsewhere-card` | line 2108–2112 | `transition: none` |
| `.about-writing-row`, `.about-writing-row::before`, `.about-writing-title` | line 2181–2193 | `transition: none` |
| `[style*="sys-slide"]` (EasingDemo) | line 1929–1933 | `animation: none !important` |

### 3-2. TSX 컴포넌트 (Tailwind 유틸리티) — 수정 내역

다음 파일들은 `transition-*`/`duration-*` Tailwind 클래스를 직접 사용하므로 CSS 레벨 `@media` 블록으로 커버되지 않습니다. `motion-reduce:transition-none` variant를 추가하여 수정했습니다.

#### `src/components/PostCard.tsx`
- featured 카드 wrapper: `transition-all duration-300` → `motion-reduce:transition-none` 추가
- featured 카드 glow overlay: `transition-opacity duration-500` → `motion-reduce:transition-none` 추가
- featured 카드 h2 제목: `transition-colors duration-200` → `motion-reduce:transition-none` 추가
- featured 카드 화살표 div: `transition-colors duration-200` → `motion-reduce:transition-none` 추가
- 일반 카드 wrapper: `transition-all duration-300` → `motion-reduce:transition-none` 추가
- 일반 카드 상단 accent line: `transition-all duration-500` → `motion-reduce:transition-none` 추가
- 일반 카드 h3 제목: `transition-colors duration-200` → `motion-reduce:transition-none` 추가

#### `src/components/Header.tsx`
- `<header>` wrapper: `transition-all duration-300` → `motion-reduce:transition-none` 추가
- 로고 dot: `transition-transform duration-300` → `motion-reduce:transition-none` 추가
- 로고 텍스트: `transition-colors duration-200` → `motion-reduce:transition-none` 추가
- 데스크톱 nav 링크: `transition-colors duration-200` → `motion-reduce:transition-none` 추가
- 테마 토글 버튼: `transition-colors duration-200` → `motion-reduce:transition-none` 추가
- 햄버거 bar ×3: `transition-all duration-200` → `motion-reduce:transition-none` 추가 (3개 span 모두)
- 모바일 nav 링크: `transition-colors` → `motion-reduce:transition-none` 추가

#### `src/components/Footer.tsx`
- 푸터 링크 3개 (GitHub, Blog, About): `transition-colors` → `motion-reduce:transition-none` 추가

### 3-3. 이미 처리된 컴포넌트

| 컴포넌트 | 처리 방식 |
|---|---|
| `TableOfContents.tsx` | `useEffect`로 `matchMedia("prefers-reduced-motion: reduce")` 감지 → `scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })` |
| `ReadingProgress.tsx` | JS 로직 자체에 모션 없음. CSS `#reading-progress { transition: width 0.06s linear }` 은 globals.css에서 `transition: none`으로 처리됨 |
| `Marquee.tsx` | CSS `.marquee-track { animation }` 에 globals.css 가드 적용됨 |
| `PostCardFeatured.tsx` | `.featured-title`의 CSS `transition`은 globals.css `.featured-card .featured-title` 가드 적용됨 |

---

## 4. 점검 결론

`prefers-reduced-motion` 누락 케이스: **수정 완료 — 잔여 0건**

- CSS 클래스 기반 모션: `globals.css` `@media (prefers-reduced-motion: reduce)` 블록으로 전체 커버
- Tailwind 유틸리티 기반 모션: `PostCard.tsx` / `Header.tsx` / `Footer.tsx` 에 `motion-reduce:transition-none` 추가 완료
- JS 제어 스크롤(`TableOfContents.tsx`): `matchMedia` 훅으로 처리 완료
