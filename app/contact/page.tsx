import type { Metadata } from "next"

import { MarketingShell } from "@/components/marketing-shell"
import { ContactPageContent } from "@/components/contact-page-content"

export const metadata: Metadata = {
  title: "상담 신청 | CollaboTicket",
  description:
    "일본 진출·인플루언서·체험단·SNS 운영 등 실행 전략 상담을 신청하세요. 제출 후 1영업일 이내 연락드립니다.",
  openGraph: {
    title: "상담 신청 | CollaboTicket",
    description: "데이터 기반 일본 시장 실행 전략 상담을 신청하세요.",
  },
}

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Contact</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">상담 신청</h1>
          <p className="mt-4 text-muted-foreground">
            브랜드 상황에 맞는 일본 진출 실행 구조를 함께 설계합니다.
          </p>
          <div className="mt-10">
            <ContactPageContent />
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
