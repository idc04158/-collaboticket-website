import Link from "next/link"
import { ArrowRight, Calendar, Clock, Flame } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getInsightCategoryLabel } from "@/lib/insight-categories"
import type { InsightEnriched } from "@/lib/insight-hub"

type Props = {
  report: InsightEnriched
}

export function InsightsFeaturedReport({ report }: Props) {
  return (
    <section aria-labelledby="featured-report-title" className="mt-12">
      <div className="mb-4 flex items-center gap-2">
        <Flame className="size-5 text-brand" aria-hidden="true" />
        <h2 id="featured-report-title" className="text-lg font-bold">
          이번주 추천 리포트
        </h2>
      </div>

      <article className="overflow-hidden rounded-2xl border border-brand/20 bg-card shadow-sm transition hover:border-brand/35 hover:shadow-[0_12px_40px_var(--brand-glow)]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          {report.image && (
            <div className="relative min-h-[220px] bg-muted/30 lg:min-h-full">
              <img
                src={report.image}
                alt={`${report.title} 대표 이미지`}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <Badge className="w-fit bg-brand text-white">🔥 이번주 일본 시장 리포트</Badge>
            <h3 className="mt-4 text-balance text-2xl font-black leading-snug tracking-tight sm:text-3xl">
              <Link href={`/insights/${report.slug}`} className="transition hover:text-brand">
                {report.title}
              </Link>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{report.aiSummary}</p>

            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border bg-background px-4 py-3">
                <dt className="text-xs text-muted-foreground">읽는 시간</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-semibold">
                  <Clock className="size-3.5 text-brand" aria-hidden="true" />
                  {report.readingTimeMinutes}분
                </dd>
              </div>
              <div className="rounded-xl border bg-background px-4 py-3">
                <dt className="text-xs text-muted-foreground">업데이트</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-semibold">
                  <Calendar className="size-3.5 text-brand" aria-hidden="true" />
                  <time dateTime={report.date}>{report.date}</time>
                </dd>
              </div>
              <div className="rounded-xl border bg-background px-4 py-3">
                <dt className="text-xs text-muted-foreground">추천 대상</dt>
                <dd className="mt-1 font-semibold">{report.audience}</dd>
              </div>
              <div className="rounded-xl border bg-background px-4 py-3">
                <dt className="text-xs text-muted-foreground">관련 플랫폼</dt>
                <dd className="mt-1 font-semibold">
                  {report.platforms.length > 0 ? report.platforms.join(" · ") : getInsightCategoryLabel(report.category)}
                </dd>
              </div>
            </dl>

            <Button asChild className="btn-brand mt-6 w-fit gap-2">
              <Link href={`/insights/${report.slug}`}>
                리포트 읽기
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </section>
  )
}
