// blog-data.jsx — sample posts (Korean tech blog)
// Mimics MDX frontmatter + body. Bodies are arrays of "block" objects
// so we can render rich content (h2/h3/p/code/quote/list/hr) without
// pulling in a real MDX runtime.

const POSTS = [
  {
    slug: "next16-app-router-migration",
    title: "Next.js 16 App Router로 블로그를 옮기며 배운 것들",
    description: "정적 export 환경에서 App Router·next-mdx-remote·Shiki로 SSG 파이프라인을 다시 짜고, 빌드 시간을 1/3로 줄인 과정.",
    date: "2026-05-09",
    category: "dev",
    tags: ["next.js", "app-router", "mdx", "shiki", "ssg"],
    readMin: 12,
    cover: true,
    featured: true,
    body: [
      { type: "lede", text: "Pages Router에서 App Router로 옮기는 데 두 주가 걸렸다. 절반은 코드 마이그레이션, 절반은 머릿속에 박힌 데이터 흐름 모델을 다시 그리는 데 들었다. 이 글은 같은 길을 가는 분들에게 보내는 메모이자, 미래의 나에게 남기는 변경 일지다." },
      { type: "h2", text: "왜 옮겼나" },
      { type: "p", text: "v1 블로그는 Pages Router + getStaticProps로 시작했다. 정적 export(`output: \"export\"`)만 쓰는 정도라면 사실 굳이 옮길 필요는 없다. 그래도 옮긴 이유는 세 가지였다:" },
      { type: "ul", items: [
        "MDX 컴포넌트를 RSC로 한 번에 트리쉐이킹하고 싶었다.",
        "라우트별 코드 분할이 더 자연스러워졌다. Pages 시절의 `_app`/`_document` 더미가 사라진다.",
        "`generateStaticParams`가 frontmatter 기반 빌드와 합이 좋다. 라우트 메타와 콘텐츠 메타가 한 파일에서 끝난다."
      ]},
      { type: "h2", text: "정적 export에서 주의할 것" },
      { type: "p", text: "App Router를 쓰더라도 `output: \"export\"`를 켜는 순간, **사용할 수 없는 API**가 늘어난다. 미들웨어, 이미지 옵티마이저, 서버 액션, `cookies()/headers()`, ISR — 전부 쓸 수 없다. 빌드 시 모든 라우트가 정적 HTML로 떨어져야 한다는 단순한 규칙을 잊으면 안 된다." },
      { type: "code", lang: "ts", filename: "next.config.ts", lines: [
        [["k","import "],["k","type "],["p","{ "],["t","NextConfig"],["p"," } "],["k","from "],["s","\"next\""]],
        [],
        [["k","const "],["v","config"],["p",": "],["t","NextConfig"],["p"," = "],["p","{"]],
        [["p","  "],["v","output"],["p",": "],["s","\"export\""],["p",","]],
        [["p","  "],["v","trailingSlash"],["p",": "],["b","true"],["p",","]],
        [["p","  "],["v","images"],["p",": { "],["v","unoptimized"],["p",": "],["b","true"],["p"," },"]],
        [["p","  "],["v","experimental"],["p",": { "],["v","mdxRs"],["p",": "],["b","false"],["p"," },"]],
        [["p","}"]],
        [],
        [["k","export default "],["v","config"]]
      ]},
      { type: "p", text: "`mdxRs`(Rust 기반 MDX 컴파일러)는 매력적이지만, 우리는 `next-mdx-remote`로 빌드 타임 렌더링을 선택했다. 이유는 다음 섹션에서." },
      { type: "h2", text: "MDX 파이프라인 다시 그리기" },
      { type: "p", text: "글의 출처는 단순하다. `content/posts/*.mdx` 파일들. 빌드 시 한 번 읽어, 메타와 본문을 갈라 정적 사이트맵과 RSS를 만든다. 핵심은 frontmatter 스키마를 코드 한 곳에 잠가두는 것이다." },
      { type: "code", lang: "ts", filename: "lib/content.ts", lines: [
        [["k","import "],["v","fs"],["k"," from "],["s","\"node:fs/promises\""]],
        [["k","import "],["v","path"],["k"," from "],["s","\"node:path\""]],
        [["k","import "],["v","matter"],["k"," from "],["s","\"gray-matter\""]],
        [["k","import "],["p","{ "],["v","z"],["p"," }"],["k"," from "],["s","\"zod\""]],
        [],
        [["k","const "],["t","Frontmatter"],["p"," = "],["f","z.object"],["p","({"]],
        [["p","  "],["v","title"],["p",": "],["f","z.string"],["p","(),"]],
        [["p","  "],["v","description"],["p",": "],["f","z.string"],["p","(),"]],
        [["p","  "],["v","date"],["p",": "],["f","z.string"],["p","()."],["f","datetime"],["p","(),"]],
        [["p","  "],["v","category"],["p",": "],["f","z.enum"],["p","(["],["s","\"news\""],["p",", "],["s","\"dev\""],["p",", "],["s","\"retrospective\""],["p",", "],["s","\"release\""],["p",", "],["s","\"etc\""],["p","]),"]],
        [["p","  "],["v","tags"],["p",": "],["f","z.array"],["p","("],["f","z.string"],["p","())."],["f","default"],["p","([]),"]],
        [["p","  "],["v","cover"],["p",": "],["f","z.string"],["p","()."],["f","optional"],["p","(),"]],
        [["p","})"]],
        [],
        [["c","// 한 번 파싱하면 어디서든 같은 타입을 본다."]],
        [["k","export type "],["t","Post"],["p"," = "],["f","z.infer"],["p","<"],["k","typeof "],["t","Frontmatter"],["p","> & { "],["v","slug"],["p",": "],["t","string"],["p"," }"]]
      ]},
      { type: "h3", text: "Shiki를 빌드 타임에 박아두기" },
      { type: "p", text: "v1에선 Prism을 썼다. 토큰화 결과가 충분히 좋지 않았고, 한국어 주석과 영어 코드가 섞이는 빈도가 높아 폭이 흐트러지는 게 컸다. v2에선 Shiki를 빌드 타임 hast 변환으로 박아 클라이언트 번들에서 완전히 제거했다." },
      { type: "code", lang: "ts", filename: "lib/mdx.ts", lines: [
        [["k","import "],["v","rehypeShiki"],["k"," from "],["s","\"@shikijs/rehype\""]],
        [["k","import "],["v","remarkGfm"],["k"," from "],["s","\"remark-gfm\""]],
        [],
        [["k","export const "],["v","mdxOptions"],["p"," = {"]],
        [["p","  "],["v","remarkPlugins"],["p",": ["],["v","remarkGfm"],["p","],"]],
        [["p","  "],["v","rehypePlugins"],["p",": ["]],
        [["p","    ["],["v","rehypeShiki"],["p",", { "],["v","themes"],["p",": { "],["v","dark"],["p",": "],["s","\"vesper\""],["p"," }, "],["v","defaultColor"],["p",": "],["b","false"],["p"," }]"]],
        [["p","  ],"]],
        [["p","}"]]
      ]},
      { type: "h2", text: "Reading Progress와 TOC 다시 만들기" },
      { type: "p", text: "둘 다 v1에는 있던 기능이지만, App Router의 RSC 경계에서 흐름이 달랐다. 결국 같은 답이었다: **본문은 서버 컴포넌트, 인터랙션 레이어만 클라이언트로**." },
      { type: "blockquote", text: "Reading progress는 본문의 스크롤이 아니라 사용자의 시간을 시각화한다. 그 차이를 잊지 말 것." },
      { type: "p", text: "스크롤 진행률 자체는 `IntersectionObserver`로도 만들 수 있지만, 첫 화면에서 정확히 0%, 마지막 단락이 뷰포트에 잡힐 때 100%가 되도록 보정하는 게 의외로 까다롭다. 결국 본문 컨테이너의 bounding rect를 직접 계산하는 방식으로 돌아왔다." },
      { type: "h2", text: "결과" },
      { type: "ul", items: [
        "콜드 빌드 23s → 7.4s (글 60편 기준)",
        "JS 번들 84KB → 31KB (gzip)",
        "Lighthouse Performance 88 → 99"
      ]},
      { type: "p", text: "수치 자체보다 마음에 드는 건, 본문 페이지에서 클라이언트 자바스크립트의 책임이 명확해진 것이다. TOC, 코드 복사, reading progress — 그게 전부다. 나머지는 전부 HTML." },
      { type: "hr" },
      { type: "p", text: "다음 글에서는 이 위에 얹은 검색(빌드 타임 인덱스 + Fuse.js)과 RSS의 idempotent 생성을 다뤄볼 생각이다." }
    ]
  },

  {
    slug: "2026-spring-retrospective",
    title: "2026 봄, 글을 다시 쓰기 시작했다",
    description: "작년 가을부터 멈춰 있던 블로그를 다시 켰다. 짧은 글이 더 많아질 예정.",
    date: "2026-05-02",
    category: "retrospective",
    tags: ["retro", "writing"],
    readMin: 4,
    body: [
      { type: "lede", text: "여덟 달을 비워뒀다. 그동안 쓴 글은 노션 한구석에 흩어져 있었고, 다시 모아 정리하는 데만 사흘이 걸렸다." },
      { type: "p", text: "왜 멈췄는지 답은 뻔하다 — 회사 일이 바빴고, 글을 쓰는 데 필요한 에너지가 정확히 회사 일에 들어가는 그것과 같은 종류였다. 매번 더 좋은 글을 쓰려다 보니, 매번 시작하지 못했다." },
      { type: "h2", text: "규칙 세 가지" },
      { type: "ol", items: [
        "주 1편. 길어도 좋고 짧아도 좋다. 빠지는 주는 메모로 대체.",
        "초안은 한 번에 끝낸다. 다듬기는 다음 날 30분.",
        "남이 안 읽어도 괜찮다. 한 달 뒤의 내가 검색해서 도움을 받으면 된다."
      ]},
      { type: "p", text: "이 글이 첫 번째다. 두 번째도 곧." }
    ]
  },

  {
    slug: "shiki-with-tailwind-v4",
    title: "Tailwind v4 @theme로 Shiki 토큰 색을 잠그는 법",
    description: "Shiki 테마 색을 CSS 변수로 추출해, 라이트/다크 토글이 가능한 코드블록을 만들기.",
    date: "2026-04-21",
    category: "dev",
    tags: ["tailwind", "shiki", "css", "theming"],
    readMin: 8,
    body: [
      { type: "lede", text: "Tailwind v4의 `@theme` 블록은 결국 CSS 변수 묶음이다. Shiki도 v1.0부터 `themes.{light,dark}` 두 벌을 한 번에 받아서 토큰별 변수를 만들어준다. 둘을 합치면 코드블록을 테마 토글에 묶을 수 있다." },
      { type: "h2", text: "토큰을 변수로 받기" },
      { type: "p", text: "`@shikijs/rehype`에 `defaultColor: false`를 넣으면, 각 토큰이 `style=\"--shiki-light: ...; --shiki-dark: ...;\"` 형태로 떨어진다. 우리가 하면 되는 건, 그 변수를 우리 테마 토큰에 매핑하는 일뿐." },
      { type: "code", lang: "css", filename: "app/globals.css", lines: [
        [["c","/* 1. Shiki가 만들어둔 토큰을 우리 토큰으로 라우팅 */"]],
        [["k","[data-theme="],["s","\"dark\""],["k","] "],["t","pre"],["p"," {"]],
        [["p","  "],["v","color"],["p",": "],["f","var"],["p","(--shiki-dark);"]],
        [["p","  "],["v","background"],["p",": "],["f","var"],["p","(--shiki-dark-bg);"]],
        [["p","}"]],
        [["k","[data-theme="],["s","\"dark\""],["k","] "],["t","span"],["p"," { "],["v","color"],["p",": "],["f","var"],["p","(--shiki-dark); }"]]
      ]},
      { type: "h2", text: "주의: 폰트 폭과 한국어" },
      { type: "p", text: "JetBrains Mono는 한글에 글리프가 없어, 한글 주석은 보통 시스템 폰트로 fallback된다. 폭이 정확히 1.5em으로 정렬되지 않으면 줄번호가 어긋난다. `font-feature-settings`로 `calt`만 꺼두는 것보다, 한글 mono fallback(`Noto Sans Mono CJK`)을 지정하는 편이 깔끔하다." }
    ]
  },

  {
    slug: "release-v2",
    title: "v2.0 — 리브랜딩, MDX, 그리고 새로운 카테고리",
    description: "거의 모든 것이 바뀌었습니다. 글은 그대로, 옷만 다시.",
    date: "2026-04-14",
    category: "release",
    tags: ["release", "redesign"],
    readMin: 3,
    body: [
      { type: "lede", text: "v2.0을 배포했습니다. 외형은 다시 그렸고, 안쪽은 거의 새로 짰습니다. 글은 모두 그대로 있습니다." },
      { type: "h2", text: "바뀐 것" },
      { type: "ul", items: [
        "다크 단일 테마 — 의도된 어둠",
        "Fraunces · Syne · JetBrains Mono 조합",
        "카테고리 다섯 가지: news / dev / retrospective / release / etc",
        "코드블록 컨테이너, 파일명, 복사 버튼",
        "TOC, Reading Progress",
        "RSS, 검색은 다음 마이너 버전에서"
      ]}
    ]
  },

  {
    slug: "ai-pair-coding-2026",
    title: "AI와 함께 코드를 짠 1년, 무엇이 남았나",
    description: "2025년의 페어 코딩 습관이 2026년에 어떻게 굳어졌는지, 그리고 무엇이 안 통했는지에 대한 메모.",
    date: "2026-04-03",
    category: "news",
    tags: ["ai", "workflow", "tools"],
    readMin: 9,
    body: [
      { type: "lede", text: "도구가 일을 빠르게 해주는 건 더 이상 새로울 게 없다. 다만 어떤 일은 더 느리게, 어떤 일은 아예 다른 모양이 됐다." },
      { type: "p", text: "이 글은 자랑이 아니라 손해 보고서에 가깝다. 어떤 것을 잃었고 어떤 것을 얻었는지." }
    ]
  },

  {
    slug: "writing-monorepo-tools",
    title: "사내 모노레포 도구를 다시 디자인하며",
    description: "200개가 넘는 패키지가 사는 리포지토리에서 도구의 UX는 어떻게 달라야 하는가.",
    date: "2026-03-22",
    category: "dev",
    tags: ["dx", "monorepo", "tooling"],
    readMin: 11,
    body: [
      { type: "lede", text: "도구의 가장 중요한 사용자는 도구를 잘 다루지 못하는 동료다. 누가 어떻게 쓰는지 모르면, 옵션은 항상 한 개 더 많다." }
    ]
  },

  {
    slug: "thoughts-on-naming",
    title: "이름 짓기에 대한 짧은 메모",
    description: "함수, 변수, 그리고 글의 제목까지 — 이름이 본문보다 오래 살아남는 일에 대해.",
    date: "2026-03-10",
    category: "etc",
    tags: ["writing", "craft"],
    readMin: 5,
    body: [
      { type: "lede", text: "이름은 본문보다 오래 산다. 본문은 고치면 사라지지만, 이름은 어딘가의 import 문에, 누군가의 즐겨찾기에, 검색 결과에 남는다." }
    ]
  },

  {
    slug: "release-v1-9",
    title: "v1.9 — 검색, 코드 복사, 새 폰트",
    description: "마지막 v1 마이너 릴리스. 검색이 빌드 타임 인덱스로 들어왔습니다.",
    date: "2026-02-28",
    category: "release",
    tags: ["release"],
    readMin: 2,
    body: [
      { type: "lede", text: "v2 작업과 별개로 마지막 v1을 올렸습니다. 검색이 마침내 들어왔습니다." }
    ]
  },

  {
    slug: "rsc-mental-model",
    title: "React Server Components, 두 번째 멘탈 모델",
    description: "처음 도입할 때 만든 멘탈 모델은 6개월 만에 절반쯤 틀린 것이 됐다. 다시 그리며 정리한 메모.",
    date: "2026-02-15",
    category: "dev",
    tags: ["react", "rsc", "next.js"],
    readMin: 14,
    body: [
      { type: "lede", text: "RSC를 '서버에서 렌더되는 컴포넌트'로 이해하던 시기가 있었다. 정확하지만 쓸모가 적은 정의였다." }
    ]
  },

  {
    slug: "kr-typography-on-web",
    title: "한국어 웹 타이포그래피, 실전에서 신경 쓰는 것들",
    description: "Noto Sans KR과 Fraunces 같은 영문 디스플레이체를 같이 쓸 때 자주 마주치는 문제들.",
    date: "2026-02-01",
    category: "dev",
    tags: ["typography", "css", "korean"],
    readMin: 7,
    body: [
      { type: "lede", text: "영문 디스플레이체 옆에 놓이는 순간 한국어는 더 작아 보인다. 그 착시를 어떻게 다룰지." }
    ]
  },

  {
    slug: "year-in-review-2025",
    title: "2025, 무엇이 진짜였나",
    description: "한 해 동안 쓴 47편의 글, 닫은 35개의 PR, 그리고 살아남은 다섯 가지 습관.",
    date: "2026-01-04",
    category: "retrospective",
    tags: ["retro", "year-end"],
    readMin: 16,
    body: [
      { type: "lede", text: "한 해가 끝나면 뭐가 남았는지 세는 게 습관이 됐다. 숫자보단 습관을 세는 게 더 정확하다는 걸 이번에도 확인했다." }
    ]
  },

  {
    slug: "small-tools-i-built",
    title: "올해 짧게 만든 작은 도구 다섯 개",
    description: "100줄 미만, 하루 안에 끝낸, 그러나 매주 쓰고 있는 도구들.",
    date: "2025-12-20",
    category: "etc",
    tags: ["tools", "side"],
    readMin: 6,
    body: [
      { type: "lede", text: "큰 프로젝트 다섯 개보다 100줄짜리 다섯 개가 일상을 더 많이 바꾼 한 해였다." }
    ]
  }
];

const CATEGORIES = [
  { id: "all",            label: "All",            color: "var(--color-text)" },
  { id: "news",           label: "News",           color: "var(--cat-news)" },
  { id: "dev",            label: "Dev",            color: "var(--cat-dev)" },
  { id: "retrospective",  label: "Retrospective",  color: "var(--cat-retrospective)" },
  { id: "release",        label: "Release",        color: "var(--cat-release)" },
  { id: "etc",            label: "etc",            color: "var(--cat-etc)" }
];

window.POSTS = POSTS;
window.CATEGORIES = CATEGORIES;
