import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import { SectionHead } from "@/components/SectionHead";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { PostMeta } from "@/types/post";

export const metadata = {
  title: "About",
  description: "RicoCheese — Backend Engineer. 코드, 회고, 릴리스 노트를 기록하는 기술 블로그.",
};

// ──────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────

const NOW_ITEMS = [
  {
    bucket: "Building",
    status: "● in-flight",
    color: "var(--color-accent)",
    title: "개인 토이 프로젝트를 하나씩 만들어 가는 중",
    body: "업무에서 반복적인 작업을 마주칠 때마다 자동화 아이디어가 쌓입니다. 그 중 몇 가지를 개인 프로젝트로 꺼내 직접 만들어보고 있습니다. 이 블로그도 그 중 하나입니다.",
  },
  {
    bucket: "Writing",
    status: "● weekly cadence",
    color: "var(--color-accent)",
    title: "개발하며 새로 알게 된 것, 또는 관심 가는 이슈",
    body: "개발하면서 새로 알게 된 것, 또는 관심 가는 사회 이슈를 가져와서 씁니다. 잘 쓰는 것보다 꾸준히 쓰는 게 먼저입니다.",
  },
  {
    bucket: "Learning",
    status: "○ obsession",
    color: "var(--color-purple)",
    title: "Harness 엔지니어링 공부 중",
    body: "CI/CD 파이프라인 고도화에 관심이 생겨 Harness를 파고들고 있습니다. 배포 자동화와 릴리스 관리를 더 잘하고 싶은 마음에서 시작했습니다.",
  },
  {
    bucket: "Automating",
    status: "○ slow burn",
    color: "var(--color-purple)",
    title: "반복을 발견하면 자동화부터 생각한다",
    body: "업무든 일상이든 같은 일을 두 번 하면 어떻게 줄일 수 있을지 먼저 생각합니다.",
  },
  {
    bucket: "Resting",
    status: "○ off the grid",
    color: "var(--color-text-2)",
    title: "쉴 땐 그냥 집에 늘어져 있기",
    body: "쉴 땐 그냥 집에 늘어져 있는 걸 좋아합니다.",
  },
];

const INTERESTS = [
  {
    tag: "AUTOMATION",
    color: "var(--color-accent)",
    title: "반복을 발견하면 자동화부터 생각한다",
    body: "업무든 일상이든 같은 일을 두 번 하면 어떻게 줄일 수 있을지 먼저 생각합니다. 작은 스크립트 하나가 하루의 리듬을 바꾼다고 믿습니다.",
    refs: ["#automation", "#scripting", "#tools"],
  },
  {
    tag: "CONCURRENCY",
    color: "var(--cat-news)",
    title: "동시성과 분산 락",
    body: "대규모 트래픽 환경에서 동시 요청을 어떻게 제어할 것인가. Redis 분산 락, Cache Stampede 방지 같은 문제를 실무에서 자주 마주치고, 그럴수록 더 깊이 파고들게 됩니다.",
    refs: ["#concurrency", "#redis", "#distributed-systems"],
  },
  {
    tag: "OBSERVABILITY",
    color: "var(--cat-release)",
    title: "모니터링과 관측 가능성",
    body: "시스템이 지금 어떤 상태인지 눈으로 볼 수 있어야 합니다. OpenTelemetry, Grafana, 메트릭/트레이스 파이프라인 구성에 관심이 많습니다.",
    refs: ["#opentelemetry", "#grafana", "#observability"],
  },
  {
    tag: "CI/CD",
    color: "var(--color-purple)",
    title: "배포 파이프라인 설계",
    body: "Jenkins, GitHub Actions, 그리고 요즘은 Harness까지. 릴리스가 두렵지 않은 파이프라인을 만드는 게 목표입니다. 자동화가 가장 빛나는 순간입니다.",
    refs: ["#cicd", "#harness", "#devops"],
  },
  {
    tag: "PERFORMANCE",
    color: "var(--color-accent)",
    title: "SQL 튜닝과 응답 속도",
    body: "쿼리 하나가 DB 전체 부하를 바꿉니다. 슬로우 쿼리를 잡고 인덱스를 설계하는 과정이 퍼즐 같아서 좋습니다.",
    refs: ["#sql", "#performance", "#mysql"],
  },
  {
    tag: "WRITING",
    color: "var(--color-purple)",
    title: "쓰면서 생각하기",
    body: "글이 사고를 따라가는 게 아니라, 글이 사고를 압축한다고 생각합니다. 그래서 메모는 항상 글의 형태로 남깁니다.",
    refs: ["#writing", "#retro"],
  },
];

