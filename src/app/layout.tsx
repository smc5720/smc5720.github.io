import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/* 본문·UI 전용 산세리프. 세리프는 v3에서 전면 금지.
   Pretendard Variable은 public/fonts에 셀프 호스트한다. */
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "400 700",
});

/* 모노스페이스는 코드 블록과 날짜·카운트·경로에만 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "RicoCheese's Blog",
    template: "%s · RicoCheese's Blog",
  },
  description: "개발, 회고, 뉴스, 그리고 일상을 기록하는 블로그",
  metadataBase: new URL("https://smc5720.github.io"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://smc5720.github.io",
    siteName: "RicoCheese's Blog",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

/* 다크 단일 테마 — 라이트 대응 없음 */
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0c0c0d",
};

const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${plexMono.variable}`}>
      <head>
        {adsensePublisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {umamiWebsiteId && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
