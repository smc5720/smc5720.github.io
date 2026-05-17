// blog-components.jsx — Header, Footer, PostCard, CategoryBadge,
// CodeBlock, TOC, ReadingProgress, MDX-style renderer, and small bits.

const { useEffect, useRef, useState, useMemo, useCallback } = React;

// ──────────────────────────────────────────────────────────────
// Small atoms
// ──────────────────────────────────────────────────────────────

function CategoryBadge({ category, size = "sm", strong }) {
  const cat = (window.CATEGORIES || []).find(c => c.id === category);
  const label = cat ? cat.label : category;
  return (
    <span
      className={"badge" + (size === "md" ? " badge-md" : "") + (strong ? " badge-strong" : "")}
      data-cat={category}
    >
      {label}
    </span>
  );
}

function MonoMeta({ children, className = "" }) {
  return <span className={"mono-label " + className}>{children}</span>;
}

function ArrowLink({ children, onClick, href }) {
  const Component = href ? "a" : "button";
  return (
    <Component className="arrow-link" onClick={onClick} href={href}>
      <span>{children}</span>
      <span className="arrow"></span>
    </Component>
  );
}

function formatDate(iso, opts = {}) {
  const d = new Date(iso);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  if (opts.long) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[d.getMonth()]} ${dd}, ${yy}`;
  }
  return `${yy}.${mm}.${dd}`;
}

// ──────────────────────────────────────────────────────────────
// Reading Progress (top 2px bar) — listens to window scroll
// ──────────────────────────────────────────────────────────────
function ReadingProgress({ targetRef }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    function onScroll() {
      const el = targetRef && targetRef.current;
      if (!el) return setPct(0);
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const seen = Math.min(Math.max(-rect.top, 0), total);
      setPct(total > 0 ? (seen / total) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetRef]);
  return <div className="read-bar" style={{ width: pct + "%" }} aria-hidden />;
}

// ──────────────────────────────────────────────────────────────
// Header — sticky top bar
// ──────────────────────────────────────────────────────────────
function Header({ route, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onS() { setScrolled(window.scrollY > 8); }
    onS();
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);

  const navItems = [
    { id: "home",   label: "Home",   to: { name: "home" } },
    { id: "blog",   label: "Blog",   to: { name: "blog" } },
    { id: "about",  label: "About",  to: { name: "about" } },
    { id: "system", label: "System", to: { name: "system" } }
  ];
  const isActive = (id) => {
    if (id === "home") return route.name === "home";
    if (id === "blog") return route.name === "blog" || route.name === "post";
    return route.name === id;
  };

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(7,7,10,.78)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
        transition: "background .25s, border-color .25s, backdrop-filter .25s"
      }}
    >
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", height: 72 }}>
        {/* logo */}
        <button
          onClick={() => onNav({ name: "home" })}
          style={{ display: "flex", alignItems: "center", gap: 10, justifySelf: "start" }}
          aria-label="Home"
        >
          <span
            aria-hidden
            style={{
              width: 28, height: 28, position: "relative",
              border: "1px solid var(--color-border-3)",
              borderRadius: 2,
              display: "grid", placeItems: "center",
              background: "var(--color-surface)"
            }}
          >
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
              color: "var(--color-accent)", letterSpacing: 0, lineHeight: 1
            }}>R</span>
            <span style={{
              position: "absolute", right: -3, bottom: -3,
              width: 6, height: 6, background: "var(--color-accent)"
            }} />
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, gap: 2 }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 17, letterSpacing: "-.01em", color: "var(--color-text)" }}>
              RicoCheese
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--color-text-3)" }}>
              the studio log · v2.0
            </span>
          </span>
        </button>

        {/* nav */}
        <nav className="hdr-nav" style={{ display: "flex", gap: 4, justifySelf: "center", padding: 4, border: "1px solid var(--color-border)", borderRadius: 2, background: "rgba(14,14,20,.6)" }}>
          {navItems.map(n => (
            <button
              key={n.id}
              onClick={() => onNav(n.to)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                padding: "8px 14px",
                color: isActive(n.id) ? "var(--color-text)" : "var(--color-text-2)",
                background: isActive(n.id) ? "rgba(255,255,255,.04)" : "transparent",
                borderRadius: 2,
                transition: "color .15s, background .15s"
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* right cluster */}
        <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono-label hdr-meta" style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-accent)", boxShadow: "0 0 8px var(--color-accent)" }} />
            <span>Live · KR</span>
          </span>
          <button onClick={() => onNav({ name: "blog" })} className="btn" style={{ height: 36, padding: "0 14px", whiteSpace: "nowrap" }}>
            <span>Read posts</span>
            <span style={{ fontFamily: "var(--font-mono)", opacity: .6 }}>→</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ──────────────────────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────────────────────
function Footer({ onNav }) {
  return (
    <footer style={{ marginTop: 120, paddingBottom: 64, position: "relative" }}>
      <div className="container">
        <div className="hairline" style={{ marginBottom: 40 }} />
        <div className="ft-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <div className="display display-h3" style={{ marginBottom: 16 }}>
              한 주에 한 편씩,<br/>천천히.
            </div>
            <p className="small" style={{ maxWidth: 360 }}>
              RicoCheese's Blog는 한 사람이 운영하는 기술·회고·릴리스 노트 모음입니다. 글의 호흡은 짧을 수도, 길 수도 있습니다.
            </p>
          </div>
          <div>
            <div className="mono-label" style={{ marginBottom: 14 }}>Navigate</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Home", { name: "home" }],
                ["Blog", { name: "blog" }],
                ["About", { name: "about" }],
                ["System", { name: "system" }]
              ].map(([l, to]) => (
                <li key={l}><button onClick={() => onNav(to)} className="link" style={{ fontSize: 14 }}>{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono-label" style={{ marginBottom: 14 }}>Subscribe</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><a className="link" href="#rss" style={{ fontSize: 14 }}>RSS feed</a></li>
              <li><a className="link" href="#atom" style={{ fontSize: 14 }}>Atom</a></li>
              <li><a className="link" href="#json" style={{ fontSize: 14 }}>JSON feed</a></li>
            </ul>
          </div>
          <div>
            <div className="mono-label" style={{ marginBottom: 14 }}>Elsewhere</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><a className="link" href="#gh" style={{ fontSize: 14 }}>GitHub · smc5720</a></li>
              <li><a className="link" href="#twitter" style={{ fontSize: 14 }}>Twitter / X</a></li>
              <li><a className="link" href="#mail" style={{ fontSize: 14 }}>hello@ricocheese.dev</a></li>
            </ul>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", marginTop: 64 }}>
          <pre style={{
            margin: 0, fontFamily: "var(--font-mono)", color: "var(--color-text-3)",
            fontSize: 10, lineHeight: 1.2, letterSpacing: 0
          }}>{`╭─────────────────────────────────────────╮
