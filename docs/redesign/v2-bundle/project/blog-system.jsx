// blog-system.jsx — Design system reference page
// Sections: tokens · type · spacing · motion · contrast · focus · components

const { useState, useEffect } = React;

function SystemPage({ onNav }) {
  const [tab, setTab] = useState("tokens");

  const tabs = [
    ["tokens",     "01 · Tokens"],
    ["type",       "02 · Type"],
    ["spacing",    "03 · Spacing"],
    ["motion",     "04 · Motion"],
    ["a11y",       "05 · A11y"],
    ["components", "06 · States"]
  ];

  return (
    <main>
      {/* Hero */}
      <section style={{ paddingTop: 32, paddingBottom: 40, borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div className="mono-label" style={{ display: "flex", gap: 12 }}>
              <span>BREADCRUMB</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span>RICOCHEESE</span>
              <span style={{ color: "var(--color-text-3)" }}>/</span>
              <span style={{ color: "var(--color-text)" }}>SYSTEM</span>
            </div>
            <div className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
              v2.0 · TAILWIND CSS v4 · @theme
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }} className="hero-grid">
            <h1 className="display display-h1" style={{ margin: 0 }}>
              The <span style={{ fontStyle: "italic", color: "var(--color-text-2)" }}>System</span><span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
            <p className="lede" style={{ maxWidth: 460, color: "var(--color-text-2)" }}>
              여기 있는 토큰·타입·모션 명세를 그대로 <code style={{ fontFamily: "var(--font-mono)", fontSize: ".9em", color: "var(--color-accent)" }}>@theme</code> 블록과 컴포넌트 코드로 옮기면 됩니다. 변수 이름이 1:1 매칭됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky tab bar */}
      <section style={{
        position: "sticky", top: 72, zIndex: 30,
        background: "rgba(7,7,10,.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--color-border)"
      }} className="sys-sticky">
        <div className="container" style={{ display: "flex", gap: 6, paddingTop: 16, paddingBottom: 16, overflowX: "auto" }}>
          {tabs.map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className="chip"
              aria-pressed={tab === k}
            >
              <span>{l}</span>
            </button>
          ))}
        </div>
      </section>

      <section style={{ paddingTop: 56, paddingBottom: 120 }}>
        <div className="container">
          {tab === "tokens"     && <TokensSection />}
          {tab === "type"       && <TypeSection />}
          {tab === "spacing"    && <SpacingSection />}
          {tab === "motion"     && <MotionSection />}
          {tab === "a11y"       && <A11ySection />}
          {tab === "components" && <ComponentsSection />}
        </div>
      </section>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────
