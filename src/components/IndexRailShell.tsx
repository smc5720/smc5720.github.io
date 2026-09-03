import type { ReactNode } from "react";

interface Props {
  ariaLabel: string;
  /** 데스크톱 좌측 세로 레일 본문 */
  desktop: ReactNode;
  /** 태블릿 834 — 상단 수평 스트립(가로 스크롤) 본문 */
  tabletStrip: ReactNode;
  /** 태블릿 스트립 아래에 펼쳐지는 추가 시트(블로그 목록의 "태그 · 연도 필터" 전용). 홈은 사용하지 않는다 */
  tabletExtra?: ReactNode;
  /** 모바일 390 — 필터 시트 버튼의 요약 라벨 */
  mobileSummary: ReactNode;
  /** 모바일 시트를 펼쳤을 때의 본문 */
  mobileBody: ReactNode;
}

/**
 * 홈 색인 레일(IndexRail)과 블로그 목록 필터 레일(BlogList)이 공유하는 접힘 셸.
 * 데스크톱 세로 레일 / 태블릿 상단 수평 스트립 / 모바일 필터 시트 세 변형을 함께
 * 렌더링하고 CSS 미디어쿼리로 하나만 노출한다(display:none인 변형은 접근성
 * 트리·탭 순서에서도 자동으로 빠진다). 두 화면이 서로 다른 필터 내용을 갖더라도
 * 이 셸을 통해 마크업·클래스·모바일 시트 모양(--shadow-overlay 포함)이 항상 일치한다.
 *
 * 네이티브 details/summary만으로 구성되어 JS 없이도 동작한다(호출부가 클라이언트
 * 컴포넌트든 서버 컴포넌트든 그대로 쓸 수 있다).
 */
export function IndexRailShell({
  ariaLabel,
  desktop,
  tabletStrip,
  tabletExtra,
  mobileSummary,
  mobileBody,
}: Props) {
  return (
    <nav className="idx-rail" aria-label={ariaLabel}>
      {/* 데스크톱 — 좌측 세로 레일 */}
      <div className="idx-rail-desktop">{desktop}</div>

      {/* 태블릿 834 — 상단 수평 스트립(가로 스크롤) */}
      <div className="idx-rail-tablet">{tabletStrip}</div>
      {tabletExtra}

      {/* 모바일 390 — 필터 시트 버튼 */}
      <details className="idx-rail-mobile">
        <summary className="idx-rail-summary">
          <span>{mobileSummary}</span>
          <span className="idx-rail-summary-icon" aria-hidden="true">⌄</span>
        </summary>
        <div className="idx-rail-mobile-body">{mobileBody}</div>
      </details>
    </nav>
  );
}
