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
}

export function InsightsSection({ teasers, isLoading = false }: Props) {
  return (
    <section id="insights" className="scroll-mt-24 bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Data & Case Hub
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            데이터 인사이트 & 실행 사례
          </h2>
          <p className="mt-4 text-muted-foreground">
            분석과 실제 성과를 기반으로 일본 시장을 설명합니다.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border bg-background p-6">
                <Skeleton className="mb-4 aspect-[16/9] w-full rounded-lg" />
                <Skeleton className="mb-3 h-5 w-24" />
                <Skeleton className="mb-2 h-5 w-full" />
                <Skeleton className="mb-4 h-5 w-4/5" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : teasers.length === 0 ? (
          <Empty className="rounded-2xl border bg-background py-14">
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
          <div className="grid gap-8 md:grid-cols-3">
            {teasers.map((article) => (
              <article
                key={article.slug}
                className="group flex h-full flex-col gap-4 rounded-xl border bg-background p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {article.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg border">
                    <Image
                      src={article.image}
                      alt={`${article.title} 썸네일`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
                    <FileText className="size-5" />
                  </div>
                )}
                <Badge className="w-fit text-xs">{article.category}</Badge>

                <h3 className="line-clamp-2 text-lg font-semibold leading-snug transition group-hover:text-[#00B140]">
                  <Link href={`/insights/${article.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B140]/40">
                    {article.title}
                  </Link>
                </h3>

                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.description}</p>

                <Link
                  href={`/insights/${article.slug}`}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground transition hover:text-[#00B140]"
                >
                  자세히 보기
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-lg border-[#00B140] px-8 font-medium text-[#00B140] transition hover:bg-[#00B140] hover:text-white"
          >
            <Link href="/insights">모든 인사이트 보기</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
