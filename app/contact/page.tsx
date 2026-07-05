import type { Metadata } from "next"

import { MarketingShell } from "@/components/marketing-shell"
import { PageHero } from "@/components/page-hero"
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
      <PageHero
        label="Contact"
        title="상담 신청"
        description="30분 무료 온라인 상담. 아래 폼을 작성하시면 예약 페이지로 안내해 드립니다."
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <ContactPageContent />
        </div>
      </section>
    </MarketingShell>
  )
}
