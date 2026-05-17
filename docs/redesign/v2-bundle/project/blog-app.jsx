// blog-app.jsx — root, route switcher, tweaks panel

const { useEffect, useState, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C8FF00",
  "displayFont": "fraunces",
  "bodyWidth": "default",
  "gridLines": true,
  "noise": true,
  "headerTreatment": "studio",
  "lightTheme": false,
  "pagination": "all"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState(parseHash());

  // route navigation
  const onNav = useCallback((next) => {
    setRoute(next);
    const hash = serializeHash(next);
    if (location.hash !== "#" + hash) location.hash = hash;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    function onHash() { setRoute(parseHash()); }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // apply theme tweaks
  useEffect(() => {
    const root = document.documentElement;
    // light/dark
    root.setAttribute("data-theme", t.lightTheme ? "light" : "dark");
    root.style.setProperty("--color-accent", t.accent);
    root.style.setProperty("--color-accent-soft", hexToRgba(t.accent, .14));
    root.style.setProperty("--color-accent-line", hexToRgba(t.accent, .32));
    // body class toggles
    document.body.classList.toggle("noise-on", !!t.noise);
    document.body.classList.toggle("grid-on", !!t.gridLines);
    // body width override (prose container)
    let cw = "720px";
    if (t.bodyWidth === "narrow") cw = "620px";
    else if (t.bodyWidth === "wide") cw = "820px";
    root.style.setProperty("--container-prose", cw);
    root.style.setProperty("--container-narrow", cw === "620px" ? "680px" : cw === "820px" ? "880px" : "760px");
    // Display font swap
    const displayStack = t.displayFont === "syne"
      ? `"Syne", "Noto Sans KR", sans-serif`
      : `"Fraunces", "Noto Serif KR", Georgia, serif`;
    root.style.setProperty("--font-serif", displayStack);
  }, [t]);

  // route render
  const page = useMemo(() => {
    if (route.name === "post") return <BlogDetailPage slug={route.slug} onNav={onNav} />;
    if (route.name === "blog") return <BlogListPage route={route} onNav={onNav} tweaks={t} />;
    if (route.name === "about") return <AboutPage onNav={onNav} />;
    if (route.name === "system") return <SystemPage onNav={onNav} />;
    if (route.name === "404")   return <NotFoundPage onNav={onNav} attempted={route.attempted} />;
    if (route.name === "feed")  return <ComingSoon name={route.name} onNav={onNav} />;
    return <HomePage onNav={onNav} tweaks={t} />;
  }, [route, onNav, t]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header route={route} onNav={onNav} />
      <div style={{ flex: 1 }}>{page}</div>
      <Footer onNav={onNav} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Identity" />
        <TweakColor label="Signature" value={t.accent}
          options={["#C8FF00", "#E8FF5C", "#FF6B35", "#7C5CFF", "#4D9EFF", "#EDEDEF"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakRadio label="Display font"
          value={t.displayFont}
          options={[
            { value: "fraunces", label: "Fraunces" },
            { value: "syne",     label: "Syne" }
          ]}
          onChange={(v) => setTweak("displayFont", v)} />

        <TweakSection label="Theme" />
        <TweakToggle label="Light theme"
          value={t.lightTheme}
          onChange={(v) => setTweak("lightTheme", v)} />

        <TweakSection label="Layout" />
        <TweakRadio label="Body width"
          value={t.bodyWidth}
          options={[
            { value: "narrow",  label: "Narrow" },
            { value: "default", label: "Default" },
            { value: "wide",    label: "Wide" }
          ]}
          onChange={(v) => setTweak("bodyWidth", v)} />
        <TweakRadio label="List pagination"
          value={t.pagination}
          options={[
            { value: "all",    label: "All" },
            { value: "paged",  label: "Paged" }
          ]}
          onChange={(v) => setTweak("pagination", v)} />

        <TweakSection label="Texture" />
        <TweakToggle label="Grid lines"
          value={t.gridLines}
          onChange={(v) => setTweak("gridLines", v)} />
        <TweakToggle label="Noise overlay"
          value={t.noise}
          onChange={(v) => setTweak("noise", v)} />
      </TweaksPanel>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Coming soon (about / feed) — small placeholder
// ──────────────────────────────────────────────────────────────
function ComingSoon({ name, onNav }) {
  const titles = {
    about: ["About", "조금 더 정리해서 곧 올립니다."],
    feed:  ["RSS / Atom / JSON", "다음 마이너 릴리스(v2.1)에서 공개됩니다."]
  };
  const [t, sub] = titles[name] || ["", ""];
  return (
    <main style={{ paddingTop: 120, paddingBottom: 200 }}>
      <div className="container-narrow" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div className="mono-label">SECTION · {name.toUpperCase()}</div>
        <h1 className="display display-h1" style={{ margin: 0 }}>
          {t}<span style={{ color: "var(--color-accent)" }}>.</span>
        </h1>
        <p className="lede" style={{ color: "var(--color-text-2)" }}>{sub}</p>
        <div>
          <button onClick={() => onNav({ name: "blog" })} className="btn btn-primary">
            <span>Read essays instead</span><span style={{ opacity: .6 }}>→</span>
          </button>
        </div>
      </div>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────
// hash routing helpers
// /         → home
// /blog     → list
// /blog/x   → post slug=x
// /blog?cat=dev → list filtered
// We use hash for static-site safety.
// ──────────────────────────────────────────────────────────────
function parseHash() {
  const h = (location.hash || "").replace(/^#\/?/, "");
  if (!h || h === "/" || h === "") return { name: "home" };
  const [pathPart, queryPart] = h.split("?");
  const segs = pathPart.split("/").filter(Boolean);
  if (segs[0] === "blog") {
    if (segs[1]) {
      // verify slug exists; otherwise 404
      const posts = window.POSTS || [];
      const slug = decodeURIComponent(segs[1]);
      if (!posts.find(p => p.slug === slug)) return { name: "404", attempted: "/blog/" + slug };
      return { name: "post", slug };
    }
    const q = new URLSearchParams(queryPart || "");
    return { name: "blog", category: q.get("category") || "all" };
  }
  if (segs[0] === "about")  return { name: "about" };
  if (segs[0] === "system") return { name: "system" };
  if (segs[0] === "feed")   return { name: "feed" };
  if (segs[0] === "404")    return { name: "404", attempted: "/" + segs.slice(1).join("/") };
  return { name: "404", attempted: "/" + segs.join("/") };
}

function serializeHash(route) {
  if (!route) return "/";
  if (route.name === "home") return "/";
  if (route.name === "blog") return route.category && route.category !== "all" ? `/blog?category=${route.category}` : "/blog";
  if (route.name === "post") return `/blog/${encodeURIComponent(route.slug)}`;
  if (route.name === "about")  return "/about";
  if (route.name === "system") return "/system";
  if (route.name === "feed")   return "/feed";
  if (route.name === "404")    return "/404" + (route.attempted || "");
  return "/";
}

function hexToRgba(hex, a) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Mount
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
