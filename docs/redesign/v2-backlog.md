# v2 "Studio Log" 리디자인 백로그

원본: `docs/redesign/v2-bundle/`
PM 가이드: `CLAUDE.md`
구현: `.claude/agents/fe-expert.md`

세 단계로 나눠 진행합니다.

- **M1 — Foundations**: 토큰·폰트·prose·코드블록. 이게 빠지면 다른 페이지 작업이 모두 일관성을 잃음.
- **M2 — Core pages**: Home / Blog 목록 / Blog 상세. 사용자가 실제로 가는 경로.
- **M3 — Supporting pages**: About / 404 / System.
- **M4 — Polish**: 라이트 테마, 페이지네이션, 모션 스펙, A11y 문서.

각 항목은 그대로 GitHub 이슈 한 개로 옮길 수 있도록 정리됩니다.
이슈 작성 시 `[design]` 템플릿 사용, 본문에 아래 "디자인 참조" 경로를 그대로 붙여 넣으면 됩니다.

---

## M2 — Core pages  ·  `priority:p1`

### M2-9 (#15). Blog 상세 — Reading Progress 2px 바 ✅ Shipped
- **라벨**: `type:design` `area:blog-detail` `priority:p2`
- **목표**: 상단 fixed 2px 진행 바. accent 컬러 + 글로우.
- **디자인 참조**: `styles.css:305~311`
- **의존**: M1-1

---

## M3 — Supporting pages  ·  `priority:p2`

### M3-1 (#17). About 페이지 — 8섹션 풀 재작성
- **라벨**: `type:design` `area:about` `priority:p2`
- **목표**: Hero / Intro+프로필 카드 / Now / Interests / Stack / Selected writing / Colophon+pull quote / Elsewhere 8섹션.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-about.jsx`
- **참고**: `image-slot.js`는 프로토타입 도구 — 실제 사이트는 정적 이미지로

### M3-2 (#18). 404 페이지
- **라벨**: `type:design` `area:404` `priority:p2`
- **목표**: 거대 serif `404.`, 시도한 경로 echo, ASCII 코드 레인 배경, suggested posts 3편.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-404.jsx`

