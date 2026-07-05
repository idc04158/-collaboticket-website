"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, ArrowRight, Play } from "lucide-react"
import { splitWebinars, type Webinar } from "@/lib/webinars"

function WebinarCard({ webinar, status }: { webinar: Webinar; status: "upcoming" | "past" }) {
  return (
    <Card className="overflow-hidden border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image src={webinar.image} alt={`${webinar.title} 배너`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
        {status === "upcoming" && (
          <span className="absolute left-4 top-4 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Coming Soon
          </span>
        )}
      </div>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <time dateTime={webinar.date}>{webinar.dateLabel}</time>
        </div>
        <h4 className="text-lg font-bold">{webinar.title}</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">{webinar.summary}</p>
        {status === "upcoming" ? (
          <Button asChild className="w-fit rounded-xl bg-brand text-white hover:bg-brand-dark">
            <Link href="/contact">
              사전 신청
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-fit rounded-xl">
            <Link href="/webinar">
              <Play className="size-4" />
              지난 웨비나 보기
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function WebinarsSection() {
  const { upcoming, past } = splitWebinars()

  return (
    <section id="webinars" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="section-label">웨비나</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">웨비나</h2>
          <p className="mt-4 text-muted-foreground">
            일본 시장 실행과 데이터 전략을 다루는 온라인 세션입니다.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              진행 예정
            </h3>
            {upcoming.length > 0 ? (
              upcoming.map((webinar) => <WebinarCard key={webinar.id} webinar={webinar} status="upcoming" />)
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <h4 className="font-bold">다음 웨비나를 준비 중입니다</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    새로운 일정이 확정되면 이 영역에 가장 먼저 공개됩니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">종료된 웨비나</h3>
            {past.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} status="past" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
