import { renameSync, existsSync, readdirSync, rmdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve, join, extname } from 'path'

const outDir = resolve('out')

// ────────────────────────────────────────────────────────────────
// 1단계 — 파일 리네임
// next build(App Router 메타데이터 라우트)는 icon/apple-icon/opengraph-image를
// 확장자 없는 라우트로 내보낸다(`out/apple-icon`, `out/opengraph-image`,
// `out/icon/<id>`). GitHub Pages는 확장자로 Content-Type을 추론하므로
// 확장자를 붙여 실제 파일로 만든다. HTML/RSC 페이로드의 참조는 2단계에서 맞춘다.
// ────────────────────────────────────────────────────────────────

const singleRenames = [
  ['apple-icon', 'apple-icon.png'],
  ['opengraph-image', 'opengraph-image.png'],
]
for (const [from, to] of singleRenames) {
  const src = resolve(outDir, from)
  const dest = resolve(outDir, to)
  if (existsSync(src) && !existsSync(dest)) {
    renameSync(src, dest)
    console.log(`renamed: ${from} → ${to}`)
  }
}

// icon — generateImageMetadata로 다중 사이즈를 내보내므로 `out/icon/`은 디렉터리이고,
// 그 안에 확장자 없는 파일(16, 32, 64, 128, 192, 512, 512-maskable)이 들어 있다.
// manifest.ts가 참조하는 `/icon-<id>.png` 평면 경로로 옮긴다.
const iconDir = resolve(outDir, 'icon')
if (existsSync(iconDir)) {
  for (const id of readdirSync(iconDir)) {
    const src = resolve(iconDir, id)
    const dest = resolve(outDir, `icon-${id}.png`)
    if (existsSync(src) && !existsSync(dest)) {
      renameSync(src, dest)
      console.log(`renamed: icon/${id} → icon-${id}.png`)
    }
  }
  if (readdirSync(iconDir).length === 0) {
    rmdirSync(iconDir)
  }
}

// ────────────────────────────────────────────────────────────────
// 2단계 — HTML/RSC 페이로드 href 치환
// Next가 만드는 <link>/<meta>와 RSC 페이로드(__next._head.txt 등, 클라이언트
// 내비게이션 시 <head>를 갱신하는 데 쓰인다)는 여전히 확장자 없는 라우트 경로를
// 참조한다. 1단계에서 실제 파일명을 바꿨으니 참조도 맞춰야 404가 나지 않는다.
// 쿼리스트링(?<hash>, 캐시버스터)은 보존한다. `/icon-16.png`처럼 이미 치환된
// 참조는 뒤따르는 문자가 "."라 lookahead에 걸리지 않아 다시 치환되지 않는다.
// og:image의 절대 URL(https://smc5720.github.io/opengraph-image?...) 안의
// 경로도 같은 패턴으로 매칭된다.
// ────────────────────────────────────────────────────────────────

function rewriteContent(content) {
  let refs = 0
  content = content.replace(/\/icon\/([\w-]+)(?=[?"'\s)])/g, (_, id) => {
    refs++
    return `/icon-${id}.png`
  })
  content = content.replace(/\/apple-icon(?=[?"'\s)])/g, () => {
    refs++
    return '/apple-icon.png'
  })
  content = content.replace(/\/opengraph-image(?=[?"'\s)])/g, () => {
    refs++
    return '/opengraph-image.png'
  })
  return { content, refs }
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, out)
    } else if (entry.isFile() && (extname(entry.name) === '.html' || extname(entry.name) === '.txt')) {
      out.push(full)
    }
  }
  return out
}

const startedAt = Date.now()
const files = walk(outDir)
let filesChanged = 0
let totalRefs = 0

for (const file of files) {
  const original = readFileSync(file, 'utf-8')
  const { content, refs } = rewriteContent(original)
  if (refs > 0) {
    writeFileSync(file, content, 'utf-8')
    filesChanged++
    totalRefs += refs
  }
}

const elapsedMs = Date.now() - startedAt
console.log(
  `rewrote ${filesChanged} html/txt files, ${totalRefs} refs (${files.length} files scanned in ${elapsedMs}ms)`
)
if (totalRefs === 0) {
  console.warn(
    '⚠ no /icon, /apple-icon, or /opengraph-image references were rewritten — check the regexes or out/ paths'
  )
}
