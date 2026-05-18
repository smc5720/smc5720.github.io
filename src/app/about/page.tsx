import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { SectionHead } from "@/components/SectionHead";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { PostMeta } from "@/types/post";

export const metadata = {
  title: "About",
  description: "RicoCheese — Frontend & Design Engineer. 한 사람이 만들고 운영하는 작은 작업실.",
};

// ──────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────

const NOW_ITEMS = [
  {
    bucket: "Building",
    status: "● in-flight",
    color: "var(--color-accent)",
    title: "사내 모노레포 도구 v3 — 200+ 패키지의 일관된 개발 경험",
    body: "Turbo, pnpm workspaces, codegen 파이프라인을 한 곳에서 다루는 작은 GUI 도구. 동료 다섯 명과 사내 dogfooding 중입니다.",
  },
  {
    bucket: "Writing",
    status: "● weekly cadence",
    color: "var(--color-accent)",
    title: "주 1편 · 짧아도 좋고 길어도 좋다",
    body: "v2 리브랜딩 이후 한 주에 한 편의 글을 올리는 리듬을 잡고 있습니다. 다음 글 후보는 RSC 두 번째 멘탈 모델, 그리고 한국어 타이포 실전 메모.",
  },
  {
    bucket: "Reading",
    status: "○ on the desk",
    color: "var(--color-purple)",
    title: "<<쓰지 않으면 사라지는 것들>> · 빌 와츠",
    body: "잘 쓰는 사람의 글이 아니라, 매일 쓰는 사람의 노트에 관한 책. 작년 '일기 30일 챌린지' 이후로 가끔 다시 꺼내 봅니다.",
  },
  {
    bucket: "Learning",
    status: "○ slow burn",
    color: "var(--color-purple)",
    title: "Rust · 빌드 도구의 안쪽을 들여다 보려고",
    body: "직접 프로덕션에 쓰진 않지만, 우리가 매일 쓰는 도구의 안쪽이 어떻게 굴러가는지 이해해보려고 합니다.",
  },
  {
    bucket: "Resting",
    status: "○ off the grid",
    color: "var(--color-text-2)",
    title: "주말의 산책, 그리고 오래된 라디오 방송 듣기",
    body: "주말 두 시간은 화면 없이 보내려고 합니다. 매번 성공하는 건 아니지만.",
  },
];

const INTERESTS = [
  {
    tag: "TYPOGRAPHY",
    color: "var(--color-accent)",
    title: "한국어 본문 타이포그래피",
    body: "Noto Sans KR + 영문 디스플레이체를 같이 쓸 때 마주치는 베이스라인·자간·자형 폭 문제에 관심이 많습니다.",
    refs: ["#typography", "#korean", "#css"],
  },
  {
    tag: "BUILD",
    color: "var(--cat-news)",
    title: "정적 사이트 빌드 파이프라인",
    body: "MDX·Shiki·sitemap·RSS·OG 이미지까지 빌드 타임 안에 모두 결정 짓는 단순한 파이프라인을 좋아합니다.",
    refs: ["#next.js", "#mdx", "#shiki"],
  },
  {
    tag: "DX",
    color: "var(--cat-release)",
    title: "내부 도구의 작은 UX",
    body: "CLI 한 줄, 에러 메시지 한 줄, 빌드 로그 한 줄. 가장 자주 보는 곳일수록 신경 써야 한다고 믿습니다.",
    refs: ["#dx", "#tooling", "#monorepo"],
  },
  {
    tag: "WRITING",
    color: "var(--color-purple)",
    title: "쓰면서 생각하기",
    body: "글이 사고를 따라가는 게 아니라, 글이 사고를 압축한다고 생각합니다. 그래서 메모는 항상 글의 형태로 남깁니다.",
    refs: ["#writing", "#retro"],
  },
  {
    tag: "TOOLS",
    color: "var(--cat-news)",
    title: "100줄짜리 작은 도구들",
    body: "큰 프로젝트 다섯 개보다 작은 도구 다섯 개가 매일의 일을 더 많이 바꿉니다.",
    refs: ["#tools", "#side"],
  },
  {
    tag: "DESIGN ENG",
    color: "var(--color-accent)",
    title: "디자인과 코드 사이",
    body: "디자인 결정의 8할은 코드에서 끝납니다. 그래서 디자인 토큰이 어떻게 변수에 옮겨지는지가 중요합니다.",
    refs: ["#design-eng", "#tokens"],
  },
];

