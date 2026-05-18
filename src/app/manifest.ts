import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RicoCheese's Blog",
    short_name: 'RicoCheese',
    description: '개발, 회고, 뉴스, 그리고 일상을 기록하는 블로그',
    start_url: '/',
    display: 'standalone',
    theme_color: '#07070A',
    background_color: '#07070A',
    icons: [
      { src: '/icon.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
