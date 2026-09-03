import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import { SectionHead } from "@/components/SectionHead";
import { CATEGORY_LABELS, CATEGORY_COLOR_VAR } from "@/lib/constants";
import type { PostMeta } from "@/types/post";

export const metadata = {
  title: "About",
  description: "RicoCheese — Backend Engineer. 코드, 회고, 릴리스 노트를 기록하는 기술 블로그.",
};

// ──────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────

type NowStatus = "active" | "planned" | "hold";

const NOW_STATUS_LABEL: Record<NowStatus, string> = {
  active: "진행 중",
  planned: "준비 중",
  hold: "보류",
};

const NOW_ITEMS: Array<{
  bucket: string;
  status: NowStatus;
  title: string;
  body: string;
}> = [
  {
    bucket: "Building",
    status: "active",
    title: "개인 토이 프로젝트를 하나씩 만들어 가는 중",
    body: "업무에서 반복적인 작업을 마주칠 때마다 자동화 아이디어가 쌓입니다. 그 중 몇 가지를 개인 프로젝트로 꺼내 직접 만들어보고 있습니다. 이 블로그도 그 중 하나입니다.",
  },
  {
    bucket: "Writing",
    status: "active",
    title: "개발하며 새로 알게 된 것, 또는 관심 가는 이슈",
    body: "개발하면서 새로 알게 된 것, 또는 관심 가는 사회 이슈를 가져와서 씁니다. 잘 쓰는 것보다 꾸준히 쓰는 게 먼저입니다.",
  },
  {
    bucket: "Learning",
    status: "planned",
    title: "Harness 엔지니어링 공부 중",
    body: "CI/CD 파이프라인 고도화에 관심이 생겨 Harness를 파고들고 있습니다. 배포 자동화와 릴리스 관리를 더 잘하고 싶은 마음에서 시작했습니다.",
  },
  {
    bucket: "Automating",
    status: "planned",
    title: "반복을 발견하면 자동화부터 생각한다",
    body: "업무든 일상이든 같은 일을 두 번 하면 어떻게 줄일 수 있을지 먼저 생각합니다.",
  },
  {
    bucket: "Resting",
    status: "hold",
    title: "쉴 땐 그냥 집에 늘어져 있기",
    body: "쉴 땐 그냥 집에 늘어져 있는 걸 좋아합니다.",
  },
];

const INTERESTS = [
  {
    tag: "AUTOMATION",
    color: "var(--color-accent-text)",
    title: "반복을 발견하면 자동화부터 생각한다",
    body: "업무든 일상이든 같은 일을 두 번 하면 어떻게 줄일 수 있을지 먼저 생각합니다. 작은 스크립트 하나가 하루의 리듬을 바꾼다고 믿습니다.",
    refs: ["automation", "scripting", "tools"],
  },
  {
    tag: "CONCURRENCY",
    color: "var(--color-cat-news)",
    title: "동시성과 분산 락",
    body: "대규모 트래픽 환경에서 동시 요청을 어떻게 제어할 것인가. Redis 분산 락, Cache Stampede 방지 같은 문제를 실무에서 자주 마주치고, 그럴수록 더 깊이 파고들게 됩니다.",
    refs: ["concurrency", "redis", "distributed-systems"],
  },
  {
    tag: "OBSERVABILITY",
    color: "var(--color-cat-release)",
    title: "모니터링과 관측 가능성",
    body: "시스템이 지금 어떤 상태인지 눈으로 볼 수 있어야 합니다. OpenTelemetry, Grafana, 메트릭/트레이스 파이프라인 구성에 관심이 많습니다.",
    refs: ["opentelemetry", "grafana", "observability"],
  },
  {
    tag: "CI/CD",
    color: "var(--color-cat-dev)",
    title: "배포 파이프라인 설계",
    body: "Jenkins, GitHub Actions, 그리고 요즘은 Harness까지. 릴리스가 두렵지 않은 파이프라인을 만드는 게 목표입니다. 자동화가 가장 빛나는 순간입니다.",
    refs: ["cicd", "harness", "devops"],
  },
  {
    tag: "PERFORMANCE",
    color: "var(--color-accent-text)",
    title: "SQL 튜닝과 응답 속도",
    body: "쿼리 하나가 DB 전체 부하를 바꿉니다. 슬로우 쿼리를 잡고 인덱스를 설계하는 과정이 퍼즐 같아서 좋습니다.",
    refs: ["sql", "performance", "mysql"],
  },
  {
    tag: "WRITING",
    color: "var(--color-cat-dev)",
    title: "쓰면서 생각하기",
    body: "글이 사고를 따라가는 게 아니라, 글이 사고를 압축한다고 생각합니다. 그래서 메모는 항상 글의 형태로 남깁니다.",
    refs: ["writing", "retro"],
  },
];

