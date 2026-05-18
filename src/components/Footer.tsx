import Link from "next/link";

const LINKS = [
  { href: "https://github.com/smc5720", label: "GitHub" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-serif font-black text-sm text-text-3">
            RicoCheese&apos;s Blog
          </span>
        </div>

        <div className="flex items-center gap-6">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium tracking-widest text-text-3 hover:text-accent transition-colors motion-reduce:transition-none uppercase"
            >
              {label}
            </a>
          ))}
          <Link
            href="/blog"
            className="text-xs font-medium tracking-widest text-text-3 hover:text-accent transition-colors motion-reduce:transition-none uppercase"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-xs font-medium tracking-widest text-text-3 hover:text-accent transition-colors motion-reduce:transition-none uppercase"
          >
            About
          </Link>
        </div>

        <p className="text-xs text-text-3 font-mono">
          © {year} RicoCheese
        </p>
      </div>
    </footer>
  );
}
