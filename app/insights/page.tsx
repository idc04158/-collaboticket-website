import type { Metadata } from "next"

import { MarketingShell } from "@/components/marketing-shell"
import { PageHero } from "@/components/page-hero"
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
      <PageHero
        label="Insights"
        title="데이터 인사이트 자료"
        description="시장 분석, 실행 가이드, 케이스 스터디를 한곳에서 확인하세요. 50개 이상의 리포트가 지속 업데이트됩니다."
      >
        <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
          <span className="font-mono text-3xl font-bold text-brand">{posts.length}</span>
          <span className="text-sm text-white/60">인사이트 리포트</span>
        </div>
      </PageHero>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
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
                    신규 콘텐츠가 연동되면 자동으로 카드가 표시됩니다.
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
