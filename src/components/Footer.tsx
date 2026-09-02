import Link from "next/link";

const NAVIGATE = [
  { href: "/",      label: "Home" },
  { href: "/blog",  label: "Blog" },
  { href: "/about", label: "About" },
];

const SUBSCRIBE = [
  { href: "/feed.xml", label: "RSS feed" },
];

const ELSEWHERE = [
  { href: "https://github.com/smc5720", label: "GitHub", external: true },
  { href: "mailto:smc5720@gmail.com",   label: "Email",  external: false },
];

export function Footer() {
  return (
    <footer>
      <div className="frame ft">
        {/* 블록 1 — 브랜드 */}
        <div className="ft-brand">
          <div className="ft-brand-name">RicoCheese</div>
          <p className="ft-brand-desc">
            기술 뉴스를 모으고, 가끔 직접 쓰는 개인 블로그.
          </p>
        </div>

        {/* 블록 2 — Navigate */}
        <div className="ft-col">
          <div className="ft-col-head">Navigate</div>
          {NAVIGATE.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </div>

        {/* 블록 3 — Subscribe */}
        <div className="ft-col">
          <div className="ft-col-head">Subscribe</div>
          {SUBSCRIBE.map(({ href, label }) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </div>

        {/* 블록 4 — Elsewhere */}
        <div className="ft-col">
          <div className="ft-col-head">Elsewhere</div>
          {ELSEWHERE.map(({ href, label, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {label}
            </a>
          ))}
        </div>

        {/* 하단 저작권 행 */}
        <div className="ft-bottom">
          © 2026 RicoCheese · 본문 CC BY-NC 4.0, 코드 MIT
        </div>
      </div>
    </footer>
  );
}
