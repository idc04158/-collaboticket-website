import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const footerLinks = [
  {
    label: "개인정보처리방침",
    href: "https://docs.google.com/document/d/1m-BzQlt-8e2Uo3htd9P7KiDeuX1w61o2-y2jVOfND2I/view",
  },
  {
    label: "이용약관",
    href: "https://docs.google.com/document/d/1m-BzQlt-8e2Uo3htd9P7KiDeuX1w61o2-y2jVOfND2I/view",
  },
]

const internalLinks = [
  { label: "인사이트", href: "/insights" },
  { label: "웨비나", href: "/webinar" },
  { label: "상담", href: "/contact" },
  { label: "인플루언서 데모", href: "/influencers" },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#111111] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <span className="font-sans text-lg font-bold text-white">CollaboTicket</span>
            <p className="text-sm text-gray-400">일본전문 마케팅 에이전시</p>
            <p className="text-xs text-gray-500">Since 2020</p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">연락처</h4>
            <p className="text-sm text-gray-400">대표 강지예 (Kang Jiye)</p>
            <p className="text-sm text-gray-400">TEL: 070-8057-6518 (직통)</p>
            <p className="text-sm text-gray-400">E-mail: partner@collaboticket.com</p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">바로가기</h4>
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">법적 고지</h4>
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <Separator className="my-12 bg-gray-800" />

        <div className="flex flex-col gap-4 text-xs text-gray-400">
          <p>
            콜라보티켓 | 일본전문 마케팅 에이전시 | 대표 강지예 (Kang Jiye) |
            주소: 서울시 마포구 포은로8길 29,477
          </p>

          <p>©2020-2026 CollaboTicket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
