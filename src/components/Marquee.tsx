const WORDS = [
  "글쓰기는 사고를 압축하는 일",
  "writing as making things",
  "코드 옆에 회고를",
  "the studio log",
  "한 주에 한 편",
  "deploy on push to main",
  "thinking in public",
];

// Items duplicated for seamless loop (marquee animates -50%)
const ITEMS = [...WORDS, ...WORDS];

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {ITEMS.map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-flex", alignItems: "center", gap: 56 }}
          >
            <span>{word}</span>
            <span className="dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
