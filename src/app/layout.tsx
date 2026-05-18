import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Syne,
  JetBrains_Mono,
  Inter,
  Noto_Sans_KR,
  Noto_Serif_KR,
} from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Inter is a variable font — no weight array needed
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Noto KR fonts: next/font downloads the full CSS (all unicode ranges including Korean)
// at build time. The 'latin' subset here only controls the <link preload> hint, not coverage.
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  weight: ["400", "500", "700"],
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  weight: ["400", "700"],
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#07070A' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${fraunces.variable} ${syne.variable} ${jetbrains.variable} ${inter.variable} ${notoSansKR.variable} ${notoSerifKR.variable}`}
    >
      <head>
        {/* FOUC prevention: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('rico-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})()`
        }} />
      </head>
      <body className="noise-overlay flex flex-col min-h-screen bg-bg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
