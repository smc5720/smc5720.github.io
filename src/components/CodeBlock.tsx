"use client";

import { useRef, useState } from "react";

interface CodeBlockProps {
  children?: React.ReactNode;
  "data-filename"?: string;
  "data-language"?: string;
  className?: string;
  [key: string]: unknown;
}

export function CodeBlock({
  children,
  "data-filename": filename,
  "data-language": dataLanguage,
  className,
  ...rest
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Extract language from className (Shiki adds language-* via addLanguageClass)
  const langFromClass = className
    ?.split(" ")
    .find((c) => c.startsWith("language-"))
    ?.slice(9);
  const lang = dataLanguage || langFromClass || "";

  function handleCopy() {
    const text = preRef.current?.innerText ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "var(--r-full)",
                background: "var(--color-border-3)",
                display: "block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "var(--r-full)",
                background: "var(--color-border-3)",
                display: "block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "var(--r-full)",
                background: "var(--color-accent)",
                display: "block",
                flexShrink: 0,
              }}
            />
          </span>
          <span className="filename">{filename || "untitled"}</span>
        </div>
        <div className="codeblock-head-actions">
          {lang && <span className="lang">{lang}</span>}
          <button
            type="button"
            className={copied ? "copy-btn ok" : "copy-btn"}
            onClick={handleCopy}
            aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre ref={preRef} className={className} {...rest}>
        {children}
      </pre>
    </div>
  );
}
