import { Feed } from 'feed'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'
export const revalidate = false

const BASE_URL = 'https://smc5720.github.io'

export async function GET() {
  const posts = getAllPosts().slice(0, 20)

  const feed = new Feed({
    title: "RicoCheese's Blog",
    description: '개발, 회고, 뉴스, 그리고 일상을 기록하는 블로그',
    id: BASE_URL,
    link: BASE_URL,
    language: 'ko',
    feedLinks: {
      rss2: `${BASE_URL}/feed.xml`,
    },
    copyright: `All rights reserved ${new Date().getFullYear()}, 서민철(Seo Mincheol)`,
  })

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${BASE_URL}/blog/${post.slug}`,
      link: `${BASE_URL}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
