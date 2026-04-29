import type { Metadata } from "next"

import { MarketingShell } from "@/components/marketing-shell"
import { InsightsIndexClient } from "@/components/insights-index-client"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getAllInsightSummaries } from "@/lib/insights"
import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "인사이트 | CollaboTicket",
  description:
    "일본 이커머스·인플루언서·SNS·법인/물류 실행에 필요한 데이터 인사이트와 사례를 정리했습니다.",
  openGraph: {
    title: "인사이트 | CollaboTicket",
    description: "일본 시장 실행 전략과 사례를 데이터 기반으로 공유합니다.",
  },
}

export default function InsightsIndexPage() {
  const posts = getAllInsightSummaries()

  return (
    <MarketingShell>
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Insights</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">인사이트 자료</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            시장 분석, 실행 가이드, 케이스 스터디를 한곳에서 확인하세요.
          </p>

          <InsightsIndexClient posts={posts} />

          {posts.length === 0 && (
            <div className="mt-12">
              <Empty className="rounded-2xl border bg-card py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyTitle>아직 등록된 인사이트가 없습니다.</EmptyTitle>
                  <EmptyDescription>
                    CMS 또는 DB에서 신규 콘텐츠가 연동되면 자동으로 카드가 표시됩니다.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>
      </section>
    </MarketingShell>
  )
}
