import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";

interface Props {
  source: string;
}

export async function MDXContent({ source }: Props) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
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
                  theme: "tokyo-night",
                  addLanguageClass: true,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