// TOKENS — color swatches + Tailwind @theme mapping
// ──────────────────────────────────────────────────────────────
function TokensSection() {
  const groups = [
    {
      label: "Surface · base",
      desc: "배경부터 가장 깊은 표면 surface까지. 다크 모드 1순위 레이어들.",
      tokens: [
        { name: "color-bg",         hex: "#07070A", tw: "bg",         use: "최하단 페이지 배경" },
        { name: "color-surface",    hex: "#0E0E14", tw: "surface",    use: "1st-level surface · 카드/패널" },
        { name: "color-surface-2",  hex: "#141419", tw: "surface-2",  use: "2nd-level · 인라인 code 배경" },
        { name: "color-surface-3",  hex: "#1B1B22", tw: "surface-3",  use: "hover/elevated 변형" }
      ]
    },
    {
      label: "Border",
      desc: "헤어라인부터 강한 border까지. focus 상태는 accent 사용.",
      tokens: [
        { name: "color-border",     hex: "#1C1C28", tw: "border",     use: "기본 hairline · 카드 외곽" },
        { name: "color-border-2",   hex: "#28283A", tw: "border-2",   use: "section divider · button 외곽" },
        { name: "color-border-3",   hex: "#3A3A50", tw: "border-3",   use: "strong border · hover" }
      ]
    },
    {
      label: "Text",
      desc: "본문, 메타, 비활성 텍스트의 3단 위계.",
      tokens: [
        { name: "color-text",       hex: "#EDEDEF", tw: "text",       use: "본문·헤딩 기본" },
        { name: "color-text-2",     hex: "#8A8A9A", tw: "text-2",     use: "메타·desc·muted" },
        { name: "color-text-3",     hex: "#484858", tw: "text-3",     use: "비활성·hint" }
      ]
    },
    {
      label: "Accent (signature)",
      desc: "라임 네온 한 색. 링크 underline · CTA · 활성 상태에만. 면적 광고하지 말 것.",
      tokens: [
        { name: "color-accent",     hex: "#C8FF00", tw: "accent",     use: "primary · link underline · live dot" },
        { name: "color-accent-ink", hex: "#07070A", tw: "accent-ink", use: "accent 위 텍스트" }
      ]
    },
    {
      label: "Category",
      desc: "카테고리 시그니처. badge 점과 chart 색에만 등장.",
      tokens: [
        { name: "color-blue",       hex: "#4D9EFF", tw: "blue",       use: "news" },
        { name: "color-accent",     hex: "#C8FF00", tw: "accent",     use: "dev" },
        { name: "color-purple",     hex: "#A78BFA", tw: "purple",     use: "retrospective" },
        { name: "color-orange",     hex: "#FF8C42", tw: "orange",     use: "release" },
        { name: "color-text-2",     hex: "#8A8A9A", tw: "text-2",     use: "etc" }
      ]
    },
    {
      label: "Status",
      desc: "에러·정보·성공. 가볍게만 등장.",
      tokens: [
        { name: "color-red",        hex: "#FF4060", tw: "red",        use: "error · destructive" },
        { name: "color-green",      hex: "#4ADE80", tw: "green",      use: "success · published" },
        { name: "color-blue",       hex: "#4D9EFF", tw: "blue",       use: "info" }
      ]
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
      <SectionHead num="A" kicker="Color · semantic tokens"
        title="모든 색은 변수에서 시작합니다"
        right={
          <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-3)", textAlign: "right", lineHeight: 1.4 }}>{`tailwind.config.css
@theme { --color-* }`}</pre>
        } />

      {groups.map(g => (
        <div key={g.label}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 56, alignItems: "start", marginBottom: 18 }} className="sys-row">
            <div>
              <div className="mono-label" style={{ marginBottom: 8 }}>{g.label}</div>
              <p className="small" style={{ maxWidth: 260 }}>{g.desc}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "1px solid var(--color-border-2)" }} className="sys-tokens">
              {g.tokens.map((t, i) => (
                <Swatch key={t.name + i} token={t} idx={i} />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* @theme codeblock */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 56, alignItems: "start", marginBottom: 16 }} className="sys-row">
          <div>
            <div className="mono-label" style={{ marginBottom: 8 }}>@theme · CSS</div>
            <p className="small" style={{ maxWidth: 260 }}>
              위 토큰을 Tailwind v4 <code style={{ fontFamily: "var(--font-mono)", fontSize: ".9em", color: "var(--color-accent)" }}>@theme</code> 한 블록으로 옮기면 끝. 변수 이름이 1:1 그대로입니다.
            </p>
          </div>
          <CodeBlock filename="app/globals.css" lang="css" lines={[
            [["k","@import "],["s","\"tailwindcss\""],["p",";"]],
            [],
            [["k","@theme "],["p","{"]],
            [["c","  /* color */"]],
            [["p","  "],["v","--color-bg"],["p",": "],["n","#07070A"],["p",";"]],
            [["p","  "],["v","--color-surface"],["p",": "],["n","#0E0E14"],["p",";"]],
            [["p","  "],["v","--color-surface-2"],["p",": "],["n","#141419"],["p",";"]],
            [["p","  "],["v","--color-border"],["p",": "],["n","#1C1C28"],["p",";"]],
            [["p","  "],["v","--color-border-2"],["p",": "],["n","#28283A"],["p",";"]],
            [["p","  "],["v","--color-text"],["p",": "],["n","#EDEDEF"],["p",";"]],
            [["p","  "],["v","--color-text-2"],["p",": "],["n","#8A8A9A"],["p",";"]],
            [["p","  "],["v","--color-accent"],["p",": "],["n","#C8FF00"],["p",";    "],["c","/* signature */"]],
            [],
            [["c","  /* type */"]],
            [["p","  "],["v","--font-serif"],["p",": "],["s","\"Fraunces\""],["p",", "],["s","\"Noto Serif KR\""],["p",", "],["t","serif"],["p",";"]],
            [["p","  "],["v","--font-sans"],["p",":  "],["s","\"Syne\""],["p",", "],["s","\"Noto Sans KR\""],["p",", "],["t","sans-serif"],["p",";"]],
            [["p","  "],["v","--font-mono"],["p",":  "],["s","\"JetBrains Mono\""],["p",", "],["t","ui-monospace"],["p",";"]],
            [],
            [["c","  /* spacing · radius · shadow follow */"]],
            [["p","}"]]
          ]} />
        </div>
      </div>
    </div>
  );
}

function Swatch({ token, idx }) {
  return (
    <div style={{
      borderLeft: idx % 4 !== 0 ? "1px solid var(--color-border-2)" : "none",
      padding: 16, display: "flex", flexDirection: "column", gap: 10,
      minHeight: 156, position: "relative"
    }}>
      <div style={{
        height: 56, width: "100%",
        background: token.hex,
        border: "1px solid rgba(255,255,255,.06)"
      }} />
      <div className="mono-label tabular" style={{ color: "var(--color-text)", fontSize: 10 }}>
        --{token.name}
      </div>
      <div className="mono-label tabular" style={{ color: "var(--color-text-3)", fontSize: 10 }}>
        {token.hex}
      </div>
      <div className="small" style={{ fontSize: 11.5, color: "var(--color-text-2)", marginTop: "auto" }}>
        {token.use}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// TYPE
// ──────────────────────────────────────────────────────────────
function TypeSection() {
  const scale = [
    { name: "display-hero", family: "serif", weight: 360, size: "clamp(56, 9.4vw, 168)", lh: ".98", ls: "-.025em", sample: "The Studio Log." },
    { name: "display-h1",   family: "serif", weight: 380, size: "clamp(40, 5.6vw, 84)",  lh: "1",    ls: "-.022em", sample: "About, briefly." },
    { name: "display-h2",   family: "serif", weight: 380, size: "clamp(28, 3.4vw, 48)",  lh: "1.05", ls: "-.02em",  sample: "이번 분기에 매달리는 것들" },
    { name: "display-h3",   family: "serif", weight: 400, size: "clamp(22, 2.2vw, 30)",  lh: "1.15", ls: "-.01em",  sample: "Reading Progress와 TOC 다시 만들기" },
    { name: "lede",         family: "serif", weight: 350, size: "clamp(20, 1.8vw, 24)",  lh: "1.45", ls: "-.005em", sample: "정적 export 환경에서 App Router·next-mdx-remote·Shiki로 빌드 파이프라인을 다시 짰다." },
    { name: "body-lg",      family: "body",  weight: 400, size: "17.5",                   lh: "1.75", ls: "0",       sample: "본문은 한국어 우선. Inter + Noto Sans KR fallback으로, 라틴 글자와 한글이 같이 와도 자간이 안 흔들리도록." },
    { name: "body",         family: "body",  weight: 400, size: "15.5",                   lh: "1.6",  ls: "0",       sample: "본문 표준 사이즈. 카드 설명문, 메타에서 가장 많이 등장합니다." },
    { name: "small",        family: "body",  weight: 400, size: "13.5",                   lh: "1.55", ls: "0",       sample: "캡션, 부가 메타, 푸터에서 사용합니다." },
    { name: "mono-label",   family: "mono",  weight: 500, size: "11",                     lh: "1.4",  ls: ".14em",   sample: "NOW PLAYING · LIVE · KR" }
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <SectionHead num="B" kicker="Type · vertical scale" title="9단계 + mono 1단계" />
      <div style={{ borderTop: "1px solid var(--color-border-2)" }}>
        {scale.map((s, i) => (
          <div key={s.name} style={{
            display: "grid", gridTemplateColumns: "160px 80px 1fr 220px",
            gap: 24, alignItems: "baseline",
            padding: "28px 0",
            borderBottom: "1px solid var(--color-border)"
          }} className="type-row">
            <div>
              <div className="mono-label" style={{ color: "var(--color-text)" }}>.{s.name}</div>
              <div className="mono-label" style={{ color: "var(--color-text-3)" }}>--font-{s.family}</div>
            </div>
            <div className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>{s.weight}</div>
            <div style={{
              fontFamily: s.family === "serif" ? "var(--font-serif)" : s.family === "mono" ? "var(--font-mono)" : "var(--font-body)",
              fontWeight: s.weight,
              fontSize: s.size.startsWith("clamp") ? s.size : s.size + "px",
              lineHeight: s.lh,
              letterSpacing: s.ls === ".14em" ? ".14em" : s.ls,
              textTransform: s.name === "mono-label" ? "uppercase" : "none",
              color: "var(--color-text)"
            }}>
              {s.sample}
            </div>
            <div className="mono-label tabular" style={{ color: "var(--color-text-3)", fontSize: 10, textAlign: "right" }}>
              {s.size}px · lh {s.lh} · ls {s.ls || "0"}
            </div>
          </div>
        ))}
      </div>

      {/* KR + Latin behavior */}
      <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="type-pair">
        <div style={{ padding: 28, border: "1px solid var(--color-border-2)" }}>
          <div className="mono-label" style={{ marginBottom: 14 }}>KR fallback · serif</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, lineHeight: 1.15, color: "var(--color-text)" }}>
            한국어 본문은 Noto Serif KR<br/>로 fallback됩니다.
          </div>
          <div className="small" style={{ marginTop: 16 }}>Fraunces가 한글 글리프를 갖고 있지 않아 자동 fallback. opsz 144, SOFT 30 변형은 유지.</div>
        </div>
        <div style={{ padding: 28, border: "1px solid var(--color-border-2)" }}>
          <div className="mono-label" style={{ marginBottom: 14 }}>KR fallback · sans</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 17.5, lineHeight: 1.75, color: "var(--color-text)" }}>
            본문은 Inter + Noto Sans KR. <strong>강조도</strong> 한글에서 자연스럽게 굵어집니다.
          </div>
          <div className="small" style={{ marginTop: 16 }}>한글-라틴 혼식 시 baseline이 흔들리지 않도록 Noto Sans KR 300–700 가변 사용.</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SPACING
// ──────────────────────────────────────────────────────────────
function SpacingSection() {
  const scale = [
    ["s-1",  4],  ["s-2",  8],  ["s-3",  12], ["s-4",  16],
    ["s-5",  20], ["s-6",  24], ["s-8",  32], ["s-10", 40],
    ["s-12", 48], ["s-16", 64], ["s-20", 80], ["s-24", 96]
  ];
  const radii = [
    ["r-xs", 4], ["r-sm", 6], ["r-md", 10], ["r-lg", 14], ["r-xl", 20], ["r-full", 999]
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
      <SectionHead num="C" kicker="Spacing · Radius · Shadow" title="4px base · radius 6단 · shadow 2단" />

      <div>
        <div className="mono-label" style={{ marginBottom: 16 }}>SPACING · TAILWIND 4PX</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", border: "1px solid var(--color-border-2)" }} className="sys-spacing">
          {scale.map(([n, v], i) => (
            <div key={n} style={{
              padding: "16px 12px",
              borderLeft: i % 12 !== 0 ? "1px solid var(--color-border)" : "none",
              display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start"
            }}>
              <div style={{ height: v, width: v, background: "var(--color-accent)", maxHeight: 64, maxWidth: 64 }} />
              <div className="mono-label tabular" style={{ color: "var(--color-text)", fontSize: 10 }}>--{n}</div>
              <div className="mono-label tabular" style={{ color: "var(--color-text-3)", fontSize: 10 }}>{v}px</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mono-label" style={{ marginBottom: 16 }}>RADIUS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", border: "1px solid var(--color-border-2)" }} className="sys-radius">
          {radii.map(([n, v], i) => (
            <div key={n} style={{ padding: 24, borderLeft: i > 0 ? "1px solid var(--color-border)" : "none", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 56, height: 56, background: "var(--color-surface-2)", border: "1px solid var(--color-border-2)", borderRadius: v }} />
              <div className="mono-label" style={{ fontSize: 10 }}>--{n}</div>
              <div className="mono-label" style={{ fontSize: 10, color: "var(--color-text-3)" }}>{v === 999 ? "pill" : v + "px"}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mono-label" style={{ marginBottom: 16 }}>GRID · DESKTOP 12 / TABLET 8 / MOBILE 4</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="grid-spec">
          {[
            { label: "DESKTOP 1440",  cols: 12, gutter: 32, margin: 64, color: "var(--color-accent)" },
            { label: "TABLET 768",    cols: 8,  gutter: 24, margin: 32, color: "var(--color-purple)" },
            { label: "MOBILE 390",    cols: 4,  gutter: 16, margin: 20, color: "var(--color-orange)" }
          ].map(b => (
            <div key={b.label} style={{ border: "1px solid var(--color-border-2)", padding: 20 }}>
              <div className="mono-label" style={{ color: b.color, marginBottom: 12 }}>{b.label}</div>
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${b.cols}, 1fr)`,
                gap: 6, height: 80, padding: "0 6px"
              }}>
                {Array.from({ length: b.cols }).map((_, i) => (
                  <div key={i} style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }} />
                ))}
              </div>
              <div className="mono-label tabular" style={{ marginTop: 12, color: "var(--color-text-3)" }}>
                cols {b.cols} · gutter {b.gutter} · margin {b.margin}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MOTION
