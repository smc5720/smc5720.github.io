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

## M1 — Foundations  ·  `priority:p0`

### M1-1. `@theme` 토큰 전체 이식 (styles.css → globals.css)
- **라벨**: `type:design` `area:design-system` `priority:p0`
- **목표**: 프로토타입 `styles.css`의 `--color-*` / `--font-*` / `--s-*` / `--r-*` / `--sh-*` / `--ease-*` / `--container-*` 토큰을 모두 `src/app/globals.css`의 Tailwind v4 `@theme` 블록으로 옮긴다. 이름은 1:1.
- **디자인 참조**: `docs/redesign/v2-bundle/project/styles.css` (1~70행, 707~768행)
- **완료 기준**:
  - 모든 토큰이 `@theme`로 정의됨
  - 기존 컴포넌트가 새 토큰명으로 빌드 통과 (Tailwind class 매핑 변경 포함)
  - 카테고리 dot 컬러(`--cat-*`) 5종 매핑 포함

### M1-2. 폰트 로더 확장 (Inter 추가 + body 폰트 분리)
- **라벨**: `type:design` `area:design-system` `priority:p0`
- **목표**: 현재 `Fraunces / Syne / JetBrains_Mono` 로딩에 **Inter** 추가. `--font-body`는 본문, `--font-sans`는 헤더·라벨에 사용. 한글 Noto fallback은 CSS 변수에서 처리.
- **디자인 참조**: `docs/redesign/v2-bundle/project/styles.css:42~46`, `src/app/layout.tsx`
- **완료 기준**:
  - `next/font/google`로 Inter variable 추가
  - `<html className>`에 4개 변수 모두 부여
  - `--font-serif/sans/body/mono` 4종 모두 `@theme`에 등록

### M1-3. prose / MDX 스타일 재작성
- **라벨**: `type:design` `area:mdx` `priority:p0`
- **목표**: 현재 `.prose` (h2 헤딩 카운터 없음, 인용·코드·표 스타일 차이) 를 v2 사양으로 교체.
- **디자인 참조**: `docs/redesign/v2-bundle/project/styles.css:313~396`
- **완료 기준**:
  - `.prose h2`에 `decimal-leading-zero` 카운터 자동 부여
  - blockquote · table · inline code · list 모두 새 스타일
  - 모바일 폰트 사이즈 다운 (`@media (max-width: 900px)` 변경)

### M1-4. Shiki 코드블록 + 컨테이너 디자인
- **라벨**: `type:design` `area:mdx` `priority:p0`
- **목표**: 코드블록을 파일명 라벨 / 언어 태그 / 복사 버튼 / 줄번호 + 6색 토큰(vitesse-dark 풍)으로 교체.
- **디자인 참조**: `docs/redesign/v2-bundle/project/styles.css:397~462`, `docs/redesign/v2-bundle/project/blog-components.jsx` (CodeBlock)
- **완료 기준**:
  - `@shikijs/rehype` 테마 결정 (vitesse-dark 또는 자체 변형)
  - 파일명/언어는 MDX 코드펜스 메타에서 파싱 (`\`\`\`ts filename="x.ts"`)
  - 복사 버튼 작동 (클라이언트 컴포넌트)
  - 줄번호 토글은 일단 제외 (M4)

---

## M2 — Core pages  ·  `priority:p1`

### M2-1. Home — Hero "The Studio Log."
- **라벨**: `type:design` `area:home` `priority:p1`
- **목표**: 거대 serif 타이틀 + Est. 라벨 + 시그니처 lede + CTA 두 개로 재구성. 그리드/노이즈 배경, mono scroll 인디케이터.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx` (Home 컴포넌트), `screens/01-final.png`
- **의존**: M1-1, M1-2

### M2-2. Home — 카테고리 카운터 그리드 (.cat-grid)
- **라벨**: `type:design` `area:home` `priority:p1`
- **목표**: 5개 카테고리 + 전체 카운트 셀 = 6셀 그리드. 1100 → 6열, 900 → 3열, 600 → 2열.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx` (CategoryGrid), `styles.css:600~688`
- **의존**: M1-1

### M2-3. Home — Featured 카드 + Recent 6 그리드 + Marquee
- **라벨**: `type:design` `area:home` `priority:p1`
- **목표**: 마키 라인(stationary band of serif 큰 글자), 큰 featured 카드, recent 6개 grid (3→2→1 반응형), pull quote, 태그 인덱스.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx`, `styles.css:521~570`
- **의존**: M2-1

### M2-4. Blog 목록 — 컨트롤 바 (chips + 검색 + 정렬 + 뷰토글)
- **라벨**: `type:design` `area:blog-list` `priority:p1`
- **목표**: 카테고리 chip(active = white-inverted), 검색 박스, 정렬 셀렉트, Index ↔ Grid 뷰 토글. URL query 동기화.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx` (BlogList), `styles.css:497~520`
- **의존**: M1-1