│  RICOCHEESE · STUDIO LOG · EST. 2022    │
│  built with next.js · mdx · shiki       │
│  hosted on github pages · main branch   │
╰─────────────────────────────────────────╯`}</pre>
          <div className="mono-label tabular" style={{ textAlign: "right" }}>
            © 2022–2026 · all writing CC BY 4.0
          </div>
        </div>
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────────────────────
// PostCard variants
// ──────────────────────────────────────────────────────────────

function PostCardFeatured({ post, onOpen }) {
  return (
    <article
      className="fade-up"
      style={{
        display: "grid",
        gridTemplateColumns: "1.05fr .95fr",
        gap: 56,
        padding: "40px 0",
        borderTop: "1px solid var(--color-border-2)",
        borderBottom: "1px solid var(--color-border-2)",
        position: "relative",
        cursor: "pointer"
      }}
      onClick={() => onOpen(post)}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span className="badge badge-md badge-strong" data-cat={post.category}>
              {(window.CATEGORIES || []).find(c => c.id === post.category)?.label || post.category}
            </span>
            <span className="mono-label tabular">★ Featured · {formatDate(post.date)}</span>
          </div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 4vw, 56px)", letterSpacing: "-.02em", lineHeight: 1.02, margin: 0 }}>
            {post.title}
          </h2>
          <p className="lede" style={{ marginTop: 22, color: "var(--color-text-2)", maxWidth: 520 }}>
            {post.description}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 36 }}>
          <div className="mono-label tabular" style={{ display: "flex", gap: 18 }}>
            <span>{post.readMin} min read</span>
            <span>·</span>
            <span>{post.tags.slice(0,3).map(t => "#"+t).join(" ")}</span>
          </div>
          <ArrowLink>Read essay</ArrowLink>
        </div>
      </div>

      {/* cover artwork */}
      <FeaturedArtwork post={post} />
    </article>
  );
}

function FeaturedArtwork({ post }) {
  // generative tactile artwork — different per slug, no external images
  return (
    <div style={{
      position: "relative", minHeight: 360,
      border: "1px solid var(--color-border-2)",
      borderRadius: 2,
      background: `
        radial-gradient(700px 360px at 80% 0%, rgba(200,255,0,.12), transparent 60%),
        linear-gradient(180deg, var(--color-surface), var(--color-bg) 90%)`,
      overflow: "hidden"
    }}>
      {/* fine grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(70% 60% at 50% 50%, black, transparent 90%)"
      }} />

      {/* big serif glyph */}
      <div style={{
        position: "absolute", inset: 0,
        display: "grid", placeItems: "center",
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(160px, 22vw, 320px)",
        fontWeight: 300, color: "rgba(237,237,239,.06)",
        letterSpacing: "-.04em", lineHeight: .9
      }}>
        {post.slug.startsWith("next") ? "16" :
         post.slug.includes("retrospective") ? "26" :
         post.slug.includes("shiki") ? "{}" :
         post.slug.includes("release") ? "v2" : "·"}
      </div>

      {/* spec label corners */}
      <div className="mono-label" style={{ position: "absolute", left: 18, top: 16 }}>
        FIG · 01 / cover
      </div>
      <div className="mono-label tabular" style={{ position: "absolute", right: 18, top: 16 }}>
        {post.slug.slice(0,16)}…
      </div>

      {/* accent diagonal stripe */}
      <div aria-hidden style={{
        position: "absolute", right: -10, bottom: 24,
        width: 280, height: 2, background: "var(--color-accent)",
        boxShadow: "0 0 24px var(--color-accent-soft)"
      }} />

      <div className="mono-label" style={{ position: "absolute", left: 18, bottom: 16, display: "flex", gap: 16 }}>
        <span>{post.tags[0]}</span>
        <span style={{ color: "var(--color-text-3)" }}>·</span>
        <span>{post.tags[1]}</span>
        <span style={{ color: "var(--color-text-3)" }}>·</span>
        <span style={{ color: "var(--color-accent)" }}>kr</span>
      </div>
      <div className="mono-label tabular" style={{ position: "absolute", right: 18, bottom: 16 }}>
        {String((window.POSTS || []).findIndex(p => p.slug === post.slug) + 1).padStart(3, "0")} / {String((window.POSTS || []).length).padStart(3, "0")}
      </div>
    </div>
  );
}

function PostCard({ post, onOpen, variant = "card" }) {
  if (variant === "row") {
    return (
      <button onClick={() => onOpen(post)} className="row" style={{ width: "100%", textAlign: "left", background: "transparent" }}>
        <span className="mono-label tabular row-date-col" style={{ color: "var(--color-text-3)" }}>{formatDate(post.date)}</span>
        <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="row-title">{post.title}</span>
          <span style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--color-text-3)" }}>
            <CategoryBadge category={post.category} />
            <span className="mono-label" style={{ color: "var(--color-text-3)" }}>{post.readMin} min · #{post.tags[0]}</span>
          </span>
        </span>
        <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>
          ↗
        </span>
      </button>
    );
  }
  return (
    <button onClick={() => onOpen(post)} className="card" style={{ textAlign: "left", background: "transparent", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <CategoryBadge category={post.category} />
        <span className="mono-label tabular" style={{ color: "var(--color-text-3)" }}>{formatDate(post.date)}</span>
      </div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-desc">{post.description}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
        <span className="mono-label" style={{ color: "var(--color-text-3)" }}>
          {post.readMin} min · #{post.tags[0]}
        </span>
        <span className="mono-label" style={{ color: "var(--color-text-3)" }}>→</span>
      </div>
    </button>
  );
}

// ──────────────────────────────────────────────────────────────
// CodeBlock — line-numbered, with filename label + copy
// `lines` is an array of token-segment arrays from blog-data.
// each line is [class, text, class, text, ...].
// ──────────────────────────────────────────────────────────────
function CodeBlock({ filename, lang, lines }) {
  const [copied, setCopied] = useState(false);
  function asPlain() {
    return lines.map(line => {
      if (!line || line.length === 0) return "";
      return line.map(seg => Array.isArray(seg) ? seg[1] : "").join("");
    }).join("\n");
  }
  function onCopy() {
    try {
      navigator.clipboard && navigator.clipboard.writeText(asPlain());
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "flex", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-border-3)" }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-border-3)" }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-accent)" }} />
          </span>
          <span className="filename">{filename || "untitled"}</span>
        </div>
        <div className="actions">
          <span className="lang">{lang || ""}</span>
          <button className={"copy-btn" + (copied ? " ok" : "")} onClick={onCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre><code>
        {lines.map((line, i) => (
          <div key={i} className="line">
            <span className="ln tabular">{i + 1}</span>
            <span style={{ minWidth: 0, whiteSpace: "pre" }}>
              {line && line.length ? line.map(([cls, text], j) => (
                <span key={j} className={cls ? "tok-" + cls : ""}>{text}</span>
              )) : <span> </span>}
            </span>
          </div>
        ))}
      </code></pre>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MDX-style renderer — consumes body blocks from blog-data
// ──────────────────────────────────────────────────────────────

function slugifyHeading(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
}

function MDXBody({ blocks }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "lede":
            return <p key={i} className="lede" style={{ marginTop: 0, marginBottom: 32, color: "var(--color-text)" }}>{b.text}</p>;
          case "p":
            return <p key={i}>{renderInline(b.text)}</p>;
          case "h2":
            return <h2 key={i} id={slugifyHeading(b.text)}>{b.text}</h2>;
          case "h3":
            return <h3 key={i} id={slugifyHeading(b.text)}>{b.text}</h3>;
          case "ul":
            return <ul key={i}>{b.items.map((it, k) => <li key={k}>{renderInline(it)}</li>)}</ul>;
          case "ol":
            return <ol key={i}>{b.items.map((it, k) => <li key={k}>{renderInline(it)}</li>)}</ol>;
          case "blockquote":
            return <blockquote key={i}>{b.text}</blockquote>;
          case "hr":
            return <hr key={i} />;
          case "code":
            return <CodeBlock key={i} filename={b.filename} lang={b.lang} lines={b.lines} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// minimal inline markdown: **bold**, `code`, _italic_
function renderInline(text) {
  if (typeof text !== "string") return text;
  const parts = [];
  let rest = text;
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`|_([^_]+)_)/;
  let m;
  let key = 0;
  while ((m = re.exec(rest))) {
    if (m.index > 0) parts.push(rest.slice(0, m.index));
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3]) parts.push(<code key={key++}>{m[3]}</code>);
    else if (m[4]) parts.push(<em key={key++}>{m[4]}</em>);
    rest = rest.slice(m.index + m[0].length);
  }
  if (rest) parts.push(rest);
  return parts;
}

