import { ImageResponse } from "next/og";
import {
  Mark,
  MARK_16,
  MARK_32,
  MARK_64,
  MARK_128,
  scaleMark,
  maskableMark,
  type MarkSpec,
} from "@/lib/mark";

export const dynamic = "force-static";
export const contentType = "image/png";

/**
 * 16/32/64/128 — 아트보드 7a 실측값 그대로 (파비콘 멀티 해상도 `<link rel="icon">`).
 * 192/512 — manifest.ts의 PWA "any" 아이콘. 표에 없어 128 기준 선형 스케일로 생성.
 * 512-maskable — manifest.ts의 PWA maskable 아이콘. 80% 안전영역 스케일.
 */
const SIZES: Record<string, MarkSpec> = {
  "16": MARK_16,
  "32": MARK_32,
  "64": MARK_64,
  "128": MARK_128,
  "192": scaleMark(192),
  "512": scaleMark(512),
  "512-maskable": maskableMark(512),
};

export function generateImageMetadata() {
  return Object.entries(SIZES).map(([id, spec]) => ({
    id,
    size: { width: spec.size, height: spec.size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = String(await id);
  const spec = SIZES[iconId] ?? MARK_32;
  return new ImageResponse(<Mark spec={spec} />, {
    width: spec.size,
    height: spec.size,
  });
}
