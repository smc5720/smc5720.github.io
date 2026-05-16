import type { Metadata } from "next";
import { Fraunces, Syne, JetBrains_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${fraunces.variable} ${syne.variable} ${jetbrains.variable}`}
    >
      <body className="noise-overlay flex flex-col min-h-screen bg-bg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
