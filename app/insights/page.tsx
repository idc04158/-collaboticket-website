import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { MarketingShell } from "@/components/marketing-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getAllInsightSummaries } from "@/lib/insights"
import { ArrowRight, Calendar, FileText } from "lucide-react"

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

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/insights/${post.slug}`} className="group block h-full">
                <Card className="h-full border-border transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    {post.image ? (
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border">
                        <Image
                          src={post.image}
                          alt={`${post.title} 썸네일`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
                        <FileText className="size-5" />
                      </div>
                    )}
                    <Badge variant="secondary" className="w-fit text-xs">
                      {post.category}
                    </Badge>
                    <h2 className="line-clamp-2 text-lg font-semibold leading-snug transition group-hover:text-[#00B140]">
                      {post.title}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                    {post.date && (
                      <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <time dateTime={post.date}>{post.date}</time>
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#00B140]">
                      읽어보기
                      <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

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
