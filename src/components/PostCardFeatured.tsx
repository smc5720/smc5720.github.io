import Link from "next/link";
import type { PostMeta } from "@/types/post";
import { CategoryBadge } from "@/components/CategoryBadge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

function getGlyph(slug: string): string {
  if (slug.startsWith("next")) return "16";
  if (slug.includes("retrospective")) return "26";
  if (slug.includes("shiki")) return "{}";
  if (slug.includes("release")) return "v2";
  return "·";
}

interface ArtworkProps {
  post: PostMeta;
  index: number;
  total: number;
}

function FeaturedArtwork({ post, index, total }: ArtworkProps) {
  const glyph = getGlyph(post.slug);
  const slugPreview = post.slug.slice(0, 16);

  return (
    <div
      style={{
        position: "relative",
        minHeight: 360,
        border: "1px solid var(--color-border-2)",
        borderRadius: 2,
        background:
          "radial-gradient(700px 360px at 80% 0%, var(--color-accent-soft), transparent 60%), linear-gradient(180deg, var(--color-surface), var(--color-bg) 90%)",
        overflow: "hidden",
      }}
    >
      {/* fine grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--color-text) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-text) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(70% 60% at 50% 50%, black, transparent 90%)",
        }}
      />

      {/* big serif glyph */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(160px, 22vw, 320px)",
          fontWeight: 300,
          color: "color-mix(in srgb, var(--color-text) 6%, transparent)",
          letterSpacing: "-.04em",
          lineHeight: 0.9,
        }}
      >
        {glyph}
      </div>

      {/* top-left label */}
      <div
        className="mono-label"
        style={{ position: "absolute", left: 18, top: 16 }}
      >
        FIG · 01 / cover
      </div>

      {/* top-right: slug preview */}
      <div
        className="mono-label tabular"
        style={{ position: "absolute", right: 18, top: 16 }}
      >
        {slugPreview}
        {post.slug.length > 16 ? "…" : ""}
      </div>

      {/* accent line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -10,
          bottom: 24,
          width: 280,
          height: 2,
          background: "var(--color-accent)",
          boxShadow: "0 0 24px var(--color-accent-soft)",
        }}
      />

      {/* bottom-left tags */}
      <div
        className="mono-label"
        style={{
          position: "absolute",
          left: 18,
          bottom: 16,
          display: "flex",
          gap: 16,
        }}
      >
        {post.tags[0] && <span>{post.tags[0]}</span>}
        {post.tags[1] && (
          <>
            <span style={{ color: "var(--color-text-3)" }}>·</span>
            <span>{post.tags[1]}</span>
          </>
        )}
        <span style={{ color: "var(--color-text-3)" }}>·</span>
        <span style={{ color: "var(--color-accent)" }}>kr</span>
      </div>

      {/* bottom-right counter */}
      <div
        className="mono-label tabular"
        style={{ position: "absolute", right: 18, bottom: 16 }}
      >
        {String(index).padStart(3, "0")} / {String(total).padStart(3, "0")}
      </div>
    </div>
  );
}

interface Props {
  post: PostMeta;
  index: number;
  total: number;
}

export function PostCardFeatured({ post, index, total }: Props) {
  const tagStr = post.tags
    .slice(0, 3)
    .map((t) => `#${t}`)
    .join(" ");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="featured-card"
      style={{
        display: "grid",
        gridTemplateColumns: "1.05fr .95fr",
        gap: 56,
        padding: "40px 0",
        borderTop: "1px solid var(--color-border-2)",
        borderBottom: "1px solid var(--color-border-2)",
        position: "relative",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* left: text content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingRight: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <CategoryBadge category={post.category} size="md" />
            <span className="mono-label tabular">
              ★ Featured · {formatDate(post.date)}
            </span>
          </div>
          <h2
            className="featured-title"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 4vw, 56px)",
              letterSpacing: "-.02em",
              lineHeight: 1.02,
              margin: 0,
              fontWeight: 380,
              color: "var(--color-text)",
              transition: "color .2s var(--ease-out)",
            }}
          >
            {post.title}
          </h2>
          <p
            className="lede"
            style={{
              marginTop: 22,
              color: "var(--color-text-2)",
              maxWidth: 520,
            }}
          >
            {post.description}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 36,
          }}
        >
          <div
            className="mono-label tabular"
            style={{ display: "flex", gap: 18 }}
          >
            <span>{post.readingTime} min read</span>
            {tagStr && (
              <>
                <span>·</span>
                <span>{tagStr}</span>
              </>
            )}
          </div>
          <span className="arrow-link">
            <span>Read essay</span>
            <span className="arrow" />
          </span>
        </div>
      </div>

      {/* right: generative artwork */}
      <FeaturedArtwork post={post} index={index} total={total} />
    </Link>
  );
}
