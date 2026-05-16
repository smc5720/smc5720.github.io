# RicoCheese's Blog

> 개발 · 회고 · 뉴스, 그리고 만들어가는 것들을 기록하는 개인 블로그.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MDX](https://img.shields.io/badge/MDX-1B1F24?logo=mdx&logoColor=white)](https://mdxjs.com)
[![Deploy](https://github.com/smc5720/smc5720.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/smc5720/smc5720.github.io/actions/workflows/deploy.yml)

**Live →** [smc5720.github.io](https://smc5720.github.io)

---

## 한눈에

- **Next.js 16 App Router** 기반 정적 사이트 (`output: "export"`)
- **MDX**로 글 작성 — frontmatter + 본문 한 파일
- **Shiki** 신택스 하이라이팅, **rehype-slug / autolink-headings**로 헤딩 앵커 자동 생성
- **Reading Progress Bar**, **Table of Contents**, **카테고리 배지**
- **Tailwind CSS v4** + 커스텀 폰트(Fraunces · Syne · JetBrains Mono)
- **GitHub Actions**로 `main` push 시 자동 배포 (GitHub Pages)

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| Framework | Next.js 16.2 (App Router, Static Export) |
| UI | React 19.2, Tailwind CSS v4 |
| 콘텐츠 | MDX (`next-mdx-remote`), gray-matter, remark-gfm |
| 코드 하이라이팅 | `@shikijs/rehype` |
| 헤딩/링크 | `rehype-slug`, `rehype-autolink-headings` |
| 유틸 | `reading-time`, `date-fns` |
| 패키지 매니저 | pnpm 10 |
| 배포 | GitHub Actions → GitHub Pages |

## 시작하기

```bash
pnpm install
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기.

### 명령어

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 정적 사이트 빌드 (`out/` 생성) |
| `pnpm start` | 빌드된 사이트 서빙 |
| `pnpm lint` | ESLint 실행 |

## 글 작성

`content/posts/` 아래에 `.mdx` 파일을 추가하면 자동으로 글 목록에 잡힙니다. 파일명이 슬러그가 돼요.

```mdx
---
title: 글 제목
description: 메타/카드에 노출될 한 줄 요약
date: 2026-05-17
category: dev
tags: [next, mdx]
cover: /covers/example.png  # (선택)
---

본문은 일반 마크다운 + JSX 컴포넌트 자유 사용.
```

### Frontmatter 필드

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | ✓ | 글 제목 |
| `description` | string | ✓ | 한 줄 요약 (카드/SEO에 사용) |
| `date` | string (ISO) | ✓ | 발행일 |
| `category` | `news` \| `dev` \| `retrospective` \| `release` \| `etc` | ✓ | 카테고리 |
| `tags` | string[] | ✓ | 태그 배열 |
| `cover` | string |   | 커버 이미지 경로 |

읽기 시간(`readingTime`)은 본문에서 자동 계산됩니다.

## 프로젝트 구조

```
.
├── content/
│   └── posts/              # .mdx 글 — 파일명이 슬러그
├── src/
│   ├── app/                # App Router (page.tsx, layout.tsx, blog/, about/)
│   ├── components/         # Header, Footer, PostCard, TableOfContents, ...
│   ├── lib/
│   │   ├── posts.ts        # 글 로더 (frontmatter 파싱, 정렬)
│   │   └── constants.ts    # 카테고리 라벨
│   └── types/post.ts       # Post / PostMeta / Category 타입
├── next.config.ts          # output: "export"
└── .github/workflows/
    └── deploy.yml          # pnpm install → next build → Pages 배포
```

## 배포

`main` 브랜치에 push하면 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)이 자동으로:

1. pnpm 10으로 의존성 설치 (`--frozen-lockfile`)
2. `pnpm build` → `out/` 정적 산출물 생성
3. `actions/upload-pages-artifact` → `actions/deploy-pages`로 GitHub Pages 배포

수동 트리거가 필요하면 Actions 탭에서 **Run workflow** 버튼을 누르거나:

```bash
gh workflow run "Deploy to GitHub Pages" --ref main
```

## 라이선스

코드는 자유롭게 참고하셔도 좋아요. 글 콘텐츠(`content/posts/`)는 저작자에게 권리가 있습니다.