const STACK = [
  {
    label: "Language",
    items: [
      { name: "TypeScript", note: "strict", daily: true, years: "7Y" },
      { name: "JavaScript", note: "es-next", daily: true, years: "10Y" },
      { name: "CSS", note: "v4 / @theme", daily: true, years: "10Y" },
      { name: "Rust", note: "learning", daily: false, years: "1Y" },
      { name: "Python", note: "scripting", daily: false, years: "4Y" },
    ],
  },
  {
    label: "Frameworks · runtime",
    items: [
      { name: "React", note: "18 → 19", daily: true, years: "7Y" },
      { name: "Next.js", note: "16 · app router", daily: true, years: "5Y" },
      { name: "Tailwind CSS", note: "v4", daily: true, years: "4Y" },
      { name: "Vite · Vitest", note: "tooling", daily: false, years: "3Y" },
      { name: "Astro", note: "occasional", daily: false, years: "2Y" },
    ],
  },
  {
    label: "Design · craft",
    items: [
      { name: "Figma", note: "tokens · dev mode", daily: true, years: "6Y" },
      { name: "Linear", note: "issues", daily: true, years: "4Y" },
      { name: "Obsidian", note: "notes", daily: true, years: "3Y" },
      { name: "Affinity Designer", note: "vectors", daily: false, years: "3Y" },
    ],
  },
  {
    label: "Editor · daily",
    items: [
      { name: "Cursor", note: "primary", daily: true, years: "1Y" },
      { name: "VS Code", note: "secondary", daily: true, years: "8Y" },
      { name: "Vim", note: "still in muscle memory", daily: false, years: "10Y" },
      { name: "iTerm2", note: "+ fish + starship", daily: true, years: "5Y" },
    ],
  },
];

const COLOPHON: [string, string][] = [
  ["FRAMEWORK", "Next.js 16 · App Router · output: export"],
  ["STYLING", "Tailwind CSS v4 · @theme tokens"],
  ["CONTENT", "MDX · next-mdx-remote · gray-matter"],
  ["HIGHLIGHT", "Shiki · vesper (custom palette)"],
  ["FONTS", "Fraunces · Syne · JetBrains Mono · Noto KR"],
  ["HOSTING", "GitHub Pages · auto-deploy on main push"],
  ["LICENSE", "writing CC BY 4.0 · code MIT"],
  ["ANALYTICS", "none. seriously, none."],
];

const ELSEWHERE = [
  {
    label: "GITHUB",
    handle: "smc5720",
    note: "code · contributions · sometimes issues",
    href: "https://github.com/smc5720",
  },
  {
    label: "TWITTER",
    handle: "@ricocheese",
    note: "short notes, mostly about typography",
    href: "https://twitter.com/ricocheese",
  },
  {
    label: "READING",
    handle: "are.na/ricocheese",
    note: "what I am collecting this season",
    href: "https://www.are.na/ricocheese",
  },
  {
    label: "MAIL",
    handle: "hello@ricocheese.dev",
    note: "best for long-form questions",
    href: "mailto:hello@ricocheese.dev",
  },
];

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

