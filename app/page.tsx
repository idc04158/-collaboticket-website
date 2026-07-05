import type { Metadata } from "next"

import { getAllInsightSummaries } from "@/lib/insights"
import { HomePageClient } from "@/components/home-page-client"
import { HomeJsonLd } from "@/components/home-json-ld"

export const metadata: Metadata = {
  title: "콜라보티켓 | 한국 브랜드 일본 시장 진출 A to Z 실행 파트너",
  description:
    "콜라보티켓은 한국 브랜드의 일본 시장 진출을 A부터 Z까지 실행합니다. 일본 오픈마켓 운영, 일본 SNS·인플루언서·리뷰 마케팅, 일본 광고, 일본 물류, 법인 설립, 상표 등록을 하나의 팀이 통합 지원합니다.",
  openGraph: {
    title: "콜라보티켓 | 일본 시장 진출 = 콜라보티켓",
    description:
      "일본 현지 인플루언서 네트워크와 데이터 기반 통합 운영으로 한국 브랜드의 일본 EC·SNS·리뷰·물류를 실행합니다.",
  },
}

export default function Home() {
  const allInsights = getAllInsightSummaries()
  const insightTeasers = allInsights.slice(0, 3)

  return (
    <>
      <HomeJsonLd />
      <HomePageClient insightTeasers={insightTeasers} totalInsightCount={allInsights.length} />
    </>
  )
}
