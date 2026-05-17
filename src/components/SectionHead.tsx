import type { ReactNode } from "react";

interface Props {
  num: string;
  kicker: string;
  title: string;
  right?: ReactNode;
}

export function SectionHead({ num, kicker, title, right }: Props) {
  return (
    <div className="sec-head">
      <div
        className="mono-label tabular"
        style={{ color: "var(--color-text-3)" }}
      >
        § {num}
      </div>
      <div>
        <div className="mono-label" style={{ marginBottom: 8 }}>
          {kicker}
        </div>
        <h2 className="display display-h2" style={{ margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ alignSelf: "end" }}>{right}</div>
    </div>
  );
}