### M3-3 (#19). /system 페이지 (디자인 시스템 핸드오프)
- **라벨**: `type:design` `area:system` `priority:p3`
- **목표**: 6탭 — Tokens / Type / Spacing / Motion / A11y / States. 본 블로그 사이트에 노출할지(라우트로) 또는 별도 도메인으로 분리할지 PM 결정 필요.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-system.jsx`
- **노트**: 우선순위 낮음. 라이브에 굳이 필요하지 않다면 internal docs로만 유지 검토.

---

## M4 — Polish  ·  `priority:p3`

### M4-1 (#20). 라이트 테마 + 토글 UI
- **라벨**: `type:design` `area:design-system` `priority:p3`
- **목표**: `[data-theme="light"]` 토큰 한 벌 추가 + 헤더에 토글. 코드블록은 의도적으로 다크 유지.
- **디자인 참조**: `docs/redesign/v2-bundle/project/styles.css:707~768`

### M4-2 (#21). 페이지네이션 (Load more 또는 paged)
- **라벨**: `type:feature` `area:blog-list` `priority:p3`
- **목표**: 6개씩 페이지네이션 + 종료 마커. 글 수 적은 동안은 `All` 모드만.

### M4-3 (#22). 모션 스펙 시트 + reduced-motion 가드
- **라벨**: `type:docs` `area:design-system` `priority:p3`
- **목표**: 페이지 진입·카드 호버·TOC 활성·Reading Progress 거동 표 (duration · easing · property). 모든 transition/animation에 `@media (prefers-reduced-motion)` 가드 확인.

### M4-4 (#23). A11y 대비비 표 + 포커스 링 문서
- **라벨**: `type:docs` `area:design-system` `priority:p3`
- **목표**: 모든 텍스트/액션 컬러 페어의 WCAG 2.1 대비비를 표로. 4.5(AA) / 7(AAA) / 3(AA large) 임계점 표기.

### M4-5 (#24). Cover 이미지 영역 — 있는 글/없는 글 2종
- **라벨**: `type:design` `area:blog-detail` `priority:p3`
- **목표**: cover frontmatter가 있을 때만 hero에 출력, 16:9 비율 강제, alt 텍스트 규약.

---

## Shipped

- **M2-10 · Blog 상세 — Prev / Next 카드** — #16 · [`69b7aa1`](https://github.com/smc5720/smc5720.github.io/commit/69b7aa1) · 2026-05-18. `getPrevNextPosts(slug)` 추가: 날짜 내림차순 전체 목록에서 같은 카테고리 인접 글 우선(없으면 전체 인접 fallback). `PrevNextCards.tsx` 신규: `.pnc-grid` 2열 그리드, OLDER(좌)·NEWER(우) `<Link>` 카드, 날짜(`yyyy.MM.dd`) + 읽기시간 메타, hover 시 `border-color: var(--color-accent-line)` 전환. `globals.css`에 `.pnc-*` 룰 추가: ≤600px 1열 stack + NEWER 좌정렬, `prefers-reduced-motion` 가드, `:focus-visible` 전역 룰 상속. `page.tsx` 기존 인라인 prev/next footer 삭제 → detail-grid 아래 `<section style={{ marginTop: 96, paddingBottom: 96 }}>` 별도 배치. 하드코딩 hex/rgb 0건, `pnpm build` 통과(8/8 정적 페이지).
- **M2-8 · Blog 상세 — Sticky TOC + scroll-spy** — #14 · [`659a0a0`](https://github.com/smc5720/smc5720.github.io/commit/659a0a0) · 2026-05-17. `TableOfContents.tsx` 전면 재작성: `.toc-*` 마크업(toc-title "On this page", toc-list, toc-item h2/h3 구분, h2 `01/02` 번호 표기, active 항목 accent 좌측 보더 + padding-left shift). IntersectionObserver scroll-spy(`rootMargin: -80px 0px -60% 0px`) 유지, `aria-current="location"`, `prefers-reduced-motion` 가드(`padding-left` 트랜지션 제거 + scroll behavior `auto`). `page.tsx` 본문 영역을 `flex gap-16` → `.container.detail-grid` 3-컬럼 그리드(`1fr min(720px,100%) 1fr`, gap 56)로 재구성: 좌측 `.toc-aside`(sticky top 110px, maxWidth 220px, justifySelf end), 중앙 `article.prose-col`, 우측 빈 aside. `globals.css`에 `.detail-grid` / `.toc-aside` / `.toc-*` 전체 룰 + `@media ≤900px` 모바일 inline 노출(1열 collapse, TOC 상단 배치 + hairline, 우측 빈 aside 숨김). 토큰만 사용(하드코딩 hex/rgb 0건), `pnpm build` 통과(8/8 정적 페이지).
- **M2-7 · Blog 상세 — 헤더·메타·커버** — #13 · [`239dc20`](https://github.com/smc5720/smc5720.github.io/commit/239dc20) · 2026-05-17. `src/app/blog/[slug]/page.tsx`의 헤더 블록을 v2 프로토타입(`blog-pages.jsx` L542~592 BlogDetailPage hero/cover)으로 본구현. Back link `.arrow-link.arrow-link-back`(왼쪽 화살표 + "목록으로", `scaleX(-1)`) → 메타 스트립(`<CategoryBadge size="md">` + `PUBLISHED · {long date}` + `·` + `{readingTime} MIN READ`, `.mono-label.tabular`, gap 12 / marginBottom 26) → 거대 serif 타이틀(`.display` + `clamp(40px, 5.4vw, 78px)`, lineHeight 1.04, letterSpacing -.022em, fontWeight 380) → `.lede`(marginTop 24, color text-2, maxWidth 640, description 있을 때만) → 태그 스트립(`.badge.badge-tag` 칩, `#{tag}`, dot 없음, marginTop 28, 별도 행). 헤더 하단 `border-b` 제거 → hero/cover/본문이 자연스럽게 이어짐. Cover 섹션은 `post.cover` 있을 때만 `.container-narrow` 안에 16/8 aspect-ratio 컨테이너 + `<Image fill>` (`next.config.ts`의 `images.unoptimized`로 static export 호환); 프로토타입의 SVG mock(axis lines + 거대 글리프)은 디자인 데모라 무시하고 실제 사용자 이미지 출력, alt는 `post.title` fallback. 본문/TOC/Prev·Next는 미변경(각 M2-8/M2-9/M2-10에서 처리). globals.css에 `.container-narrow` 클래스 룰(760px max-width, 1100/900/600 반응형 패딩) + `.badge`/`.badge.badge-tag`(프로토타입 `styles.css` L190~224 spec, dot `::before`는 `data-cat=*` 카테고리 전용·tag 변형은 ::before 숨김) + `.arrow-link-back .arrow`(`scaleX(-1)`) 추가. 토큰만 사용(하드코딩 hex/rgb 0건), `pnpm build` 통과(8/8 정적 페이지), 모션 없음 → reduced-motion 가드 불필요, `:focus-visible` 전역 룰 상속.
- **M2-6 · Blog 목록 — Empty 상태 + 검색 결과 없음** — #12 · [`2bd98cd`](https://github.com/smc5720/smc5720.github.io/commit/2bd98cd) · 2026-05-17. M2-4에서 placeholder로 남겨둔 빈 결과 처리를 v2 EmptyState 디자인으로 본구현. `src/components/EmptyResults.tsx` 신규 — `.empty-card`(1px dashed `var(--color-border-2)`, padding 80×40, flex column gap 18) 안에 ASCII 박스 `<pre>`(mono 11px, color-text-3, `╭─...╮` 4줄) + `.display .display-h3` 한국어 제목 + `.small` 본문(max-width 420) + `.btn.btn-primary` Reset CTA(`↺` opacity 0.6) 구성. 카피 3분기: ① `search` 있을 때 `"<검색어>"에 해당하는 글이 아직 없습니다.…` (검색어 토큰 `var(--color-text)`로 강조) ② `search` 없고 카테고리 필터만 있을 때 `이 카테고리에 해당하는 글이 아직 없습니다.…` ③ 전체 글 0개일 때 `아직 발행된 글이 없습니다.` (Reset 숨김). `BlogList.tsx` 인라인 placeholder(254~268) → `<EmptyResults search activeCat onReset={() => pushParams({ category: ALL, q: "", sort: "new" })}/>`로 교체, 기존 필터 초기화 로직 재사용. globals.css에 `.empty-card`/`.display-h3`/`.small` 유틸 추가 + `@media (max-width:600px)`에서 `.empty-card` padding을 `var(--s-12) var(--s-6)`로 축소. 토큰만 사용(하드코딩 hex/rgb 0건), `pnpm build` 통과. 모션 없음 → reduced-motion 가드 불필요, Reset 포커스 링은 `.btn.btn-primary` 상속.
- **M1-1 · `@theme` 토큰 전체 이식** — #3 · [#25](https://github.com/smc5720/smc5720.github.io/pull/25) · 2026-05-17. prototype 다크 토큰 31종 이식 + CategoryBadge 토큰화 (release red→orange). 라이트 테마는 M4-1로 분리.
- **M1-2 · 폰트 로더 확장 (Inter body + Noto KR fallback)** — #4 · [#26](https://github.com/smc5720/smc5720.github.io/pull/26) · 2026-05-17. next/font에 Inter·Noto Sans KR·Noto Serif KR 추가, `@theme` 4종 스택을 `var(--font-*)`로 정합, `body` 기본 폰트를 Syne → Inter로 분리.
- **M1-3 · prose / MDX 스타일 재작성** — #5 · [#27](https://github.com/smc5720/smc5720.github.io/pull/27) · 2026-05-17. `.prose` 전면 교체 — h2 decimal-leading-zero 카운터, h2 serif + 상단 보더, blockquote 좌측 2px accent, table bottom-border, ul/ol `::marker`, 본문 폰트 Syne→Inter, 모바일 다운스케일. `.prose pre`는 M1-4로 분리.
- **M1-4 · Shiki 코드블록 + 컨테이너 디자인** — #6 · [#28](https://github.com/smc5720/smc5720.github.io/pull/28) · 2026-05-17. `@shikijs/rehype` 테마 tokyo-night → vitesse-dark, 코드펜스 메타에서 `filename="..."`을 파싱해 `data-filename`/`data-language`로 lift, 클라이언트 `CodeBlock` 컴포넌트가 헤드바(점 3개 + 파일명 + 언어 칩 + Copy 버튼)를 렌더. `navigator.clipboard` 복사 · 1.4s `ok` 상태 · `:focus-visible` 링 · `prefers-reduced-motion` 가드. 줄번호는 M4로 이관.
- **M2-1 · Home — Hero 재구성** — #7 · [`ed0cf19`](https://github.com/smc5720/smc5720.github.io/commit/ed0cf19) · 2026-05-17. 거대 serif 타이틀(italic `Rico` + `Cheese` + accent 마침표, Fraunces opsz/SOFT axes) · 메타 스트립(`EST. 2022` + `NOW PLAYING ● featured`) · ASCII pre · 한국어 lede · CTA 두 개(`/blog` `/about`) · Scroll 인디케이터로 hero 재구성. `globals.css`에 `.display(-hero)` / `.lede` / `.mono-label(.tabular)` / `.btn(-primary/-ghost)` 공통 유틸 + `.hero-grid` 반응형(모바일 1열·ASCII 숨김, 태블릿 gap 축소) + `prefers-reduced-motion` 가드 추가. hero 아래 카테고리/Featured/Recent 블록은 M2-2/M2-3로 분리.
- **M2-2 · Home — 카테고리 카운터 그리드 (.cat-grid)** — #8 · [#29](https://github.com/smc5720/smc5720.github.io/pull/29) · 2026-05-17. 기존 CategoryBadge chip 가로 나열을 v2 디자인의 `.cat-grid` 6셀(Total + CAT_ORDER 순 5개 카테고리)로 교체. 셀 구조: mono-label(`Total` 또는 `01 · 뉴스`) + 44px Fraunces 카운트(`padStart(2,"0")`, 카테고리는 8px `--cat-*` dot 동반) + mono-label 캡션. 셀 클릭 → Total `/blog`, 카테고리 `/blog?category=<cat>` (`<Link>`). 반응형 보더 규칙: 데스크탑 6열, 태블릿(≤1100) 3열 + 4번째부터 상단 보더 + nth(3n+1) 좌측 보더 제거, 모바일(≤600) 2열 + 3번째부터 상단 보더 + nth(2n+1) 좌측 보더 제거. hover는 `color-mix`로 4% 텍스트 오버레이, `prefers-reduced-motion` 가드 + 전역 `:focus-visible` 룰 적용. hex/rgb 하드코딩 0건.
- **M2-4 · Blog 목록 — 컨트롤 바 (chips·검색·정렬·뷰토글)** — #10 · 2026-05-17. 기존 카테고리 chip + 단일 검색 박스를 v2 컨트롤 바로 교체. 헤더: `RICOCHEESE / BLOG` breadcrumb + `NNN essays` 카운터 + `The Index.` 거대 serif(italic + accent 마침표) + lede. `.controls-bar`(sticky top:64px, `color-mix(in srgb, var(--color-bg) 85%, transparent)` + `backdrop-filter: blur(14px)` + 하단 hairline)에 4종 컨트롤: ① `CAT_ORDER` 6개 chip(`.chip` 재사용 — M2-3에서 추가, `aria-pressed="true"`=white-inverted, `.count` `padStart(2,"0")`) ② `.search-box`(`⌕` + placeholder + `⌘K` 시각 힌트, title/desc/tags 검색, `aria-label`) ③ `.seg-ctrl` 3-way 정렬(Newest=date↓ / Longest=readingTime↓ / Shortest=readingTime↑) ④ `.seg-ctrl` 2-way 뷰(Grid=현행 2열 / Index=1열 placeholder, M2-5에서 sticky-year 그룹으로 교체 예정). URL이 유일한 상태 소스: `?category=&q=&sort=&view=`, 기본값은 키 제거 → clean URL, `router.replace({ scroll: false })`. `role="group"` + `aria-pressed` + `:focus-visible` + `prefers-reduced-motion` 가드. `≤900` 컨트롤 바 세로 stack, `≤600` search 100%. `CAT_ORDER` / `CATEGORY_CHIP_LABELS` 상수 신설. readingTime은 `src/lib/posts.ts`의 기존 필드 그대로 사용. 하드코딩 hex/rgb 0건, `pnpm build` 통과. Empty 상태는 인라인 placeholder — M2-6에서 ASCII 박스로 교체.
- **M2-5 · Blog 목록 — Index 뷰 (연도 sticky 그룹)** — #11 · [`6d7640e`](https://github.com/smc5720/smc5720.github.io/commit/6d7640e) · 2026-05-17. M2-4에서 placeholder(`grid-cols-1`)로 남겨둔 `view=index`를 v2 프로토타입 IndexList 본구현으로 교체. `BlogIndexList.tsx` 신규 — 연도별 그룹화(`new Date(p.date).getFullYear()` desc) + `.yr-row` 2-컬럼 grid(`180px 1fr` gap 40)로 좌측에 60px Fraunces 연도 + `NN essays` mono-label을 sticky(`top: 128px` = header 64 + controls-bar 64), 우측에 `<PostIndexRow>` 리스트. `PostIndexRow` = `.row` 3-컬럼(`92px 1fr auto`) `<Link>` — 날짜(mono tabular) · 제목(serif 22 hover accent) + 1줄 line-clamp desc · 읽기시간. hover 시 `padding-left: 14px` + `.row::before` 6×6 accent dot 등장. `BlogList.tsx` 분기 교체: `view === "index"` 시 `<BlogIndexList>`, 아니면 기존 PostCard grid 유지. globals.css에 `.index-list`/`.yr-row`/`.yr-col`/`.yr-num`/`.row`/`.row::before`/`.row-title`/`.row-desc` 추가 + ≤900에서 1열 stack + sticky 해제 + yr-num 40px, ≤600에서 row 단일 컬럼 + `::before` 비활성 + hover-shift 0. `prefers-reduced-motion` 가드 포함. 하드코딩 hex/rgb 0건, `pnpm build` 통과. PostCard 미변경(grid 뷰 호환), EmptyState는 M2-6에서 ASCII 박스로 교체 예정.
- **M2-3 · Home — Marquee · Featured · Recent6 · Pull quote · Tag index** — #9 · [`7a40557`](https://github.com/smc5720/smc5720.github.io/commit/7a40557) · 2026-05-17. cat-grid 뒤의 레거시 섹션을 v2 5블록으로 교체. `<Marquee>` (한·영 serif 7문구 × 2 seamless loop, 60s linear infinite, hover/`prefers-reduced-motion` paused) → 01 Featured (`<PostCardFeatured>` 2열 카드 — CategoryBadge(md) + `★ Featured · 날짜` + 큰 serif 제목 hover accent + lede + Read essay arrow-link / 인라인 `FeaturedArtwork` — radial gradient + 32px fine grid mask + slug 기반 거대 serif 글리프 + spec 라벨/카운터) → 02 Recent6 (`.recent-grid` 3→2→1 + `<PostCardCompact>` 셀 — `.card` hairline + Badge(sm) + 날짜 + `.post-title` hover accent + line-clamp 2 desc + bottom strip Showing N of M · oldest essay + Read all 버튼) → 03 Pull quote (1fr 2fr 그리드, serif italic 거대 인용 + accent 양념표) → 04 Tag index (실 빈도 집계 상위 16개 `<Link>` chip). 재사용 `<SectionHead>` (`§ {num}` + kicker + `display-h2` + right slot, 900px 이하 stack). 기존 `PostCard.tsx`는 BlogList 호환 위해 보존 — M2-4에서 정리. 토큰화: artwork radial은 `var(--color-accent-soft)`, 미세 그리드/큰 글리프는 `color-mix(in srgb, var(--color-text) 6%, transparent)`. 하드코딩 hex/rgb 0건.

---

## 참고: 이슈로 옮길 때

1. `gh issue create --template design-implementation` (또는 GitHub UI에서 "Design 구현" 선택)
2. 본문 작성 시 위 항목의 **디자인 참조** 경로를 그대로 붙여 넣으면 됩니다.
3. 라벨은 템플릿이 `type:design` / `status:needs-spec`까지 자동, 나머지는 폼에서 선택.
4. 의존 관계가 있는 경우 본문에 `Depends on #N` 표기.
