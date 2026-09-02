import Link from "next/link";

interface TagCount {
  tag: string;
  count: number;
}

interface Props {
  tags: TagCount[];
}

/** 홈 "태그" 섹션 — 사용 빈도 상위 태그 칩. /blog?tag= 로 이동(필터 적용은 #108 범위). */
export function TagIndex({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="home-tag-list">
      {tags.map(({ tag, count }) => (
        <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="tag-chip">
          <span>{tag}</span>
          <span className="tag-chip-count">{count}</span>
        </Link>
      ))}
    </div>
  );
}
