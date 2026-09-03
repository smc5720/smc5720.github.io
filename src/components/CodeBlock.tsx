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
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <span className="codeblock-dots" aria-hidden="true">
            <span className="codeblock-dot" />
            <span className="codeblock-dot" />
          </span>
          {filename && <span className="filename">{filename}</span>}
        </div>
        <div className="codeblock-head-actions">
          {lang && <span className="lang">{lang}</span>}
          <button
            type="button"
            className={copied ? "copy-btn ok" : "copy-btn"}
            onClick={handleCopy}
            aria-label={copied ? "코드가 복사되었습니다" : "코드 복사"}
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
      </div>
      <pre ref={preRef} className={className} {...rest}>
        {children}
      </pre>
    </div>
  );
}
