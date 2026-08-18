"use client";

import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";

/**
 * The theme lives on `<html data-theme>`, written by the FOUC-prevention script
 * in layout.tsx before first paint and toggled by the header. That makes it an
 * external store, so read it with useSyncExternalStore rather than copying it
 * into state from an effect — the effect version re-rendered every consumer an
 * extra time on mount.
 */
function subscribe(onStoreChange: () => void): () => void {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ThemeMode {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/** Static export prerenders without a theme attribute; dark is the default. */
function getServerSnapshot(): ThemeMode {
  return "dark";
}

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
