import { ImageResponse } from "next/og";
import { getAllPosts } from "@/lib/posts";
import { ACCENT_HEX, MARK_BG } from "@/lib/mark";

export const dynamic = "force-static";

export const alt = "RicoCheese's Blog";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const FG = "#e6e6e8"; // --color-fg
const FG_MUTED = "#9a9aa2"; // --color-fg-muted
const FG_SUBTLE = "#8d8d95"; // --color-fg-subtle
const LINE = "#1a1a1d"; // --color-line

const HERO_LINE_1 = "매일의 기술 뉴스를 모으고,";
const HERO_LINE_2 = "가끔 직접 쓴다.";
const HERO_MAX_WIDTH = 940;

/**
 * 긴 제목 규칙 — 64px → 48px 한 단계만 축소한다 (더 세분화하지 않는다).
 *
 * 글자 수로 세면 안 된다. 한글은 한 글자가 약 1em이지만 공백과 라틴 문자는 그 절반 이하라,
 * 같은 글자 수라도 실제 폭이 크게 달라진다. 기본 카피 "매일의 기술 뉴스를 모으고,"는
 * 15자지만 공백 3개를 포함해 실측 폭이 12.45em(64px에서 797px)으로 940px 안에 들어간다.
 * 글자 수 기준(14자 초과)으로 재면 이 카피가 불필요하게 48px로 줄어든다.
 */
const CJK = /[ᄀ-ᇿ가-힯　-〿＀-￯]/;

/** 문자열의 대략적인 폭을 em 단위로 추정한다 (한글 1em, 공백 0.30em, 그 외 0.55em) */
function widthInEm(text: string): number {
  return [...text].reduce(
    (sum, ch) => sum + (CJK.test(ch) ? 1 : ch === " " ? 0.3 : 0.55),
    0,
  );
}

function heroFontSize(lines: string[]): number {
  const widest = Math.max(...lines.map(widthInEm));
  return widest * 64 > HERO_MAX_WIDTH ? 48 : 64;
}

export default async function Image() {
  const posts = getAllPosts();
  const totalCount = posts.length;
  const years = posts.map((p) => new Date(p.published_at ?? p.date).getFullYear());
  const currentYear = new Date().getFullYear();
  const startYear = years.length ? Math.min(...years) : currentYear;
  const endYear = years.length ? Math.max(...years) : currentYear;

  const heroSize = heroFontSize([HERO_LINE_1, HERO_LINE_2]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: MARK_BG,
          padding: "72px",
          color: FG,
        }}
      >
        {/* 상단 — 워드마크 + 바 / 사이트 주소 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: FG,
              }}
            >
              RicoCheese
            </span>
            <div
              style={{
                marginTop: 12,
                width: 120,
                height: 6,
                borderRadius: 3,
                background: ACCENT_HEX,
              }}
            />
          </div>
          <span
            style={{
              display: "flex",
              fontFamily: "monospace",
              fontSize: 20,
              color: FG_SUBTLE,
              letterSpacing: "0.02em",
            }}
          >
            smc5720.github.io
          </span>
        </div>

        {/* 중앙 — 히어로 카피 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: HERO_MAX_WIDTH,
              fontSize: heroSize,
              fontWeight: 700,
              lineHeight: 1.22,
              letterSpacing: "-0.035em",
              color: FG,
            }}
          >
            <span style={{ display: "flex" }}>{HERO_LINE_1}</span>
            <span style={{ display: "flex" }}>{HERO_LINE_2}</span>
          </div>
          <span
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 26,
              lineHeight: 1.6,
              color: FG_MUTED,
            }}
          >
            인프라 · 오픈소스 · 개발 조직
          </span>
        </div>

        {/* 하단 — hairline + 편수 · 연도 범위 · 사이트 성격 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 8,
            gap: 36,
            fontFamily: "monospace",
            fontSize: 20,
            color: FG_SUBTLE,
          }}
        >
          <div style={{ display: "flex" }}>
            <span style={{ color: FG }}>{totalCount}</span>
            <span>&nbsp;편</span>
          </div>
          {/* 글이 한 해에만 있으면 "2026—2026" 대신 "2026" 하나만 쓴다 */}
          <div style={{ display: "flex" }}>
            <span style={{ color: FG }}>{startYear}</span>
            {endYear !== startYear && (
              <>
                <span>—</span>
                <span style={{ color: FG }}>{endYear}</span>
              </>
            )}
          </div>
          <span style={{ display: "flex", marginLeft: "auto" }}>개인 기술 블로그</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
