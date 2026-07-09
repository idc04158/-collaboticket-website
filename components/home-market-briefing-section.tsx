import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getInsightCategoryLabel } from "@/lib/insight-categories"
import type { InsightEnriched } from "@/lib/insight-hub"

type Props = {
  insights: InsightEnriched[]
  totalCount: number
  weeklyNewCount: number
  lastUpdated: string
}

function getInsightEmoji(post: InsightEnriched): string {
  if (post.platforms.includes("Qoo10")) return "💄"
  if (post.platforms.includes("Rakuten")) return "📈"
  if (post.platforms.includes("TikTok") || post.topics.includes("SNS")) return "🎥"
  if (post.industries.includes("건강기능식품")) return "💊"
  if (post.industries.includes("화장품")) return "🧴"
  if (post.topics.includes("시장분석")) return "📊"
  return "🇯🇵"
}

function getInsightChannelLabel(post: InsightEnriched): string {
  if (post.platforms.length > 0) return post.platforms[0]
  if (post.topics.length > 0) return post.topics[0]
  return getInsightCategoryLabel(post.category)
}

export function HomeMarketBriefingSection({ insights, totalCount, weeklyNewCount, lastUpdated }: Props) {
  return (
    <section
      id="market-briefing"
      aria-labelledby="market-briefing-title"
      className="scroll-mt-24 border-b bg-[var(--surface-elevated)] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="section-label">Japan Commerce Intelligence</p>
            <h2 id="market-briefing-title" className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              이번 주 일본 시장 브리핑
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              실제 일본 EC·SNS·카테고리 운영 데이터를 바탕으로 매주 업데이트합니다. 시장 변화를 먼저
              확인하고, 실행까지 연결하세요.
            </p>
          </div>

          <dl className="flex shrink-0 gap-6 rounded-2xl border bg-card px-6 py-4 shadow-sm">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">이번 주 신규</dt>
              <dd className="mt-1 font-mono text-2xl font-bold text-brand">{weeklyNewCount}</dd>
            </div>
            <div className="w-px bg-border" aria-hidden="true" />
            <div>
              <dt className="text-xs font-medium text-muted-foreground">전체 리포트</dt>
              <dd className="mt-1 font-mono text-2xl font-bold">{totalCount}</dd>
            </div>
            <div className="w-px bg-border" aria-hidden="true" />
            <div>
              <dt className="text-xs font-medium text-muted-foreground">최신 업데이트</dt>
              <dd className="mt-1 text-sm font-semibold">
                <time dateTime={lastUpdated}>{lastUpdated}</time>
              </dd>
            </div>
          </dl>
        </div>

        {insights.length === 0 ? (
          <p className="mt-10 rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            곧 새로운 시장 브리핑이 업데이트됩니다.
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border bg-card shadow-sm">
            {insights.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group flex items-center gap-4 px-5 py-5 transition hover:bg-brand-light/20 sm:gap-6 sm:px-6"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-xl sm:size-12">
                    {getInsightEmoji(post)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-brand">
                      {getInsightChannelLabel(post)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-base font-bold leading-snug transition group-hover:text-brand sm:text-lg">
                      {post.title}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:inline-flex">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {post.readingTimeMinutes}분 읽기
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="btn-brand h-11 rounded-xl px-8">
            <Link href="/insights">
              전체 인사이트 허브 ({totalCount})
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 rounded-xl px-8 font-semibold">
            <Link href="/contact">실행 상담 신청</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
