import type { Metadata } from "next"
import Link from "next/link"

import { MarketingShell } from "@/components/marketing-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

export const metadata: Metadata = {
  title: "웨비나 | CollaboTicket",
  description:
    "일본 이커머스·인플루언서·데이터 전략을 다루는 웨비나 일정과 다시 보기 요약을 안내합니다.",
}

const sessions = [
  {
    status: "upcoming" as const,
    date: "2026-03-15",
    dateLabel: "2026년 3월 15일 (목) 14:00 KST",
    title: "일본 이커머스 시장 진출을 위한 데이터 전략",
    summary:
      "최신 트렌드와 데이터 분석 프레임워크로 한국 브랜드의 진출 전략을 정리합니다.",
  },
  {
    status: "past" as const,
    date: "2026-01-20",
    dateLabel: "2026년 1월 20일 (수) 14:00 KST",
    title: "K-뷰티 브랜드를 위한 일본 인플루언서 활용법",
    summary: "뷰티 카테고리에서 인플루언서 캠페인으로 인지도와 매출을 동시에 끌어올린 사례를 집중 분석했습니다.",
  },
]

export default function WebinarPage() {
  return (
    <MarketingShell>
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Webinars</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">웨비나</h1>
          <p className="mt-4 text-muted-foreground">
            일본 시장 실행과 데이터에 관한 온라인 세션 일정입니다. 사전 신청은 상담 폼과 동일하게 접수됩니다.
          </p>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-8 px-6">
          {sessions.map((s) => (
            <Card key={s.date + s.title} className="overflow-hidden border-border transition hover:shadow-md">
              <CardContent className="space-y-4 p-8">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span
                    className={
                      s.status === "upcoming"
                        ? "rounded-full bg-[#00B140]/10 px-2 py-0.5 font-medium text-[#00B140]"
                        : "rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground"
                    }
                  >
                    {s.status === "upcoming" ? "예정" : "종료"}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <time dateTime={s.date}>{s.dateLabel}</time>
                  </div>
                </div>
                <h2 className="text-xl font-semibold">{s.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                {s.status === "upcoming" ? (
                  <Button
                    asChild
                    className="w-fit bg-[#00B140] text-white transition hover:bg-[#009C38]"
                  >
                    <Link href="/contact">사전 신청하기</Link>
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    종료된 세션입니다. 유사 주제는{" "}
                    <Link href="/insights" className="font-medium text-[#00B140] underline-offset-4 hover:underline">
                      인사이트
                    </Link>
                    에서 확인하거나 상담을 요청해 주세요.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </MarketingShell>
  )
}
