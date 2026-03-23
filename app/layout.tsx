import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "CollaboTicket | 데이터로 설계하는 일본 시장 진출 전략",
  description:
    "콜라보티켓은 한국 브랜드의 일본 진출을 전략적으로 설계하는 글로벌 마케팅 파트너입니다.",
  icons: {
    icon: "/CT logo.jpg",
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
      </body>
    </html>
  )
}