const STACK: Array<{
  label: string;
  items: Array<{ name: string; note: string; daily: boolean }>;
}> = [
  {
    label: "Backend",
    items: [
      { name: "Java", note: "Spring Boot / WebFlux", daily: true },
      { name: "Python", note: "scripting · automation", daily: false },
    ],
  },
  {
    label: "Database",
    items: [
      { name: "MySQL", note: "primary", daily: true },
      { name: "Redis", note: "Redisson · Sentinel", daily: true },
      { name: "Oracle", note: "legacy", daily: false },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "Vue.js", note: "Nuxt.js", daily: false },
      { name: "TypeScript", note: "strict", daily: false },
    ],
  },
  {
    label: "DevOps & Infra",
    items: [
      { name: "Docker", note: "containerization", daily: true },
      { name: "Kubernetes", note: "k8s", daily: true },
      { name: "Jenkins", note: "CI/CD", daily: false },
      { name: "GitHub Actions", note: "CI/CD", daily: true },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { name: "OpenTelemetry", note: "tracing · metrics", daily: false },
      { name: "Grafana", note: "visualization", daily: false },
    ],
  },
];

const COLOPHON: [string, string][] = [
  ["FRAMEWORK", "Next.js 16 · App Router · output: export"],
  ["STYLING", "Tailwind CSS v4 · @theme tokens"],
  ["CONTENT", "MDX · next-mdx-remote · gray-matter"],
  ["HIGHLIGHT", "Shiki · rico-dark (custom palette)"],
  ["FONTS", "Pretendard · IBM Plex Mono"],
  ["HOSTING", "GitHub Pages · auto-deploy on main push"],
  ["LICENSE", "본문 CC BY-NC 4.0, 코드 MIT"],
  ["ANALYTICS", "Umami — cookie-free, EU-hosted, no personal data"],
];

const ELSEWHERE = [
  {
    label: "GitHub",
    handle: "@smc5720",
    note: "code · contributions · sometimes issues",
    href: "https://github.com/smc5720",
  },
  {
    label: "Mail",
    handle: "smc5720@gmail.com",
    note: "best for long-form questions",
    href: "mailto:smc5720@gmail.com",
  },
];

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

