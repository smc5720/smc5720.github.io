"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: string;
  fullWidthResponsive?: boolean;
}

export function AdUnit({
  slot,
  format = "auto",
  fullWidthResponsive = true,
}: AdUnitProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const pushed = useRef(false);

  useEffect(() => {
    if (!publisherId || pushed.current) return;
    try {
      pushed.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle may not be loaded yet; silently ignore
    }
  }, [publisherId]);

  if (!publisherId) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={publisherId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
