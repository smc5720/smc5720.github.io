# News Post 작성 템플릿

Claude에게 초안 작성을 요청할 때 이 문서를 참고하세요.

---

## 작성 규칙

1. **원문 내용만 옮긴다.** 작성자의 개인 의견, 해설, 추측을 일절 추가하지 않는다.
2. **출처를 반드시 남긴다.** frontmatter의 `source_*` 필드와 본문 상단 `<LinkCard>` 모두 필수.
3. **중복 방지.** `source_id` 필드는 `devto-{숫자}` 형식으로 고정. 기존 MDX 파일에 같은 값이 있으면 작성하지 않는다.
4. **번역 시 뉘앙스 유지.** 의역보다 직역을 우선하고, 애매한 부분은 영어 원문을 병기한다.
5. **readingTime**은 본문 단어 수 기준 분당 200단어로 계산해 정수로 입력한다.
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
date: "YYYY-MM-DD"     # 초안 작성일
category: "news"
tags: []               # 원문 tag_list 그대로 사용
cover: ""              # cover_image 값 그대로. 없으면 필드 생략
coverAlt: ""           # 원문 제목(영어) 그대로. cover 있을 때만 필수
source_id: "devto-"    # 중복 식별자. devto-{article.id} 형식 필수
source_url: ""         # 원문 URL
source_title: ""       # 원문 제목 (영어 원문 그대로)
source_author: ""      # 원문 작성자 이름
source_published: ""   # 원문 게시일 YYYY-MM-DD
readingTime: 5
---
```

---

## 본문 구조

```mdx
<LinkCard url="원문 URL" author="작성자" date="YYYY-MM-DD" />

## 개요

(원문의 도입부/요약을 그대로 옮긴다. 1-3문단.)

## 본문

(원문의 주요 내용을 섹션별로 옮긴다. 원문 소제목 구조를 최대한 유지한다.)

### 소제목 1

...

(Pexels 이미지를 삽입하는 경우 아래 형식 사용 — 섹션 내용과 관련 없으면 생략)
![이미지 설명](https://images.pexels.com/photos/xxx/pexels-photo-xxx.jpeg)
*Photo by [작가명](https://www.pexels.com/@username) on [Pexels](https://www.pexels.com/photo/xxx)*

### 소제목 2

...

---

*이 글은 위 출처의 내용을 바탕으로 작성된 초안입니다. 원문의 의견과 정보를 그대로 전달하며, 별도의 견해를 포함하지 않습니다.*
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
