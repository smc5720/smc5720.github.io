# News Post 작성 템플릿

Claude에게 초안 작성을 요청할 때 이 문서를 참고하세요.

---

## 작성 규칙

1. **원문 사실에 근거해 새 기사로 재작성한다.** 원문 구조를 그대로 따르지 않는다. 한국 독자에게 가장 자연스러운 순서와 흐름으로 재구성한다. 작성자의 추측·단정은 추가하지 않는다.
2. **출처를 반드시 남긴다.** frontmatter의 `source_*` 필드와 본문 상단 `<LinkCard>` 모두 필수.
3. **중복 방지.** `source_id` 필드는 `devto-{숫자}` 형식으로 고정. 기존 MDX 파일에 같은 값이 있으면 작성하지 않는다.
4. **자연스러운 한국어로 쓴다.** 직역하지 않는다. 원문의 의미와 뉘앙스를 유지하되, 한국 독자가 자연스럽게 읽히는 문장으로 재구성한다. 아래 패턴은 반드시 피한다:
   - 번역투 표현: "~을 통해", "~를 기반으로", "~을 제공합니다", "~에 따르면"으로 시작하는 문장
   - 피동태 남용: "~이 발표되었습니다", "~이 확인되었습니다" → "~을 발표했습니다", "~을 확인했습니다"
   - AI 관용구: "이는 ~를 의미합니다", "이러한 맥락에서", "주목할 만합니다"
   - 기계적 3단 연결: "A하고, B하며, C한다" 형태의 반복
   - 어색한 수식절: "~할 수 있는", "~을 위한" 연속 사용
   - 애매한 부분은 영어 원문을 병기해도 된다.
5. **Dev.to 전용 문법을 제거한다.** 원문 `body_markdown`에는 MDX에서 파싱 오류를 일으키는 Liquid 태그가 포함될 수 있다. 반드시 아래와 같이 변환한다.
   - `{% embed <URL> %}` → 마크다운 링크 `[영상/링크 보기 →](<URL>)`
   - `{% youtube <ID> %}` → `[YouTube 영상 보기 →](https://www.youtube.com/watch?v=<ID>)`
   - `{% link <URL> %}` → 마크다운 링크
   - `{% raw %}...{% endraw %}` 블록 → 그대로 제거하거나 코드 블록으로 대체
   - `{%` 로 시작하는 태그가 원문에 있으면 **반드시** 변환 후 저장한다.
6. **본문 이미지 삽입 규칙:**
   - 원문 `body_markdown`에 이미 이미지가 있으면 위치 그대로 유지한다.
   - 스크립트가 출력한 Pexels 이미지 제안이 있으면, 내용 흐름상 자연스러운 섹션 경계(## 소제목 직후)에 적절히 배치한다. 억지로 끼워 넣지 않는다.
   - Pexels 이미지에는 반드시 아래 형식으로 attribution을 붙인다.

---

## MDX Frontmatter 템플릿

```yaml
---
title: ""              # 원문 제목 (한국어 번역 가능, 원문 병기 권장)
description: ""        # 원문 요약 1-2문장
date: "YYYY-MM-DD"     # 원문 게시일 (source_published와 동일)
published_at: "YYYY-MM-DD"  # 블로그 포스팅일 (배치 실행일 = 오늘 날짜). 정렬 기준.
category: "news"
tags: []               # 원문 tag_list 그대로 사용
cover: ""              # cover_image 값 그대로. 없으면 필드 생략
coverAlt: ""           # 원문 제목(영어) 그대로. cover 있을 때만 필수
source_id: "devto-"    # 중복 식별자. devto-{article.id} 형식 필수
source_url: ""         # 원문 URL
source_title: ""       # 원문 제목 (영어 원문 그대로)
source_author: ""      # 원문 작성자 이름
source_published: ""   # 원문 게시일 YYYY-MM-DD
---
```

---

## 본문 구조

```mdx
<LinkCard url="원문 URL" author="작성자" date="YYYY-MM-DD" />

## 개요

(핵심 사실 또는 가장 눈에 띄는 변화를 먼저 전달한다. 1-3문단.)

## 본문

(원문의 사실과 수치를 바탕으로 한국어 기사로 재구성한다. 원문 소제목에 얽매이지 않고 한국 독자 흐름에 맞게 섹션을 나눈다.)

### 소제목 1

...

(Pexels 이미지를 삽입하는 경우 아래 형식 사용 — 섹션 내용과 관련 없으면 생략)
![이미지 설명](https://images.pexels.com/photos/xxx/pexels-photo-xxx.jpeg)
*Photo by [작가명](https://www.pexels.com/@username) on [Pexels](https://www.pexels.com/photo/xxx)*

### 소제목 2

...

---

*이 글은 위 출처를 바탕으로 한국 독자를 위해 재작성한 기사입니다. 원문의 사실과 수치에 근거하며, 별도의 견해를 포함하지 않습니다.*
```

---

## Claude 요청 예시

```
아래 Dev.to 기사 내용을 docs/news-post-template.md 규칙에 따라
content/posts/{slug}.mdx 파일로 작성해줘.
source_id는 devto-{ID}야.

--- 본문 시작 ---
(fetch-news.mjs --id 로 출력된 body_markdown 붙여넣기)
--- 본문 끝 ---
```
