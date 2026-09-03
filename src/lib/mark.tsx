/**
 * v3 마크 — 워드마크 첫 글자 `R` + 그 아래 액센트 바 1개.
 * icon.tsx / apple-icon.tsx / opengraph-image.tsx가 공유하는 렌더 소스.
 * 실측값 출처: docs/redesign/v3/blog-v3.dc.html 의 「7a 아이콘」 아트보드.
 */
import type { ReactElement } from "react";

/**
 * 폰트 — public/fonts/PretendardVariable.woff2를 next/og(Satori)에 넘기는 시도를 했으나
 * 빌드 시 `Error: Unsupported OpenType signature wOF2`로 실패했다 (Satori는 ttf/otf/woff만
 * 지원, woff2는 지원 목록에 없음 — node_modules/next/dist/docs 의 image-response.md 참고).
 * 새 폰트 파일을 내려받지 말라는 제약이 있어, Satori 기본 폰트에 맡긴다(fontFamily 미지정).
 */

// --color-accent: oklch(0.74 0.13 155) → sRGB 변환값.
// Satori(next/og)는 oklch()를 렌더링하지 못해 hex 상수로 고정한다.
// OKLab 역변환(Björn Ottosson 공식)으로 계산:
//   a = 0.13*cos(155°) = -0.11782, b = 0.13*sin(155°) = 0.05494
//   l_=0.70516 m_=0.74893 s_=0.67959 → l=l_^3=0.35060 m=0.42010 s=0.31388
//   linear rgb = (0.11220, 0.54457, 0.23900) → sRGB 감마 보정 → (94, 195, 134)
// 검증: node -e '<위 식을 그대로 구현>' → { R:94, G:195, B:134, hex:"#5ec386" }
export const ACCENT_HEX = "#5ec386";
// --color-bg — 아이콘 배경은 항상 이 값으로 불투명 (라이트 배경 탭에서도 형태가 남아야 한다)
export const MARK_BG = "#0c0c0d";
// --color-fg-strong — 마크의 R 글자는 최대 대비 흰색, 바만 액센트
const R_COLOR = "#ffffff";

export interface MarkSpec {
  /** 정사각 캔버스 한 변 길이(px) */
  size: number;
  /** 캔버스 모서리 radius(px) */
  radius: number;
  /** "R" 글자 font-size(px) */
  rFont: number;
  /** 액센트 바 너비(px) */
  barW: number;
  /** 액센트 바 높이(px) */
  barH: number;
  /** 액센트 바 radius(px) */
  barRadius: number;
  /** R과 바 사이 간격(px) */
  gap: number;
}

/** 아트보드 7a 실측값 그대로 — 소형 사이즈는 광학 보정이 있어 선형 스케일과 값이 다르다 */
export const MARK_16: MarkSpec = { size: 16, radius: 3, rFont: 9, barW: 8, barH: 1, barRadius: 0, gap: 1 };
export const MARK_32: MarkSpec = { size: 32, radius: 5, rFont: 17, barW: 14, barH: 2, barRadius: 1, gap: 2 };
export const MARK_64: MarkSpec = { size: 64, radius: 8, rFont: 32, barW: 26, barH: 3, barRadius: 1, gap: 5 };
export const MARK_128: MarkSpec = { size: 128, radius: 12, rFont: 64, barW: 52, barH: 5, barRadius: 2, gap: 10 };
export const MARK_180: MarkSpec = { size: 180, radius: 40, rFont: 84, barW: 68, barH: 6, barRadius: 3, gap: 14 };

/**
 * 표에 없는 사이즈(PWA 192·512 "any")는 128 기준 실측값을 선형 스케일해 만든다.
 * 128이 표에서 가장 큰 "정사각 아이콘" 기준값이기 때문.
 */
export function scaleMark(size: number): MarkSpec {
  const k = size / MARK_128.size;
  return {
    size,
    radius: Math.round(MARK_128.radius * k),
    rFont: Math.round(MARK_128.rFont * k),
    barW: Math.round(MARK_128.barW * k),
    barH: Math.max(1, Math.round(MARK_128.barH * k)),
    barRadius: Math.round(MARK_128.barRadius * k),
    gap: Math.round(MARK_128.gap * k),
  };
}

/**
 * maskable(512) — 이슈 표의 "maskable" 행(radius12·R66·bar54×5·gap12)은 128 기준 마크와
 * 거의 같은 값이다. 즉 "128 기준 마크를 512 캔버스 안에 80%로 축소해 넣어라"는 스펙:
 * 512 * 0.8 / 128 = 3.2배가 표의 절대값에 곱해지는 스케일 계수다.
 * 이렇게 하면 원형 크롭(OS 마스크) 안에서도 R과 바가 잘리지 않는다.
 */
export function maskableMark(canvasSize = 512): MarkSpec {
  const scale = (canvasSize * 0.8) / 128;
  return {
    size: canvasSize,
    radius: Math.round(12 * scale),
    rFont: Math.round(66 * scale),
    barW: Math.round(54 * scale),
    barH: Math.round(5 * scale),
    barRadius: Math.round(2 * scale),
    gap: Math.round(12 * scale),
  };
}

export function Mark({ spec }: { spec: MarkSpec }): ReactElement {
  const { size, radius, rFont, barW, barH, barRadius, gap } = spec;
  return (
    <div
      style={{
        width: size,
        height: size,
        background: MARK_BG,
        borderRadius: radius,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          display: "flex",
          fontSize: rFont,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: R_COLOR,
        }}
      >
        R
      </span>
      <div
        style={{
          marginTop: gap,
          width: barW,
          height: barH,
          borderRadius: barRadius,
          background: ACCENT_HEX,
        }}
      />
    </div>
  );
}
