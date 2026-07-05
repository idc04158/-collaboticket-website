import Link from "next/link"
import Image from "next/image"
import { ArrowRight, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import type { InsightMeta } from "@/lib/insights"

type Props = {
  teasers: InsightMeta[]
  isLoading?: boolean
  totalCount?: number
}

export function InsightsSection({ teasers, isLoading = false, totalCount }: Props) {
  const count = totalCount ?? teasers.length

  return (
    <section id="insights" className="scroll-mt-24 bg-[var(--surface-elevated)] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="section-label">데이터 인사이트</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              데이터 인사이트 & 실행 사례
            </h2>
            <p className="mt-4 text-muted-foreground">
              분석과 실제 성과를 기반으로 일본 시장을 설명합니다.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border bg-card px-5 py-3 shadow-sm">
            <span className="font-mono text-3xl font-bold text-brand">{count}</span>
            <span className="text-sm text-muted-foreground">인사이트<br />리포트</span>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border bg-card p-6">
                <Skeleton className="mb-4 aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="mb-3 h-5 w-24" />
                <Skeleton className="mb-2 h-5 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : teasers.length === 0 ? (
          <Empty className="mt-12 rounded-2xl border bg-card py-14">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>아직 공개된 인사이트가 없습니다.</EmptyTitle>
              <EmptyDescription>
                새로운 콘텐츠가 업로드되면 이 영역에 자동으로 표시됩니다.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {teasers.map((article) => (
              <article
                key={article.slug}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
              >
                {article.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={`${article.title} 썸네일`}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-muted/40 text-muted-foreground">
                    <FileText className="size-6" />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <Badge variant="secondary" className="w-fit text-xs">{article.category}</Badge>
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug transition group-hover:text-brand">
                    <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {article.description}
                  </p>
                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand"
                  >
                    자세히 보기
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <Button asChild variant="outline" size="lg" className="rounded-xl border-brand px-8 font-semibold text-brand hover:bg-brand hover:text-white">
            <Link href="/insights">모든 인사이트 보기 ({count})</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