// ──────────────────────────────────────────────────────────────
// Table of Contents — scroll-spy
// ──────────────────────────────────────────────────────────────
function TableOfContents({ blocks, scrollRoot }) {
  const items = useMemo(() => {
    return blocks
      .map((b, i) => (b.type === "h2" || b.type === "h3") ? { id: slugifyHeading(b.text), text: b.text, level: b.type, idx: i } : null)
      .filter(Boolean);
  }, [blocks]);

  const [active, setActive] = useState(items[0] ? items[0].id : null);

  useEffect(() => {
    function onScroll() {
      let cur = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top - 120 <= 0) cur = it.id;
      }
      setActive(cur);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="toc-title">On this page</div>
      <ul className="toc-list">
        {items.map((it, i) => {
          const h2Index = items.slice(0, i + 1).filter(x => x.level === "h2").length;
          const num = it.level === "h2" ? String(h2Index).padStart(2, "0") : "";
          return (
            <li key={it.id}>
              <button
                className={"toc-item " + (it.level === "h3" ? "h3" : "") + (active === it.id ? " active" : "")}
                onClick={() => {
                  const el = document.getElementById(it.id);
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
                }}
              >
                {num && <span className="num">{num}</span>}
                <span>{it.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ──────────────────────────────────────────────────────────────
// Hero stat counter (categories)
// ──────────────────────────────────────────────────────────────
function CategoryCounts({ posts, onFilter }) {
  const cats = (window.CATEGORIES || []).filter(c => c.id !== "all");
  const counts = {};
  for (const c of cats) counts[c.id] = posts.filter(p => p.category === c.id).length;
  return (
    <div className="cat-grid" style={{
      display: "grid", gridTemplateColumns: `repeat(${cats.length + 1}, 1fr)`,
      borderTop: "1px solid var(--color-border-2)", borderBottom: "1px solid var(--color-border-2)"
    }}>
      <button onClick={() => onFilter("all")} className="cat-cell" style={cellStyle()}>
        <span className="mono-label" style={{ color: "var(--color-text-3)" }}>Total</span>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 44, lineHeight: 1, color: "var(--color-text)", letterSpacing: "-.02em" }}>
          {String(posts.length).padStart(2, "0")}
        </span>
        <span className="mono-label" style={{ color: "var(--color-text-3)" }}>essays · since 2022</span>
      </button>
      {cats.map((c, i) => (
        <button key={c.id} onClick={() => onFilter(c.id)} className="cat-cell" style={{ ...cellStyle(), borderLeft: "1px solid var(--color-border-2)" }}>
          <span className="mono-label" style={{ color: "var(--color-text-3)" }}>{String(i + 1).padStart(2, "0")} · {c.label}</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 44, lineHeight: 1, color: "var(--color-text)", letterSpacing: "-.02em", display: "flex", alignItems: "baseline", gap: 8 }}>
            {String(counts[c.id] || 0).padStart(2, "0")}
            <span style={{ width: 8, height: 8, borderRadius: 999, background: c.color, alignSelf: "center", flexShrink: 0 }} />
          </span>
          <span className="mono-label" style={{ color: "var(--color-text-3)" }}>view filter →</span>
        </button>
      ))}
    </div>
  );
}
function cellStyle() {
  return {
    padding: "28px 24px",
    display: "flex", flexDirection: "column", gap: 12,
    alignItems: "flex-start",
    background: "transparent",
    textAlign: "left",
    transition: "background .2s",
    cursor: "pointer"
  };
}

// expose to global so other Babel scripts can use
Object.assign(window, {
  Header, Footer, PostCard, PostCardFeatured, CategoryBadge, MonoMeta,
  ArrowLink, CodeBlock, MDXBody, TableOfContents, ReadingProgress,
  CategoryCounts, formatDate, slugifyHeading, FeaturedArtwork
});
