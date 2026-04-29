"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, ArrowRight, Play } from "lucide-react"
import { splitWebinars, type Webinar } from "@/lib/webinars"

function WebinarCard({ webinar, status }: { webinar: Webinar; status: "upcoming" | "past" }) {
  return (
    <Card className="overflow-hidden border-border bg-card transition hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden border-b bg-muted">
        <Image src={webinar.image} alt={`${webinar.title} 배너`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <time dateTime={webinar.date}>{webinar.dateLabel}</time>
        </div>
        <h4 className="font-sans text-xl font-semibold text-foreground">{webinar.title}</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">{webinar.summary}</p>
        {status === "upcoming" ? (
          <Button
            asChild
            size="lg"
            className="w-fit rounded-lg bg-[#00B140] px-8 font-medium text-white transition hover:bg-[#009C38]"
          >
            <Link href="/contact">
              사전 신청
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="lg" className="w-fit rounded-lg px-8 font-medium">
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
    <section id="webinars" className="scroll-mt-24 bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Webinars
          </p>
          <h2 className="font-sans text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            웨비나
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/40" />
                <span className="relative inline-flex size-2 rounded-full bg-foreground" />
              </span>
              진행 예정 웨비나
            </h3>
            {upcoming.length > 0 ? (
              upcoming.map((webinar) => <WebinarCard key={webinar.id} webinar={webinar} status="upcoming" />)
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="p-8">
                  <h4 className="font-sans text-xl font-semibold text-foreground">다음 웨비나를 준비 중입니다</h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    새로운 일정이 확정되면 이 영역에 가장 먼저 공개됩니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              종료된 웨비나
            </h3>
            {past.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} status="past" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
