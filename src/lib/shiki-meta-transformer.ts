/**
 * parseMetaString for @shikijs/rehype.
 * Extracts `filename="..."` from the raw code fence meta string and
 * returns it so Shiki serialises it onto the <pre> element as a data attribute.
 */
export function parseMetaString(
  metaString: string
): Record<string, string> | undefined {
  const result: Record<string, string> = {};

  const filenameMatch = metaString.match(/filename="([^"]+)"/);
  if (filenameMatch) {
    result["data-filename"] = filenameMatch[1];
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Shiki transformer that copies the resolved language name onto the <pre>
 * element as `data-language`, so the CodeBlock component can display it
 * in the header chip without parsing className.
 */
export const dataLanguageTransformer = {
  name: "rico-blog:data-language",
  pre(
    this: { options: { lang: string } },
    node: { properties: Record<string, unknown> }
  ) {
    node.properties["data-language"] = this.options.lang;
  },
};

/**
 * Parses a Shiki meta string's `{1,3-5}` line-range notation into a set of
 * 1-based line numbers. Returns an empty set if the meta string carries no
 * such notation (e.g. it's just `filename="..."`).
 */
function parseHighlightLines(raw: string): Set<number> {
  const match = raw.match(/\{([\d,\-\s]+)\}/);
  const lines = new Set<number>();
  if (!match) return lines;

  for (const part of match[1].split(",")) {
    const token = part.trim();
    if (!token) continue;

    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      for (let n = start; n <= end; n++) lines.add(n);
    } else if (/^\d+$/.test(token)) {
      lines.add(Number(token));
    }
  }

  return lines;
}

/**
 * Shiki transformer that reads the raw meta string (e.g. ```ts {2,4-6}```)
 * off `this.options.meta.__raw` — the field @shikijs/rehype populates from
 * the fenced-code-block header — and tags the matching `.line` spans with a
 * `highlighted` class the codeblock CSS turns into an accent-tinted row.
 */
export const lineHighlightTransformer = {
  name: "rico-blog:line-highlight",
  line(
    this: {
      options: { meta?: { __raw?: string } };
      addClassToHast: (node: unknown, className: string) => void;
    },
    node: unknown,
    line: number
  ) {
    const raw = this.options.meta?.__raw;
    if (!raw) return;
    if (parseHighlightLines(raw).has(line)) {
      this.addClassToHast(node, "highlighted");
    }
  },
};
