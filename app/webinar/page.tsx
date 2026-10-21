import type { Metadata } from "next"

import { MarketingShell } from "@/components/marketing-shell"
import { PageHero } from "@/components/page-hero"
import { WebinarList } from "./webinar-list"

const title = "웨비나 | CollaboTicket"
const description =
  "일본 이커머스·인플루언서·데이터 전략을 다루는 웨비나 일정과 다시 보기 요약을 안내합니다."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/webinar",
  },
  openGraph: {
    title,
    description,
    url: "/webinar",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export default function WebinarPage() {
  return (
    <MarketingShell>
      <PageHero
        label="Webinars"
        title="웨비나"
        description="일본 시장 실행과 데이터에 관한 온라인 세션입니다. 사전 신청은 상담 폼과 동일하게 접수됩니다."
      />
      <WebinarList />
    </MarketingShell>
  )
}
