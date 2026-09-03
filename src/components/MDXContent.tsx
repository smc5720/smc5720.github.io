import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import { CodeBlock } from "./CodeBlock";
import { LinkCard } from "./LinkCard";
import {
  parseMetaString,
  dataLanguageTransformer,
  lineHighlightTransformer,
} from "@/lib/shiki-meta-transformer";
import { ricoCodeTheme } from "@/lib/shiki-theme";

interface Props {
  source: string;
}

/** 표는 본문 폭(820px)을 넘을 수 있으므로 자체 가로 스크롤을 갖는다 */
function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="table-scroll">
      <table>{children}</table>
    </div>
  );
}

const components = {
  pre: CodeBlock,
  table: Table,
  LinkCard,
};

export async function MDXContent({ source }: Props) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "append",
                  properties: { className: ["anchor"] },
                  content: { type: "text", value: " #" },
                },
              ],
              [
                rehypeShiki,
                {
                  theme: ricoCodeTheme,
                  addLanguageClass: true,
                  parseMetaString,
                  transformers: [dataLanguageTransformer, lineHighlightTransformer],
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