const STACK = [
  {
    label: "Backend",
    items: [
      { name: "Java", note: "Spring Boot / WebFlux", daily: true, years: "" },
      { name: "Python", note: "scripting · automation", daily: false, years: "" },
    ],
  },
  {
    label: "Database",
    items: [
      { name: "MySQL", note: "primary", daily: true, years: "" },
      { name: "Redis", note: "Redisson · Sentinel", daily: true, years: "" },
      { name: "Oracle", note: "legacy", daily: false, years: "" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "Vue.js", note: "Nuxt.js", daily: false, years: "" },
      { name: "TypeScript", note: "strict", daily: false, years: "" },
    ],
  },
  {
    label: "DevOps & Infra",
    items: [
      { name: "Docker", note: "containerization", daily: true, years: "" },
      { name: "Kubernetes", note: "k8s", daily: true, years: "" },
      { name: "Jenkins", note: "CI/CD", daily: false, years: "" },
      { name: "GitHub Actions", note: "CI/CD", daily: true, years: "" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { name: "OpenTelemetry", note: "tracing · metrics", daily: false, years: "" },
      { name: "Grafana", note: "visualization", daily: false, years: "" },
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
  ["ANALYTICS", "Umami — cookie-free, EU-hosted, no personal data"],
];

const ELSEWHERE = [
  {
    label: "GITHUB",
    handle: "smc5720",
    note: "code · contributions · sometimes issues",
    href: "https://github.com/smc5720",
  },
  {
    label: "MAIL",
    handle: "smc5720@gmail.com",
    note: "best for long-form questions",
    href: "mailto:smc5720@gmail.com",
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
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            border: "1px solid var(--color-border)",
            overflow: "hidden",
            background: "var(--color-surface-2)",
          }}
        >
          <Image
            src="/images/profile.jpg"
            alt="서민철 프로필 사진"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
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
            RicoCheese
          </div>
          <div className="small" style={{ color: "var(--color-text-2)", marginTop: 2 }}>
            Backend Engineer
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
              ["DAY JOB", "Backend Engineer · Java / Spring Boot"],
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
            href="mailto:smc5720@gmail.com"
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
            {it.years && (
              <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
                {it.years}
              </span>
            )}
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
              이 페이지는{" "}
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
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>RicoCheese</span>
                입니다. 서울에서 일하는 백엔드 엔지니어이고,{" "}
                <strong>Java / Spring Boot</strong>를 주력으로 게임 업계 대형 서비스 백엔드를
                개발하고 있습니다. 이 블로그는 제가 일하면서 배운 것, 만들어 본 것, 가끔은 실패한
                것을 정리해두는 작업실 일지입니다.
              </p>
              <p>
                반복 작업을 발견하면 자연스럽게 자동화로 해결하려 합니다. 좋은 도구를 만드는 일은
                결국 동료의 시간을 줄여주는 일이고, 그게 제가 이 직업에서 가장 좋아하는 부분입니다.
              </p>
              <p>
                글을 쓰는 이유는 단순합니다 —{" "}
                <em>한 달 뒤의 제가 검색해서 도움을 받기 위해서</em>입니다. 그렇게 쓰다 보니 가끔은
                다른 분에게도 닿더라고요. 그게 부수적인 즐거움입니다.
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

      {/* ===== §07 Live Stats ===== */}
      <section style={{ paddingTop: 0, paddingBottom: 96 }}>
        <div className="container">
          <SectionHead num="07" kicker="Transparency · live data" title="지금 이 블로그의 방문 현황" />

          <div style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            overflow: "hidden",
            marginTop: 40,
          }}>
            <iframe
              src="https://cloud.umami.is/share/Q3X37TvfLIZzXwI8"
              className="stats-iframe"
              style={{ border: "none", display: "block" }}
              loading="lazy"
              title="Blog analytics — powered by Umami"
            />
          </div>

          <p className="mono-label" style={{ marginTop: 12, color: "var(--color-text-3)", fontSize: 11 }}>
            powered by Umami · cookie-free · EU-hosted
          </p>
        </div>
      </section>

      {/* ===== §08 Elsewhere ===== */}
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
                <a href="mailto:smc5720@gmail.com" style={{ color: "var(--color-text)" }}>
                  smc5720@gmail.com
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
