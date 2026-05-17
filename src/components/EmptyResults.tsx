import type { Category } from "@/types/post";

const ALL = "all" as const;

interface Props {
  search: string;
  activeCat: "all" | Category;
  onReset: () => void;
}

export function EmptyResults({ search, activeCat, onReset }: Props) {
  const isAllEmpty = !search && activeCat === ALL;
  const showReset = !isAllEmpty;

  return (
    <div className="empty-card">
      <pre aria-hidden="true" style={{ margin: 0, fontFamily: "var(--font-mono)", color: "var(--color-text-3)", fontSize: 11, lineHeight: 1.3, whiteSpace: "pre" }}>{`╭─────────────────╮\n│   404 in scope  │\n│   not the page  │\n╰─────────────────╯`}</pre>

      <h2 className="display display-h3" style={{ margin: 0 }}>
        해당 조건의 글이 없어요
      </h2>

      <p className="small" style={{ maxWidth: 420 }}>
        {isAllEmpty ? (
          "아직 발행된 글이 없습니다."
        ) : search ? (
          <>
            &ldquo;<span style={{ color: "var(--color-text)" }}>{search}</span>&rdquo;에
            해당하는 글이 아직 없습니다. 카테고리·검색어를 바꿔보거나 전체 글로 돌아가 보세요.
          </>
        ) : (
          "이 카테고리에 해당하는 글이 아직 없습니다. 카테고리·검색어를 바꿔보거나 전체 글로 돌아가 보세요."
        )}
      </p>

      {showReset && (
        <button type="button" className="btn btn-primary" onClick={onReset}>
          <span>Reset filters</span>
          <span style={{ opacity: 0.6 }}>↺</span>
        </button>
      )}
    </div>
  );
}
