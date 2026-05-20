import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import { CodeBlock } from "./CodeBlock";
import { LinkCard } from "./LinkCard";
import { parseMetaString, dataLanguageTransformer } from "@/lib/shiki-meta-transformer";

interface Props {
  source: string;
}

const components = {
  pre: CodeBlock,
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
                  theme: "vitesse-dark",
                  addLanguageClass: true,
                  parseMetaString,
                  transformers: [dataLanguageTransformer],
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
