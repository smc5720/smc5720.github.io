import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RicoCheese's Blog",
    short_name: 'RicoCheese',
    description: '기술 뉴스를 모으고, 가끔 직접 쓰는 개인 블로그.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0c0c0d',
    background_color: '#0a0a0b',
    // scripts/fix-icon-extensions.mjs가 icon.tsx(generateImageMetadata)의
    // /icon/192, /icon/512, /icon/512-maskable 출력을 이 경로로 옮긴다.
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