// ──────────────────────────────────────────────────────────────
function MotionSection() {
  const tokens = [
    { name: "ease-out",  value: "cubic-bezier(.16, 1, .3, 1)",   use: "기본 outro · 길이감 있는 진입" },
    { name: "ease-snap", value: "cubic-bezier(.2, .8, .2, 1)",   use: "버튼 click · 짧고 단단하게" },
    { name: "linear",    value: "linear",                         use: "ReadingProgress 바 — 입력 비율을 그대로" }
  ];
  const durations = [
    { name: "instant",   ms: 0,    use: "초기 페인트" },
    { name: "fast",      ms: 120,  use: "버튼 hover · 칩 active" },
    { name: "base",      ms: 200,  use: "기본 transition" },
    { name: "medium",    ms: 350,  use: "underline draw · arrow extend" },
    { name: "long",      ms: 700,  use: "page-enter fadeUp" }
  ];
  const choreo = [
    { name: "page-enter",          delay: "80–480ms", ease: "ease-out", what: "h1 → meta → grid 순으로 fadeUp 12px" },
    { name: "card-hover",          delay: "0",         ease: "ease-out", what: "title color → accent, padding-left 14px (row)" },
    { name: "link-underline",      delay: "0",         ease: "ease-out", what: "background-size 100% 1px → 2px, 350ms" },
    { name: "arrow-link",          delay: "0",         ease: "ease-out", what: "arrow width 22 → 36px" },
    { name: "toc-active",          delay: "0",         ease: "ease-out", what: "border-left color + padding-left 12 → 14px" },
    { name: "reading-progress",    delay: "0",         ease: "linear",   what: "width 0–100%, 60ms tick" },
    { name: "marquee",             delay: "0",         ease: "linear",   what: "translateX -50%, 60s loop · pausable" }
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
      <SectionHead num="D" kicker="Motion · micro-interactions" title="짧고, 단단하고, 한 방향" />

      <div>
        <div className="mono-label" style={{ marginBottom: 16 }}>EASING TOKENS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid var(--color-border-2)" }} className="sys-ease">
          {tokens.map((t, i) => (
            <EasingDemo key={t.name} t={t} idx={i} />
          ))}
        </div>
      </div>

      <div>
        <div className="mono-label" style={{ marginBottom: 16 }}>DURATIONS</div>
        <div style={{ border: "1px solid var(--color-border-2)" }}>
          {durations.map((d, i) => (
            <div key={d.name} style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr 240px",
              gap: 24, alignItems: "center",
              padding: "16px 20px",
              borderTop: i > 0 ? "1px solid var(--color-border)" : "none"
            }} className="dur-row">
              <div className="mono-label" style={{ color: "var(--color-text)" }}>--dur-{d.name}</div>
              <div style={{
                height: 4, background: "var(--color-surface-2)", position: "relative",
                width: `clamp(40px, ${Math.max(d.ms / 7, 12)}px, 600px)`
              }}>
                <div style={{ position: "absolute", inset: 0, background: "var(--color-accent)" }} />
              </div>
              <div className="mono-label tabular" style={{ color: "var(--color-text-3)", textAlign: "right" }}>
                {d.ms === 0 ? "0ms" : d.ms + "ms"} · {d.use}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mono-label" style={{ marginBottom: 16 }}>CHOREOGRAPHY</div>
        <div style={{ border: "1px solid var(--color-border-2)" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1.2fr .7fr .8fr 2fr",
            gap: 24, padding: "12px 20px",
            background: "rgba(255,255,255,.02)",
            borderBottom: "1px solid var(--color-border-2)"
          }} className="choreo-row">
            <div className="mono-label">interaction</div>
            <div className="mono-label">delay</div>
            <div className="mono-label">easing</div>
            <div className="mono-label">what moves</div>
          </div>
          {choreo.map((c, i) => (
            <div key={c.name} style={{
              display: "grid", gridTemplateColumns: "1.2fr .7fr .8fr 2fr",
              gap: 24, padding: "14px 20px", alignItems: "baseline",
              borderTop: i > 0 ? "1px solid var(--color-border)" : "none"
            }} className="choreo-row">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-text)" }}>{c.name}</div>
              <div className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>{c.delay}</div>
              <div className="mono-label" style={{ color: "var(--color-text-3)" }}>{c.ease}</div>
              <div className="small" style={{ color: "var(--color-text-2)" }}>{c.what}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="motion-pair">
        <div style={{ padding: 24, border: "1px solid var(--color-border-2)" }}>
          <div className="mono-label" style={{ marginBottom: 14 }}>prefers-reduced-motion</div>
          <p className="small" style={{ marginBottom: 14 }}>
            OS 레벨에서 모션 감소를 켠 사용자에게는 <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>animation</code>·<code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>transition</code> 전체를 0으로 죽입니다. marquee, fadeUp, underline draw 모두 정지.
          </p>
          <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-2)", padding: 12, background: "var(--color-surface)", border: "1px solid var(--color-border)", overflowX: "auto" }}>{`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}`}</pre>
        </div>
        <div style={{ padding: 24, border: "1px solid var(--color-border-2)" }}>
          <div className="mono-label" style={{ marginBottom: 14 }}>do · don't</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><span style={{ color: "var(--color-accent)" }}>do</span> · 한 화면에 한 모션 (page-enter는 예외)</li>
            <li><span style={{ color: "var(--color-accent)" }}>do</span> · 200ms 안에 끝낸다 (hover 류)</li>
            <li><span style={{ color: "var(--color-accent)" }}>do</span> · 항상 1방향 (위→아래, 왼→오)</li>
            <li><span style={{ color: "var(--color-red)" }}>don't</span> · 위→아래 + 아래→위 섞지 말 것</li>
            <li><span style={{ color: "var(--color-red)" }}>don't</span> · 회전 · scale-up bounce</li>
            <li><span style={{ color: "var(--color-red)" }}>don't</span> · 자동 재생되는 풀-화면 hero 영상</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function EasingDemo({ t, idx }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setK(x => x + 1), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ borderLeft: idx > 0 ? "1px solid var(--color-border-2)" : "none", padding: 20, minHeight: 160, display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="mono-label" style={{ color: "var(--color-text)" }}>--{t.name}</div>
      <div style={{ position: "relative", height: 28, background: "var(--color-surface)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div key={k} style={{
          position: "absolute", top: 4, left: 4,
          width: 20, height: 20,
          background: "var(--color-accent)",
          animation: `slide-${idx} 1.8s ${t.value} both`
        }} />
      </div>
      <style>{`@keyframes slide-${idx} { from { transform: translateX(0); } to { transform: translateX(calc(100% + 20px)); } }`}</style>
      <div className="mono-label tabular" style={{ color: "var(--color-text-3)", fontSize: 10 }}>{t.value}</div>
      <div className="small" style={{ marginTop: "auto" }}>{t.use}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// A11Y — contrast table + focus ring
// ──────────────────────────────────────────────────────────────
function A11ySection() {
  // computed contrast ratios (relative luminance method)
  const pairs = [
    { fg: "#EDEDEF", fgName: "color-text",     bg: "#07070A", bgName: "color-bg",      use: "body 본문" },
    { fg: "#EDEDEF", fgName: "color-text",     bg: "#0E0E14", bgName: "color-surface", use: "카드 본문" },
    { fg: "#8A8A9A", fgName: "color-text-2",   bg: "#07070A", bgName: "color-bg",      use: "메타·desc" },
    { fg: "#8A8A9A", fgName: "color-text-2",   bg: "#0E0E14", bgName: "color-surface", use: "카드 메타" },
    { fg: "#484858", fgName: "color-text-3",   bg: "#07070A", bgName: "color-bg",      use: "비활성 — 텍스트 X (deco·hint만)" },
    { fg: "#C8FF00", fgName: "color-accent",   bg: "#07070A", bgName: "color-bg",      use: "링크·CTA 텍스트" },
    { fg: "#07070A", fgName: "color-accent-ink", bg: "#C8FF00", bgName: "color-accent", use: "primary 버튼 라벨" },
    { fg: "#4D9EFF", fgName: "color-blue",     bg: "#07070A", bgName: "color-bg",      use: "news 카테고리 점" },
    { fg: "#A78BFA", fgName: "color-purple",   bg: "#07070A", bgName: "color-bg",      use: "retro 카테고리 점" },
    { fg: "#FF8C42", fgName: "color-orange",   bg: "#07070A", bgName: "color-bg",      use: "release 카테고리 점" },
    { fg: "#FF4060", fgName: "color-red",      bg: "#07070A", bgName: "color-bg",      use: "에러 텍스트" }
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      <SectionHead num="E" kicker="Accessibility · WCAG 2.1" title="대비비 + 포커스 + 키보드 내비" />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div className="mono-label">CONTRAST · TEXT ON BACKGROUND</div>
          <div className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>WCAG AA = 4.5:1 · AAA = 7:1 · LARGE = 3:1</div>
        </div>
        <div style={{ border: "1px solid var(--color-border-2)" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "2.4fr 1.2fr .7fr .9fr 1.8fr",
            padding: "12px 20px",
            background: "rgba(255,255,255,.02)",
            borderBottom: "1px solid var(--color-border-2)"
          }} className="contrast-row">
            <div className="mono-label">pair</div>
            <div className="mono-label">preview</div>
            <div className="mono-label">ratio</div>
            <div className="mono-label">level</div>
            <div className="mono-label">use</div>
          </div>
          {pairs.map((p, i) => {
            const ratio = contrast(p.fg, p.bg);
            const level = ratio >= 7 ? ["AAA", "var(--color-accent)"] : ratio >= 4.5 ? ["AA", "var(--color-green)"] : ratio >= 3 ? ["AA (large)", "var(--color-orange)"] : ["FAIL", "var(--color-red)"];
            return (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "2.4fr 1.2fr .7fr .9fr 1.8fr",
                padding: "14px 20px", alignItems: "center", gap: 12,
                borderTop: i > 0 ? "1px solid var(--color-border)" : "none"
              }} className="contrast-row">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text)" }}>--{p.fgName}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-3)" }}>on --{p.bgName}</span>
                </div>
                <div style={{ background: p.bg, color: p.fg, padding: "10px 14px", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", height: 40 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>읽을 수 있나요? Aa</span>
                </div>
                <div className="mono-label tabular" style={{ color: "var(--color-text)", fontSize: 13 }}>{ratio.toFixed(2)}</div>
                <div className="mono-label" style={{ color: level[1] }}>{level[0]}</div>
                <div className="small" style={{ color: "var(--color-text-2)" }}>{p.use}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="motion-pair">
        <div style={{ padding: 24, border: "1px solid var(--color-border-2)" }}>
          <div className="mono-label" style={{ marginBottom: 18 }}>FOCUS RING</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <button className="btn" style={{ height: 40, outline: "2px solid var(--color-accent)", outlineOffset: 2 }}>Default focus</button>
            <button className="btn btn-primary" style={{ height: 40, outline: "2px solid var(--color-accent)", outlineOffset: 2 }}>Primary focus</button>
            <button className="chip" aria-pressed style={{ height: 36, outline: "2px solid var(--color-accent)", outlineOffset: 2 }}>Chip focus</button>
          </div>
          <p className="small">
            모든 인터랙티브 엘리먼트는 <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>:focus-visible</code> 시 <strong>2px outline + 2px offset</strong>의 라임 링을 표시합니다. 키보드 내비 사용자만 보이고, 마우스 클릭 시에는 사라집니다.
          </p>
        </div>
        <div style={{ padding: 24, border: "1px solid var(--color-border-2)" }}>
          <div className="mono-label" style={{ marginBottom: 18 }}>KEYBOARD ROUTES</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["Tab",         "다음 인터랙티브"],
              ["Shift + Tab", "이전 인터랙티브"],
              ["Enter",       "링크·버튼 activate"],
              ["Space",       "버튼 activate"],
              ["Esc",         "패널/모달 닫기"],
              ["/",           "전체 검색 포커스"],
              ["g h",         "Home"],
              ["g b",         "Blog index"]
            ].map(([k, v]) => (
              <li key={k} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "baseline" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  padding: "3px 8px", border: "1px solid var(--color-border-2)",
                  color: "var(--color-text)", width: "fit-content",
                  letterSpacing: ".1em"
                }}>{k}</span>
                <span className="small">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// WCAG relative luminance → contrast ratio
function srgbChannel(c) { c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function luminance(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return 0;
  const r = srgbChannel(parseInt(m[1], 16));
  const g = srgbChannel(parseInt(m[2], 16));
  const b = srgbChannel(parseInt(m[3], 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const la = luminance(a), lb = luminance(b);
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

// ──────────────────────────────────────────────────────────────
// COMPONENT STATES
// ──────────────────────────────────────────────────────────────
function ComponentsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      <SectionHead num="F" kicker="Components · states matrix" title="default · hover · focus · active · disabled" />

      <StateMatrix
        label="Button · primary"
        items={[
          ["default",  <button className="btn btn-primary">Read essay →</button>],
          ["hover",    <button className="btn btn-primary" style={{ background: "#d4ff2e", borderColor: "#d4ff2e" }}>Read essay →</button>],
          ["focus",    <button className="btn btn-primary" style={{ outline: "2px solid var(--color-accent)", outlineOffset: 2 }}>Read essay →</button>],
          ["active",   <button className="btn btn-primary" style={{ transform: "translateY(1px)" }}>Read essay →</button>],
          ["disabled", <button className="btn btn-primary" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border-2)", color: "var(--color-text-3)", cursor: "not-allowed" }}>Read essay →</button>]
        ]}
      />

      <StateMatrix
        label="Button · ghost"
        items={[
          ["default",  <button className="btn">Subscribe</button>],
          ["hover",    <button className="btn" style={{ borderColor: "var(--color-border-3)", background: "rgba(255,255,255,.03)" }}>Subscribe</button>],
          ["focus",    <button className="btn" style={{ outline: "2px solid var(--color-accent)", outlineOffset: 2 }}>Subscribe</button>],
          ["active",   <button className="btn" style={{ background: "var(--color-surface-2)" }}>Subscribe</button>],
          ["disabled", <button className="btn" style={{ color: "var(--color-text-3)", borderColor: "var(--color-border)", cursor: "not-allowed" }}>Subscribe</button>]
        ]}
      />

      <StateMatrix
        label="Filter chip"
        items={[
          ["default",  <button className="chip">All <span className="count">12</span></button>],
          ["hover",    <button className="chip" style={{ borderColor: "var(--color-border-3)", color: "var(--color-text)" }}>All <span className="count">12</span></button>],
          ["pressed",  <button className="chip" aria-pressed="true">All <span className="count">12</span></button>],
          ["focus",    <button className="chip" style={{ outline: "2px solid var(--color-accent)", outlineOffset: 2 }}>All <span className="count">12</span></button>],
          ["disabled", <button className="chip" style={{ color: "var(--color-text-3)", borderColor: "var(--color-border)", cursor: "not-allowed" }}>All <span className="count">12</span></button>]
        ]}
      />

      <StateMatrix
        label="Category badge"
        items={[
          ["dev",          <span className="badge badge-md" data-cat="dev">Dev</span>],
          ["news",         <span className="badge badge-md" data-cat="news">News</span>],
          ["retrospective",<span className="badge badge-md" data-cat="retrospective">Retrospective</span>],
          ["release",      <span className="badge badge-md" data-cat="release">Release</span>],
          ["etc",          <span className="badge badge-md" data-cat="etc">etc</span>]
        ]}
      />

      <StateMatrix
        label="TOC item"
        items={[
          ["default", <span className="toc-item" style={{ padding: "8px 12px", display: "flex", gap: 10 }}><span className="num">01</span> 정적 export에서 주의할 것</span>],
          ["hover",   <span className="toc-item" style={{ padding: "8px 12px", display: "flex", gap: 10, color: "var(--color-text)" }}><span className="num">01</span> 정적 export에서 주의할 것</span>],
          ["active",  <span className="toc-item active" style={{ padding: "8px 14px", display: "flex", gap: 10 }}><span className="num">01</span> 정적 export에서 주의할 것</span>],
          ["h3",      <span className="toc-item h3" style={{ padding: "8px 28px", display: "flex", gap: 10 }}>Shiki를 빌드 타임에 박아두기</span>]
        ]}
      />

      <StateMatrix
        label="Link · inline"
        items={[
          ["default", <a className="link" href="#">한 달 뒤의 내가 검색해서 도움받기</a>],
          ["hover",   <a className="link" href="#" style={{ backgroundSize: "100% 2px" }}>한 달 뒤의 내가 검색해서 도움받기</a>],
          ["visited", <a className="link" href="#" style={{ color: "var(--color-text-2)" }}>한 달 뒤의 내가 검색해서 도움받기</a>],
          ["focus",   <a className="link" href="#" style={{ outline: "2px solid var(--color-accent)", outlineOffset: 2 }}>한 달 뒤의 내가 검색해서 도움받기</a>]
        ]}
      />
    </div>
  );
}

function StateMatrix({ label, items }) {
  return (
    <div>
      <div className="mono-label" style={{ marginBottom: 14 }}>{label}</div>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        border: "1px solid var(--color-border-2)"
      }} className="state-matrix">
        {items.map(([state, node], i) => (
          <div key={state} style={{
            padding: "28px 20px",
            borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
            display: "flex", flexDirection: "column", gap: 18,
            minHeight: 130, justifyContent: "space-between"
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>{node}</div>
            <div className="mono-label" style={{ color: "var(--color-text-3)" }}>{state}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { SystemPage });
