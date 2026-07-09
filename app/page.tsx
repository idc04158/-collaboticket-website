import type { Metadata } from "next"

import { getAllEnrichedInsights, getAllInsightSummaries, getHubStats } from "@/lib/insights"
import { HomePageClient } from "@/components/home-page-client"
import { HomeJsonLd } from "@/components/home-json-ld"

export const metadata: Metadata = {
  title: "콜라보티켓 | Japan Commerce Intelligence & Execution",
  description:
    "일본 시장 인사이트를 매주 제공하고 EC·콘텐츠·인플루언서 운영까지 실행하는 Japan Commerce Intelligence & Execution Company. Qoo10·Rakuten·Amazon 운영과 현지 콘텐츠 제작을 한 팀이 수행합니다.",
  openGraph: {
    title: "콜라보티켓 | 일본 시장을 분석하고, 실행까지",
    description:
      "매주 업데이트되는 일본 EC 인사이트와 Qoo10·Rakuten·Amazon 운영, 현지 콘텐츠·인플루언서 시딩을 통합 실행합니다.",
  },
}

export default function Home() {
  const allInsights = getAllInsightSummaries()
  const enrichedInsights = getAllEnrichedInsights()
  const hubStats = getHubStats(allInsights)
  const weeklyBriefing = enrichedInsights.slice(0, 5)
  const insightTeasers = allInsights.slice(0, 3)

  return (
    <>
      <HomeJsonLd />
      <HomePageClient
        weeklyBriefing={weeklyBriefing}
        insightTeasers={insightTeasers}
        totalInsightCount={hubStats.totalInsights}
        weeklyNewCount={hubStats.weeklyNewReports}
        lastUpdated={hubStats.lastUpdated}
      />
    </>
  )
}
