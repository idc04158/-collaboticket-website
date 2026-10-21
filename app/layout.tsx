import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"

import { SiteAnalytics } from "@/components/analytics/site-analytics"
import { FunnelPopupManager } from "@/components/funnel-popup-manager"
import { VisitorDiscordNotifier } from "@/components/visitor-discord-notifier"
import { SITE_URL } from "@/lib/site-url"

import "./globals.css"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

const defaultTitle = "콜라보티켓 | Japan Commerce Intelligence & Execution"
const defaultDescription =
  "일본 시장 인사이트를 매주 제공하고 EC·콘텐츠·인플루언서 운영까지 실행하는 Japan Commerce Intelligence & Execution Company. Qoo10·Rakuten·Amazon 운영과 현지 콘텐츠 제작을 한 팀이 수행합니다."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: defaultTitle,
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "CollaboTicket",
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png", sizes: "117x74" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} antialiased`}>
        {children}
        <SiteAnalytics />
        <FunnelPopupManager />
        <VisitorDiscordNotifier />
      </body>
    </html>
  )
}