function ProfileCard() {
  return (
    <aside className="profile-sticky">
      <div
        style={{
          border: "1px solid var(--color-border-2)",
          background: "var(--color-surface)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Portrait placeholder — no image-slot web component */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            border: "1px solid var(--color-border)",
            overflow: "hidden",
            background: "var(--color-surface-2)",
          }}
        >
          <span
            className="mono-label"
            style={{
              position: "absolute",
              left: 10,
              top: 10,
              padding: "3px 6px",
              background: "var(--color-scrim)",
              backdropFilter: "blur(4px)",
            }}
          >
            FIG · A
          </span>
          <span
            className="mono-label tabular"
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
              padding: "3px 6px",
              background: "var(--color-scrim)",
              backdropFilter: "blur(4px)",
              color: "var(--color-accent)",
            }}
          >
            ● LIVE
          </span>
        </div>

        <div>
          <div className="mono-label" style={{ marginBottom: 6 }}>
            NAME / ROLE
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 24,
              letterSpacing: "-.012em",
              lineHeight: 1.1,
            }}
          >
            송민철
          </div>
          <div className="small" style={{ color: "var(--color-text-2)", marginTop: 2 }}>
            Frontend · Design Engineer
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {(
            [
              ["LOCATION", "서울 · UTC+9"],
              ["DAY JOB", "Developer Tooling · 모노레포"],
              ["WRITING", "since 2022"],
              ["PRONOUNS", "he / him"],
              ["KEYBOARD", "HHKB Pro · JIS / KR"],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "84px 1fr",
                gap: 12,
                alignItems: "baseline",
              }}
            >
              <span className="mono-label" style={{ color: "var(--color-text-3)" }}>
                {k}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-text)" }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            borderTop: "1px solid var(--color-border)",
            paddingTop: 12,
          }}
        >
          <a
            href="mailto:hello@ricocheese.dev"
            className="btn"
            style={{ height: 36, padding: "0 12px", flex: 1, justifyContent: "center" }}
          >
            Email
          </a>
          <a
            href="https://github.com/smc5720"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ height: 36, padding: "0 12px", flex: 1, justifyContent: "center" }}
          >
            GitHub
          </a>
        </div>
      </div>

      <pre
        aria-hidden
        className="ascii-box"
        style={{
          margin: "18px 0 0",
          color: "var(--color-text-3)",
          fontSize: 10,
          lineHeight: 1.3,
          textAlign: "center",
        }}
      >{`        ╲   ╱
   ─── ◇ ───
   ricocheese
   ◣ studio log`}</pre>
    </aside>
  );
}

