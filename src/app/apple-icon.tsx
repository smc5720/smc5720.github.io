import { ImageResponse } from "next/og";
import { Mark, MARK_180 } from "@/lib/mark";

export const dynamic = "force-static";
export const size = { width: MARK_180.size, height: MARK_180.size };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<Mark spec={MARK_180} />, { ...size });
}
