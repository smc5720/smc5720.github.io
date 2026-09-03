import type { Category } from "@/types/post";
import { CATEGORY_LABELS } from "@/lib/constants";

const ALL = "all" as const;

interface Props {
  search: string;
  activeCat: "all" | Category;
  activeTag: string;
  activeYear: string;
  onReset: () => void;
  onClearTag: () => void;
}

/** 글 목록 빈 결과 상태 (아트보드 2b) — 걸린 조건을 문장으로 설명하고 복구 액션 2개를 제공한다. */
export function EmptyResults({ search, activeCat, activeTag, activeYear, onReset, onClearTag }: Props) {
  const hasFilter = activeCat !== ALL || !!activeTag || !!activeYear || !!search;

  const conditions: string[] = [];
  if (search) conditions.push(`검색어 "${search}"`);
  if (activeCat !== ALL) conditions.push(`카테고리 ${CATEGORY_LABELS[activeCat]}`);
  if (activeYear) conditions.push(`${activeYear}년`);
  if (activeTag) conditions.push(`태그 #${activeTag}`);

  const title = search
    ? `"${search}"에 해당하는 글이 없습니다`
    : activeTag
    ? `#${activeTag}에 해당하는 글이 없습니다`
    : hasFilter
    ? "조건에 맞는 글이 없습니다"
    : "아직 발행된 글이 없습니다";

  const description = hasFilter
    ? activeTag
      ? `${conditions.join(" · ")} 조건이 걸려 있습니다. 태그를 해제하면 결과가 늘어날 수 있습니다.`
      : `${conditions.join(" · ")} 조건에 맞는 글이 없습니다. 조건을 바꾸거나 초기화해 보세요.`
    : "content/posts/ 에 .mdx 파일을 추가하면 이곳에 표시됩니다.";

  return (
    <div className="blog-empty">
      <p className="blog-empty-title">{title}</p>
      <p className="blog-empty-desc">{description}</p>

      {hasFilter && (
        <div className="blog-empty-actions">
          <button type="button" className="blog-empty-btn blog-empty-btn--primary" onClick={onReset}>
            필터 초기화
          </button>
          {activeTag && (
            <button type="button" className="blog-empty-btn blog-empty-btn--ghost" onClick={onClearTag}>
              태그만 해제
            </button>
          )}
        </div>
      )}
    </div>
  );
}