function NowRow({
  item,
  index,
}: {
  item: (typeof NOW_ITEMS)[number];
  index: number;
}) {
  const notFirst = index > 0;
  return (
    <>
      <div
        style={{
          padding: "24px 24px 24px 0",
          borderTop: notFirst ? "1px solid var(--color-border)" : "none",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
          {String(index + 1).padStart(2, "0")} · {item.bucket}
        </span>
        <span className="mono-label" style={{ color: item.color }}>
          {item.status}
        </span>
      </div>
      <div
        style={{
          padding: "24px 0 24px 32px",
          borderTop: notFirst ? "1px solid var(--color-border)" : "none",
          borderLeft: "1px solid var(--color-border-2)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 24,
            lineHeight: 1.2,
            letterSpacing: "-.01em",
            marginBottom: 6,
          }}
        >
          {item.title}
        </div>
        <p className="small" style={{ maxWidth: 640 }}>
          {item.body}
        </p>
      </div>
    </>
  );
}

function InterestCard({
  item,
  index,
}: {
  item: (typeof INTERESTS)[number];
  index: number;
}) {
  const isLastInRow = index % 3 === 2;
  return (
    <div
      style={{
        borderRight: !isLastInRow ? "1px solid var(--color-border-2)" : "none",
        borderBottom: "1px solid var(--color-border-2)",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minHeight: 220,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="mono-label" style={{ color: item.color }}>
          {item.tag}
        </span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 28,
          lineHeight: 1.12,
          letterSpacing: "-.015em",
          color: "var(--color-text)",
          fontWeight: 380,
        }}
      >
        {item.title}
      </div>
      <p className="small" style={{ marginTop: -6 }}>
        {item.body}
      </p>
      <div style={{ marginTop: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {item.refs.map((r) => (
          <span key={r} className="badge badge-tag">
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function StackGroup({ group }: { group: (typeof STACK)[number] }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div className="mono-label">{group.label}</div>
        <div className="mono-label" style={{ color: "var(--color-text-3)" }}>
          {String(group.items.length).padStart(2, "0")}
        </div>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {group.items.map((it) => (
          <li
            key={it.name}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
              padding: "12px 0",
              borderTop: "1px solid var(--color-border)",
              alignItems: "baseline",
            }}
          >
            <div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--color-text)" }}>
                {it.name}
                {it.daily && (
                  <span style={{ color: "var(--color-accent)", marginLeft: 6 }}>*</span>
                )}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--color-text-3)",
                  marginLeft: 10,
                  letterSpacing: ".06em",
                }}
              >
                {it.note}
              </span>
            </div>
            <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
              {it.years}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WritingRow({ post }: { post: PostMeta }) {
  const date = new Date(post.date);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

  return (
    <Link href={`/blog/${post.slug}`} className="about-writing-row">
      <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
        {dateStr}
      </span>
      <CategoryBadge category={post.category} size="sm" />
      <span className="about-writing-title">{post.title}</span>
      <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
        {post.readingTime}min →
      </span>
    </Link>
  );
}

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const posts = getAllPosts();
  const selectedPosts = posts.slice(0, 4);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section
        style={{
          paddingTop: 32,
          paddingBottom: 40,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <nav className="mono-label" aria-label="Breadcrumb" style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "var(--color-text-3)" }}>BREADCRUMB</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span style={{ color: "var(--color-text-3)" }}>RICOCHEESE</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span style={{ color: "var(--color-text)" }}>ABOUT</span>
            </nav>
            <div className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
              REV. 2026.05 · LIVE
            </div>
          </div>

          <div className="about-hero-grid">
            <h1
              className="display"
              style={{
                fontSize: "clamp(48px, 7vw, 116px)",
                margin: 0,
                letterSpacing: "-.022em",
                lineHeight: 0.98,
              }}
            >
              <span style={{ fontStyle: "italic", color: "var(--color-text-2)" }}>About</span>,
              <br />
              briefly<span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
            <p className="lede" style={{ maxWidth: 460, color: "var(--color-text-2)" }}>
              한 사람이 만들고 운영하는 작은 작업실. 이 페이지는{" "}
              <span style={{ color: "var(--color-text)" }}>지금 무엇을 만들고 있는지</span>, 어떤
              도구를 어떻게 쓰는지, 그리고 어디서 더 볼 수 있는지를 정리해 둔 자리입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ===== §01 Intro + ProfileCard ===== */}
      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="container">
          <div className="about-intro-grid">
            <ProfileCard />

            <div className="prose" style={{ counterReset: "h2" }}>
              <div className="mono-label" style={{ marginBottom: 16 }}>
                § 01 · intro
              </div>
              <p className="lede" style={{ color: "var(--color-text)", maxWidth: 640 }}>
                안녕하세요,{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>송민철</span>
                입니다. 서울에서 일하는 프론트엔드/디자인 엔지니어이고, 인터넷에서는 보통{" "}
                <span style={{ color: "var(--color-accent)" }}>RicoCheese</span>라는 이름을 씁니다.
                이 블로그는 제가 일하면서 배운 것, 만들어 본 것, 가끔은 실패한 것을 정리해두는
                작업실 일지입니다.
              </p>
              <p>
                일은 보통 <strong>웹 인터페이스</strong>를 만드는 일입니다. 디자인 시스템, 빌드
                파이프라인, 그리고 한국어를 잘 다루는 타이포그래피에 시간을 가장 많이 씁니다. 좋은
                도구를 만드는 일은 결국 동료의 시간을 줄여주는 일이고, 그게 제가 이 직업에서 가장
                좋아하는 부분입니다.
              </p>
              <p>
                글을 쓰는 이유는 단순합니다 —{" "}
                <em>한 달 뒤의 제가 검색해서 도움을 받기 위해서</em>입니다. 그렇게 쓰다 보니 가끔은
                다른 분에게도 닿더라고요. 그게 부수적인 즐거움입니다.
              </p>
              <p>
                지금까지 일한 곳은 두 곳입니다. 첫 회사에서는 사내 디자인 시스템을 처음부터
                만들었고, 지금 회사에서는 200개가 넘는 패키지가 사는 모노레포의 개발자 도구를 다시
                디자인하고 있습니다. 둘 다 "도구의 가장 중요한 사용자는 도구를 잘 다루지 못하는
                동료"라는 같은 결론에 닿아 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== §02 Now ===== */}
      <section style={{ paddingTop: 32, paddingBottom: 96, position: "relative" }}>
        <div className="container">
          <SectionHead
            num="02"
            kicker="Now · spring 2026"
            title="이번 분기에 매달리는 것들"
            right={
              <div className="mono-label tabular" style={{ display: "flex", gap: 14 }}>
                <span style={{ color: "var(--color-text-3)" }}>LAST UPDATED</span>
                <span>2026.05.09</span>
              </div>
            }
          />
          <div className="now-grid">
            {NOW_ITEMS.map((it, i) => (
              <NowRow key={it.bucket} item={it} index={i} />
            ))}
          </div>
          <div className="mono-label" style={{ marginTop: 16, color: "var(--color-text-3)" }}>
            이 섹션은{" "}
            <a
              className="link link-mono"
              href="https://nownownow.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--color-text-2)", borderBottom: "1px solid var(--color-border-2)" }}
            >
              /now
            </a>{" "}
            컨벤션을 따릅니다 — 한 달 단위로 정리합니다.
          </div>
        </div>
      </section>

      {/* ===== §03 Interests ===== */}
      <section style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div className="container">
          <SectionHead num="03" kicker="Interests" title="요즘 자주 생각하는 주제들" />
          <div className="interest-grid">
            {INTERESTS.map((it, i) => (
              <InterestCard key={it.title} item={it} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== §04 Stack ===== */}
      <section style={{ paddingTop: 32, paddingBottom: 96 }}>
        <div className="container">
          <SectionHead
            num="04"
            kicker="Stack · tools of the trade"
            title="지금 손에 익은 도구들"
            right={
              <div className="mono-label" style={{ color: "var(--color-text-3)" }}>
                * = 매일 씀
              </div>
            }
          />
          <div className="stack-grid">
            {STACK.map((group) => (
              <StackGroup key={group.label} group={group} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== §05 Selected Writing ===== */}
      <section style={{ paddingTop: 32, paddingBottom: 96 }}>
        <div className="container">
          <SectionHead
            num="05"
            kicker="Selected writing"
            title="시작점으로 좋은 글 몇 편"
            right={
              <Link href="/blog" className="arrow-link">
                <span>All essays</span>
                <span className="arrow" />
              </Link>
            }
          />
          <div className="about-writing-list">
            {selectedPosts.map((p) => (
              <WritingRow key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== §06 Pull Quote + Colophon ===== */}
      <section style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div className="container">
          <div className="quote-colophon-grid">
            <blockquote
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 3.4vw, 48px)",
                lineHeight: 1.18,
                letterSpacing: "-.018em",
                color: "var(--color-text)",
                fontWeight: 360,
              }}
            >
              <span style={{ color: "var(--color-accent)", marginRight: 4 }}>"</span>
              좋은 도구를 만드는 일은 결국 동료의 시간을 줄여주는 일이다
              <span style={{ color: "var(--color-accent)" }}>.</span>{" "}
              <span style={{ color: "var(--color-text-2)" }}>
                그게 내가 이 직업에서 가장 좋아하는 부분.
              </span>
            </blockquote>

            <div>
              <div className="mono-label" style={{ marginBottom: 16 }}>
                Colophon
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {COLOPHON.map(([k, v]) => (
                  <li
                    key={k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: 16,
                      alignItems: "baseline",
                      borderBottom: "1px dashed var(--color-border)",
                      paddingBottom: 8,
                    }}
                  >
                    <span className="mono-label" style={{ color: "var(--color-text-3)" }}>
                      {k}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--color-text)",
                      }}
                    >
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== §07 Elsewhere ===== */}
      <section style={{ paddingTop: 0, paddingBottom: 120 }}>
        <div className="container">
          <SectionHead num="06" kicker="Elsewhere · say hi" title="어디서 더 찾을 수 있나요" />
          <div className="elsewhere-grid">
            {ELSEWHERE.map((e) => (
              <a
                key={e.label}
                href={e.href}
                className="elsewhere-card"
                target={e.href.startsWith("http") ? "_blank" : undefined}
                rel={e.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
                >
                  <span className="mono-label">{e.label}</span>
                  <span className="mono-label" style={{ color: "var(--color-text-3)" }}>
                    ↗
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    lineHeight: 1.2,
                    letterSpacing: "-.01em",
                  }}
                >
                  {e.handle}
                </div>
                <div className="small" style={{ color: "var(--color-text-2)" }}>
                  {e.note}
                </div>
              </a>
            ))}
          </div>

          <div
            style={{
              marginTop: 64,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 24,
              alignItems: "end",
              borderTop: "1px solid var(--color-border-2)",
              paddingTop: 32,
            }}
          >
            <div>
              <div className="mono-label" style={{ marginBottom: 14 }}>
                If you want to write back
              </div>
              <div className="display display-h2" style={{ margin: 0 }}>
                <a href="mailto:hello@ricocheese.dev" style={{ color: "var(--color-text)" }}>
                  hello@ricocheese.dev
                </a>
              </div>
            </div>
            <Link href="/blog" className="btn btn-primary">
              <span>Read the essays</span>
              <span style={{ opacity: 0.6 }}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
