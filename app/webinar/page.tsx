import type { Metadata } from "next"

import { MarketingShell } from "@/components/marketing-shell"
import { WebinarList } from "./webinar-list"

export const metadata: Metadata = {
  title: "웨비나 | CollaboTicket",
  description:
    "일본 이커머스·인플루언서·데이터 전략을 다루는 웨비나 일정과 다시 보기 요약을 안내합니다.",
}

export default function WebinarPage() {
  return (
    <MarketingShell>
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Webinars</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">웨비나</h1>
          <p className="mt-4 text-muted-foreground">
            일본 시장 실행과 데이터에 관한 온라인 세션 일정입니다. 사전 신청은 상담 폼과 동일하게 접수됩니다.
          </p>
        </div>

        <WebinarList />
      </section>
    </MarketingShell>
  )
}
