import type { ReactNode } from "react";

interface Props {
  num: string;
  title: string;
  right?: ReactNode;
}

/**
 * 섹션 헤더 — 번호 + 제목 + 우측 슬롯 2단 (아트보드 4a·4b).
 * 키커 줄 없음 — v2에 있던 3단(번호 / 키커+제목 / 우측) 구조는 issue #110에서 축소했다.
 */
export function SectionHead({ num, title, right }: Props) {
  return (
    <div className="sec-head">
      <div className="sec-head-num">
        <span className="sec-head-index">§{num}</span>
        <span className="sec-head-title">{title}</span>
      </div>
      {right && <div className="sec-head-right">{right}</div>}
    </div>
  );
}
