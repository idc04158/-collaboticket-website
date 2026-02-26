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

export function SiteFooter() {
  return (
    <footer className="bg-[#111111] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        {/* 상단 영역 */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* 브랜드 */}
          <div className="flex flex-col gap-4">
            <span className="font-sans text-lg font-bold text-white">
              CollaboTicket
            </span>
            <p className="text-sm text-gray-400">
              콜라보티켓
            </p>
          </div>

          {/* 연락처 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">연락처</h4>
            <p className="text-sm text-gray-400">
              contact@collaboticket.com
            </p>
            <p className="text-sm text-gray-400">
              사업자등록번호 436-36-00682
            </p>
          </div>

          {/* 법적 고지 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">법적 고지</h4>
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* 빈 컬럼 (레이아웃 균형 유지용) */}
          <div />
        </div>

        <Separator className="my-12 bg-gray-800" />

        {/* 하단 사업자 정보 - 기존 데이터 반영 */}
        <div className="flex flex-col gap-4 text-xs text-gray-400">
          <p>
            (주) 콜라보티켓 | 대표 홍길동 | 사업자번호 436-36-00682 |
            통신판매업 신고번호 제2024-서울강남-00000호 |
            주소: 서울특별시 강남구 테헤란로 000
          </p>

          <p>
            ©2026 CollaboTicket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}