function ProfileCard() {
  return (
    <aside className="profile-sticky">
      <div className="about-profile-card">
        <div className="about-profile-photo">
          <Image
            src="/images/profile.jpg"
            alt="서민철 프로필 사진"
            fill
            style={{ objectFit: "cover", filter: "grayscale(1) contrast(0.92)" }}
            priority
          />
        </div>

        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.025em", color: "var(--color-fg)" }}>
            RicoCheese
          </div>
          <div style={{ fontSize: 14, color: "var(--color-fg-muted)", marginTop: 4 }}>
            Backend Engineer · 블로그 운영
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {(
            [
              ["위치", "서울"],
              ["직무", "Backend Engineer · Java / Spring Boot"],
              ["집필 시작", "2022"],
              ["대명사", "he / him"],
              ["키보드", "HHKB Pro · JIS/KR"],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k} className="about-profile-meta-row">
              <span style={{ color: "var(--color-fg-subtle)" }}>{k}</span>
              <span style={{ color: "var(--color-fg-body)", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="about-profile-actions">
          <a href="mailto:smc5720@gmail.com" className="btn btn-primary" style={{ flex: 1 }}>
            Email
          </a>
          <a
            href="https://github.com/smc5720"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ flex: 1 }}
          >
            GitHub
          </a>
        </div>
      </div>
    </aside>
  );
}

function NowRow({ item, index }: { item: (typeof NOW_ITEMS)[number]; index: number }) {
  return (
    <div className="about-now-row">
      <div className="about-now-index">
        <span className="about-now-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="about-now-bucket">{item.bucket}</span>
        <span className={`about-now-status about-now-status--${item.status}`}>
          {NOW_STATUS_LABEL[item.status]}
        </span>
      </div>
      <div>
        <div className="about-now-title">{item.title}</div>
        <p className="small" style={{ maxWidth: 640 }}>
          {item.body}
        </p>
      </div>
    </div>
  );
}

function InterestCard({ item, index }: { item: (typeof INTERESTS)[number]; index: number }) {
  return (
    <div className="about-interest-card">
      <div className="about-interest-top">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span style={{ color: item.color }}>{item.tag}</span>
      </div>
      <div className="about-interest-title">{item.title}</div>
      <p className="about-interest-body">{item.body}</p>
      <div className="about-interest-refs">
        {item.refs.map((r) => (
          <Link key={r} href={`/blog?tag=${encodeURIComponent(r)}`} className="badge">
            #{r}
          </Link>
        ))}
      </div>
    </div>
  );
}

function StackGroup({ group }: { group: (typeof STACK)[number] }) {
  return (
    <div className="about-stack-group">
      <div className="about-stack-group-head">
        <span className="about-stack-group-label">{group.label}</span>
        <span className="about-stack-group-count">{String(group.items.length).padStart(2, "0")}</span>
      </div>
      {group.items.map((it) => (
        <div key={it.name} className="about-stack-item">
          <span className={it.daily ? "about-stack-item-name" : "about-stack-item-name about-stack-item-name--minor"}>
            {it.daily && <span className="about-stack-dot" aria-hidden="true" />}
            {it.name}
          </span>
          <span className="about-stack-item-note">{it.note}</span>
        </div>
      ))}
    </div>
  );
}

function WritingRow({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="about-writing-row">
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-fg-subtle)" }}>
        {formatDate(post.published_at ?? post.date)}
      </span>
      <span style={{ fontSize: 12, color: `var(${CATEGORY_COLOR_VAR[post.category]})` }}>
        {CATEGORY_LABELS[post.category]}
      </span>
      <span className="about-writing-title">{post.title}</span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-fg-subtle)",
          textAlign: "right",
        }}
      >
        {post.readingTime}min
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
      {/* ===== Hero — 브레드크럼 · 개정 표시 · 대형 타이틀 · 리드 ===== */}
      <section className="blog-head">
        <div className="frame">
          <div className="blog-head-inner">
            <div className="blog-head-top">
              <nav aria-label="breadcrumb" className="blog-crumb">
                <span>RicoCheese</span>
                <span aria-hidden="true">/</span>
                <span className="blog-crumb-current">ABOUT</span>
              </nav>
              <span className="blog-crumb">rev. 2026-09 · v3</span>
            </div>

            <h1 className="blog-head-title">소개</h1>
            <p className="blog-head-lede">
              서울에서 Java·Spring Boot로 백엔드를 만듭니다. 이 페이지는 지금 하는 일과 즐겨 쓰는
              도구, 그리고 어디서 더 볼 수 있는지를 정리해 둔 자리입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ===== §01 Intro + ProfileCard ===== */}
      <section className="frame" style={{ paddingTop: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-line)" }}>
        <div className="about-intro-grid">
          <ProfileCard />

          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 720 }}>
            <SectionHead num="01" title="Intro" />
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.85, color: "var(--color-fg-body)" }}>
              안녕하세요, <strong>RicoCheese</strong>입니다. 서울에서 일하는 백엔드 엔지니어이고,{" "}
              <strong>Java / Spring Boot</strong>를 주력으로 게임 업계 대형 서비스 백엔드를
              개발하고 있습니다. 이 블로그는 제가 일하면서 배운 것, 만들어 본 것, 가끔은 실패한
              것을 정리해두는 작업실 일지입니다.
            </p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.85, color: "var(--color-fg-body)" }}>
              반복 작업을 발견하면 자연스럽게 자동화로 해결하려 합니다. 좋은 도구를 만드는 일은
              결국 동료의 시간을 줄여주는 일이고, 그게 제가 이 직업에서 가장 좋아하는 부분입니다.
            </p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.85, color: "var(--color-fg-body)" }}>
              글을 쓰는 이유는 단순합니다 — 한 달 뒤의 제가 검색해서 도움을 받기 위해서입니다.
              그렇게 쓰다 보니 가끔은 다른 분에게도 닿더라고요. 그게 부수적인 즐거움입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ===== §02 Now ===== */}
      <section className="frame" style={{ paddingTop: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-line)" }}>
        <SectionHead
          num="02"
          title="Now"
          right={<span>최종 갱신 2026-09-03</span>}
        />
        <div className="now-grid">
          {NOW_ITEMS.map((it, i) => (
            <NowRow key={it.bucket} item={it} index={i} />
          ))}
        </div>
        <p className="small" style={{ marginTop: 16 }}>
          이 형식은{" "}
          <a
            className="link"
            href="https://nownownow.com"
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            now page
          </a>{" "}
          관행을 따릅니다 — 한 달 단위로 정리합니다.
        </p>
      </section>

      {/* ===== §03 Interests ===== */}
      <section className="frame" style={{ paddingTop: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-line)" }}>
        <SectionHead num="03" title="Interests" />
        <div className="interest-grid" style={{ marginTop: 24 }}>
          {INTERESTS.map((it, i) => (
            <InterestCard key={it.title} item={it} index={i} />
          ))}
        </div>
      </section>

      {/* ===== §04 Stack ===== */}
      <section className="frame" style={{ paddingTop: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-line)" }}>
        <SectionHead
          num="04"
          title="Stack"
          right={
            <span className="about-stack-legend">
              <span className="about-stack-dot" aria-hidden="true" />
              매일 사용
            </span>
          }
        />
        <div className="stack-grid" style={{ marginTop: 10 }}>
          {STACK.map((group) => (
            <StackGroup key={group.label} group={group} />
          ))}
        </div>
      </section>

      {/* ===== §05 Selected Writing ===== */}
      <section className="frame" style={{ paddingTop: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-line)" }}>
        <SectionHead
          num="05"
          title="Selected writing"
          right={
            <Link href="/blog" className="arrow-link">
              <span>전체 글</span>
              <span className="arrow" />
            </Link>
          }
        />
        <div className="about-writing-list" style={{ marginTop: 20 }}>
          {selectedPosts.map((p) => (
            <WritingRow key={p.slug} post={p} />
          ))}
        </div>
      </section>

      {/* ===== §06 Colophon (인용구 + 키·값) ===== */}
      <section className="frame" style={{ paddingTop: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-line)" }}>
        <div className="quote-colophon-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionHead num="06" title="Colophon" />
            <p className="about-quote">
              좋은 도구를 만드는 일은 결국{" "}
              <span className="home-hero-em">동료의 시간을 줄여주는 일</span>이다. 그게 내가 이
              직업에서 가장 좋아하는 부분.
            </p>
          </div>

          <div className="about-colophon-list" style={{ paddingTop: 52 }}>
            {COLOPHON.map(([k, v]) => (
              <div key={k} className="about-colophon-row">
                <span className="about-colophon-key">{k}</span>
                <span className="about-colophon-value">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== §07 Live Stats ===== */}
      <section className="frame" style={{ paddingTop: 48, paddingBottom: 48, borderBottom: "1px solid var(--color-line)" }}>
        <SectionHead num="07" title="Live stats" />

        <div
          style={{
            border: "1px solid var(--color-line)",
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginTop: 24,
          }}
        >
          <iframe
            src="https://cloud.umami.is/share/Q3X37TvfLIZzXwI8"
            className="stats-iframe"
            style={{ border: "none", display: "block" }}
            loading="lazy"
            title="Blog analytics — powered by Umami"
          />
        </div>

        <p style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-fg-subtle)" }}>
          출처: Umami 공개 대시보드. 방문 수치는 15분 간격으로 갱신됩니다.
        </p>
      </section>

      {/* ===== §08 Elsewhere ===== */}
      <section className="frame" style={{ paddingTop: 48, paddingBottom: 88 }}>
        <SectionHead num="08" title="Elsewhere" />
        <div className="elsewhere-grid" style={{ marginTop: 24 }}>
          {ELSEWHERE.map((e) => (
            <a
              key={e.label}
              href={e.href}
              className="elsewhere-card"
              target={e.href.startsWith("http") ? "_blank" : undefined}
              rel={e.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-fg)" }}>{e.label}</span>
                <span style={{ fontSize: 14, color: "var(--color-fg-subtle)" }}>↗</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-fg-body)" }}>
                {e.handle}
              </div>
              <div className="small">{e.note}</div>
            </a>
          ))}
        </div>

        <div className="about-cta-block" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-fg-subtle)" }}>
              직접 연락
            </div>
            <a
              href="mailto:smc5720@gmail.com"
              style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", color: "var(--color-fg)" }}
            >
              smc5720@gmail.com
            </a>
          </div>
          <Link href="/blog" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
            전체 글 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
