import type { Metadata } from "next"
import { Suspense } from "react"

import { MarketingShell } from "@/components/marketing-shell"
import { InsightsHubHero } from "@/components/insights/insights-hub-hero"
import { InsightsFeaturedReport } from "@/components/insights/insights-featured-report"
import { InsightsWeeklyBrief } from "@/components/insights/insights-weekly-brief"
import { InsightsNewsletter } from "@/components/insights/insights-newsletter"
import { InsightsIndexClient } from "@/components/insights-index-client"
import { InsightsHubJsonLd } from "@/components/insights/insights-hub-json-ld"
import { GlossaryHubLink } from "@/components/insights/glossary-hub-link"
import {
  getAllEnrichedInsights,
  getFeaturedReports,
  getHubStats,
  getWeeklyBriefLines,
} from "@/lib/insights"

export const metadata: Metadata = {
  title: "일본 시장 인사이트 | CollaboTicket",
  description:
    "일본 EC, SNS, 소비자 트렌드, 광고 데이터, 플랫폼 변화, 성공 사례를 분석한 일본 시장 데이터 센터입니다.",
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    title: "일본 시장 인사이트 | CollaboTicket",
    description: "실행 가능한 일본 시장 데이터와 인사이트를 매주 업데이트합니다.",
    url: "/insights",
  },
}

export default function InsightsIndexPage() {
  const posts = getAllEnrichedInsights()
  const stats = getHubStats(posts)
  const featuredReports = getFeaturedReports(posts)
  const weeklyBrief = getWeeklyBriefLines(posts)

  return (
    <MarketingShell>
      <InsightsHubJsonLd posts={posts} stats={stats} />
      <InsightsHubHero stats={stats} />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        {featuredReports.length > 0 && <InsightsFeaturedReport reports={featuredReports} />}
        <div className="mt-8">
          <GlossaryHubLink />
        </div>
        <InsightsWeeklyBrief lines={weeklyBrief} />
        <InsightsNewsletter />

        <section aria-labelledby="insights-list-title" className="mt-12">
          <h2 id="insights-list-title" className="text-2xl font-black tracking-tight">
            전체 리포트
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Qoo10, Rakuten, Amazon Japan, Meta, TikTok, LINE, 리뷰, 인플루언서, 물류 주제별로 탐색하세요.
          </p>

          <div className="mt-8">
            <Suspense fallback={<p className="text-sm text-muted-foreground">리포트 목록을 불러오는 중...</p>}>
              <InsightsIndexClient posts={posts} />
            </Suspense>
          </div>
        </section>
      </div>
    </MarketingShell>
  )
}
