/**
 * Custom Shiki theme — v3 "Studio Log" 코드 팔레트 (아트보드 3b 5a).
 * 6색 고정: 배경 · 기본 · 키워드 · 문자열/타입 · 숫자/인자 · 주석.
 * `vitesse-dark`를 대체한다. @shikijs/rehype에는 이 객체를 theme name
 * 대신 직접 넘긴다 — 이슈 #109 비고에 적힌, 가장 확실한 커스텀 테마 적용 방법.
 *
 * 타입은 일부러 명시하지 않는다 — `shiki`는 @shikijs/rehype의 전이 의존성일
 * 뿐 이 프로젝트의 직접 의존성이 아니라서, 구조적 타이핑으로 충분한 이
 * 객체 리터럴에 그 패키지의 타입을 import하면 불필요한 결합이 생긴다.
 */
export const ricoCodeTheme = {
  name: "rico-dark",
  type: "dark",
  colors: {
    "editor.background": "#0f1011",
    "editor.foreground": "#d6d6da",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#7d7d85", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.other",
        "storage",
        "storage.type",
        "storage.modifier",
        "constant.language",
        "variable.language",
        "support.type.builtin",
      ],
      settings: { foreground: "#7fd0a3" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "punctuation.definition.string",
        "entity.name.type",
        "entity.name.class",
        "entity.other.inherited-class",
        "support.type",
        "support.class",
        "meta.import",
      ],
      settings: { foreground: "#9fc6d8" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.character",
        "constant.other",
        "variable.parameter",
        "meta.parameter",
        "support.constant",
      ],
      settings: { foreground: "#d8c08f" },
    },
  ],
};
