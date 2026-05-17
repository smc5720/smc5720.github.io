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
