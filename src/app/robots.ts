import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/system/' },
    ],
    sitemap: 'https://smc5720.github.io/sitemap.xml',
  }
}
