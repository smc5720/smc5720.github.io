import Link from "next/link";

const NAVIGATE = [
  { href: "/",       label: "Home" },
  { href: "/blog",   label: "Blog" },
  { href: "/about",  label: "About" },
  { href: "/system", label: "System" },
];

const SUBSCRIBE = [
  { href: "/feed.xml", label: "RSS feed" },
];

const ELSEWHERE = [
  { href: "https://github.com/smc5720", label: "GitHub · smc5720",   external: true },
  { href: "mailto:smc5720@gmail.com",   label: "smc5720@gmail.com", external: false },
];

const ASCII = `╭─────────────────────────────────────────╮
│  RICOCHEESE · STUDIO LOG · EST. 2022    │
│  built with next.js · mdx · shiki       │
│  hosted on github pages · main branch   │
╰─────────────────────────────────────────╯`;

export function Footer() {
  return (
    <footer style={{ marginTop: 120, paddingBottom: 64, position: "relative" }}>
      <div className="container">
        {/* hairline */}
        <div className="hairline" style={{ marginBottom: 40 }} />

        {/* 4-col grid */}
        <div className="ft-grid">
          {/* Col 1 — brand */}
          <div>
            <div className="display display-h3" style={{ marginBottom: 16 }}>
              RicoCheese&#39;s Blog
            </div>
            <p className="small" style={{ maxWidth: 360 }}>
              코드, 회고, 릴리스 노트를 기록하는 기술 블로그. 2022년 시작.
            </p>
          </div>

          {/* Col 2 — Navigate */}
          <div>
            <div className="mono-label" style={{ marginBottom: 14 }}>Navigate</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {NAVIGATE.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="link" style={{ fontSize: 14 }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Subscribe */}
          <div>
            <div className="mono-label" style={{ marginBottom: 14 }}>Subscribe</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {SUBSCRIBE.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="link" style={{ fontSize: 14 }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Elsewhere */}
          <div>
            <div className="mono-label" style={{ marginBottom: 14 }}>Elsewhere</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {ELSEWHERE.map(({ href, label, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="link"
                    style={{ fontSize: 14 }}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row: ASCII box + copyright */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "end",
            marginTop: 64,
            gap: 24,
          }}
        >
          <pre
            className="ascii-box"
            style={{
              margin: 0,
              color: "var(--color-text-3)",
              fontSize: 10,
              lineHeight: 1.2,
              overflow: "hidden",
            }}
          >
            {ASCII}
          </pre>
          <div
            className="mono-label tabular"
            style={{ textAlign: "right", whiteSpace: "nowrap" }}
          >
            © 2022–2026 · all writing CC BY 4.0
          </div>
        </div>
      </div>
    </footer>
  );
}