### M2-5. Blog 목록 — Index 뷰 (연도별 sticky 그룹)
- **라벨**: `type:design` `area:blog-list` `priority:p1`
- **목표**: 연도 라벨이 좌측에 sticky, 각 row는 grid(date · title · meta).
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx`, `styles.css:272~295`
- **의존**: M2-4

### M2-6. Blog 목록 — Empty 상태 + 검색 결과 없음
- **라벨**: `type:design` `area:blog-list` `priority:p2`
- **목표**: ASCII 박스 + 검색어 echo 포함된 empty 상태.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx` (EmptyState)
- **의존**: M2-4

### M2-7. Blog 상세 — 헤더 + 메타 + 커버
- **라벨**: `type:design` `area:blog-detail` `priority:p1`
- **목표**: 카테고리 배지 · 거대 serif 타이틀 · lede · 메타 줄(날짜 · 읽기시간 · 태그) · 옵션 cover 이미지.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx` (BlogDetail), `screens/01-v2-detail-code.png`
- **의존**: M1-3, M1-4

### M2-8. Blog 상세 — Sticky TOC + scroll-spy
- **라벨**: `type:design` `area:blog-detail` `priority:p1`
- **목표**: 본문 좌측(or 우측) sticky aside, h2/h3 스크롤 추적 활성 표시. 모바일에서는 inline collapsed.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx` (TOC), `styles.css:464~495`
- **의존**: M2-7

### M2-9. Blog 상세 — Reading Progress 2px 바
- **라벨**: `type:design` `area:blog-detail` `priority:p2`
- **목표**: 상단 fixed 2px 진행 바. accent 컬러 + 글로우.
- **디자인 참조**: `styles.css:305~311`
- **의존**: M1-1

### M2-10. Blog 상세 — Prev / Next 카드
- **라벨**: `type:design` `area:blog-detail` `priority:p2`
- **목표**: 본문 끝 prev/next 글로 이동하는 카드 2개.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-pages.jsx`
- **의존**: M2-7

---

## M3 — Supporting pages  ·  `priority:p2`

### M3-1. About 페이지 — 8섹션 풀 재작성
- **라벨**: `type:design` `area:about` `priority:p2`
- **목표**: Hero / Intro+프로필 카드 / Now / Interests / Stack / Selected writing / Colophon+pull quote / Elsewhere 8섹션.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-about.jsx`
- **참고**: `image-slot.js`는 프로토타입 도구 — 실제 사이트는 정적 이미지로

### M3-2. 404 페이지
- **라벨**: `type:design` `area:404` `priority:p2`
- **목표**: 거대 serif `404.`, 시도한 경로 echo, ASCII 코드 레인 배경, suggested posts 3편.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-404.jsx`

### M3-3. /system 페이지 (디자인 시스템 핸드오프)
- **라벨**: `type:design` `area:system` `priority:p3`
- **목표**: 6탭 — Tokens / Type / Spacing / Motion / A11y / States. 본 블로그 사이트에 노출할지(라우트로) 또는 별도 도메인으로 분리할지 PM 결정 필요.
- **디자인 참조**: `docs/redesign/v2-bundle/project/blog-system.jsx`
- **노트**: 우선순위 낮음. 라이브에 굳이 필요하지 않다면 internal docs로만 유지 검토.

---

## M4 — Polish  ·  `priority:p3`

### M4-1. 라이트 테마 + 토글 UI
- **라벨**: `type:design` `area:design-system` `priority:p3`
- **목표**: `[data-theme="light"]` 토큰 한 벌 추가 + 헤더에 토글. 코드블록은 의도적으로 다크 유지.
- **디자인 참조**: `docs/redesign/v2-bundle/project/styles.css:707~768`

### M4-2. 페이지네이션 (Load more 또는 paged)
- **라벨**: `type:feature` `area:blog-list` `priority:p3`
- **목표**: 6개씩 페이지네이션 + 종료 마커. 글 수 적은 동안은 `All` 모드만.

### M4-3. 모션 스펙 시트 + reduced-motion 가드
- **라벨**: `type:docs` `area:design-system` `priority:p3`
- **목표**: 페이지 진입·카드 호버·TOC 활성·Reading Progress 거동 표 (duration · easing · property). 모든 transition/animation에 `@media (prefers-reduced-motion)` 가드 확인.

### M4-4. A11y 대비비 표 + 포커스 링 문서
- **라벨**: `type:docs` `area:design-system` `priority:p3`
- **목표**: 모든 텍스트/액션 컬러 페어의 WCAG 2.1 대비비를 표로. 4.5(AA) / 7(AAA) / 3(AA large) 임계점 표기.

### M4-5. Cover 이미지 영역 — 있는 글/없는 글 2종
- **라벨**: `type:design` `area:blog-detail` `priority:p3`
- **목표**: cover frontmatter가 있을 때만 hero에 출력, 16:9 비율 강제, alt 텍스트 규약.

---

## Shipped

- (아직 없음. 첫 PR이 머지되면 여기로 이동.)

---

## 참고: 이슈로 옮길 때

1. `gh issue create --template design-implementation` (또는 GitHub UI에서 "Design 구현" 선택)
2. 본문 작성 시 위 항목의 **디자인 참조** 경로를 그대로 붙여 넣으면 됩니다.
3. 라벨은 템플릿이 `type:design` / `status:needs-spec`까지 자동, 나머지는 폼에서 선택.
4. 의존 관계가 있는 경우 본문에 `Depends on #N` 표기.
