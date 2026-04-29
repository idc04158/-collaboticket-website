"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import { splitWebinars, type Webinar } from "@/lib/webinars"

function SessionCard({ session, status }: { session: Webinar; status: "upcoming" | "past" }) {
  return (
    <Card className="overflow-hidden border-border transition hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden border-b bg-muted">
        <Image src={session.image} alt={`${session.title} 배너`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
      </div>
      <CardContent className="space-y-4 p-8">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className={
              status === "upcoming"
                ? "rounded-full bg-[#00B140]/10 px-2 py-0.5 font-medium text-[#00B140]"
                : "rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground"
            }
          >
            {status === "upcoming" ? "커밍순" : "지난 웨비나"}
          </span>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4" />
            <time dateTime={session.date}>{session.dateLabel}</time>
          </div>
        </div>
        <h2 className="text-xl font-semibold">{session.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{session.summary}</p>
        {status === "upcoming" ? (
          <Button asChild className="w-fit bg-[#00B140] text-white transition hover:bg-[#009C38]">
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
  )
}

export function WebinarList() {
  const { upcoming, past } = splitWebinars()

  return (
    <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-10 px-6">
      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#00B140]">Coming Soon</h2>
          <div className="flex flex-col gap-8">
            {upcoming.map((session) => (
              <SessionCard key={session.id} session={session} status="upcoming" />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Past Webinars</h2>
        <div className="flex flex-col gap-8">
          {past.map((session) => (
            <SessionCard key={session.id} session={session} status="past" />
          ))}
        </div>
      </section>
    </div>
  )
}
