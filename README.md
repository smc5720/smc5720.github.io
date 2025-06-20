# 개인 블로그

개발과 일상에 대한 생각을 나누는 개인 블로그입니다.

## 🚀 특징

- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 경험
- **빠른 로딩**: 최적화된 코드로 빠른 페이지 로딩
- **검색 기능**: 글을 쉽게 찾을 수 있는 검색 기능
- **소셜 공유**: 트위터, 페이스북 등으로 쉽게 공유 가능
- **댓글 시스템**: 독자들과의 소통을 위한 댓글 기능
- **다크 모드**: 눈의 피로를 줄이는 다크 모드 지원

## 🛠 기술 스택

- **Jekyll**: 정적 사이트 생성기
- **HTML/CSS/JavaScript**: 프론트엔드
- **Ruby**: Jekyll 실행 환경
- **GitHub Pages**: 호스팅

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/smc5720/smc5720.github.io.git
cd smc5720.github.io
```

### 2. Ruby 및 Jekyll 설치
```bash
# Ruby 설치 (Windows의 경우 RubyInstaller 사용)
# macOS의 경우
brew install ruby

# Jekyll 설치
gem install jekyll bundler
```

### 3. 의존성 설치
```bash
bundle install
```

### 4. 로컬 서버 실행
```bash
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000`으로 접속하여 블로그를 확인할 수 있습니다.

## 📁 프로젝트 구조

```
smc5720.github.io/
├── _config.yml          # Jekyll 설정 파일
├── _layouts/            # 레이아웃 템플릿
│   ├── default.html     # 기본 레이아웃
│   └── post.html        # 포스트 레이아웃
├── _posts/              # 블로그 포스트
├── assets/              # 정적 파일
│   ├── css/             # 스타일시트
│   ├── js/              # JavaScript
│   └── images/          # 이미지
├── about.md             # 소개 페이지
├── index.html           # 메인 페이지
└── README.md            # 프로젝트 설명
```

## ✍️ 새 글 작성하기

### 1. 포스트 생성
`_posts/` 폴더에 `YYYY-MM-DD-제목.md` 형식으로 파일을 생성합니다.

### 2. Front Matter 작성
```yaml
---
layout: post
title: "글 제목"
date: 2024-01-15
categories: [카테고리]
tags: [태그1, 태그2]
image: /assets/images/이미지.jpg
description: "글 설명"
---
```

### 3. 마크다운으로 내용 작성
```markdown
# 제목

내용을 작성합니다.

## 소제목

- 목록 1
- 목록 2

```

## 🎨 커스터마이징

### 색상 변경
`assets/css/main.css` 파일에서 CSS 변수를 수정하여 색상을 변경할 수 있습니다.

### 레이아웃 수정
`_layouts/` 폴더의 HTML 파일을 수정하여 레이아웃을 변경할 수 있습니다.

### 설정 변경
`_config.yml` 파일에서 블로그 제목, 설명, 저자 정보 등을 수정할 수 있습니다.

## 📝 사용법

### 카테고리 추가
`_config.yml`에서 카테고리 설정을 추가하거나, 포스트의 Front Matter에서 직접 지정할 수 있습니다.

### 태그 관리
포스트의 Front Matter에서 `tags` 배열에 태그를 추가하면 자동으로 태그 페이지가 생성됩니다.

### 이미지 추가
`assets/images/` 폴더에 이미지를 추가하고 포스트에서 참조할 수 있습니다.

## 🔧 배포

### GitHub Pages
1. GitHub 저장소에 코드를 푸시
2. 저장소 설정에서 GitHub Pages 활성화
3. `https://smc5720.github.io`에서 블로그 확인

### 로컬 빌드
```bash
bundle exec jekyll build
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

- **이메일**: your-email@example.com
- **GitHub**: [@smc5720](https://github.com/smc5720)

## 🙏 감사의 말

- [Jekyll](https://jekyllrb.com/) - 정적 사이트 생성기
- [Font Awesome](https://fontawesome.com/) - 아이콘
- [Google Fonts](https://fonts.google.com/) - 웹 폰트

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! 