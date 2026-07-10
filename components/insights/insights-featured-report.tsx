"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Clock, Flame } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { getInsightCategoryLabel } from "@/lib/insight-categories"
import type { InsightEnriched } from "@/lib/insight-hub"
import { cn } from "@/lib/utils"

type Props = {
  reports: InsightEnriched[]
}

const AUTOPLAY_MS = 6000

function FeaturedReportSlide({ report }: { report: InsightEnriched }) {
  return (
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
          <h3 className="type-section-title mt-4">
            <Link href={`/insights/${report.slug}`} className="transition hover:text-brand">
              {report.title}
            </Link>
          </h3>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{report.aiSummary}</p>

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
  )
}

export function InsightsFeaturedReport({ reports }: Props) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return
    setActiveIndex(carouselApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, onSelect])

  useEffect(() => {
    if (!api || reports.length <= 1 || isPaused) return

    const timer = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [api, isPaused, reports.length])

  if (reports.length === 0) return null

  if (reports.length === 1) {
    return (
      <section aria-labelledby="featured-report-title" className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="size-5 text-brand" aria-hidden="true" />
          <h2 id="featured-report-title" className="text-lg font-bold">
            이번주 추천 리포트
          </h2>
        </div>
        <FeaturedReportSlide report={reports[0]} />
      </section>
    )
  }

  return (
    <section
      aria-labelledby="featured-report-title"
      className="mt-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false)
        }
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-brand" aria-hidden="true" />
          <h2 id="featured-report-title" className="text-lg font-bold">
            이번주 추천 리포트
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {activeIndex + 1} / {reports.length}
        </p>
      </div>

      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          className="w-full"
          aria-label="추천 리포트 로테이션"
        >
          <CarouselContent className="-ml-0">
            {reports.map((report) => (
              <CarouselItem key={report.slug} className="basis-full pl-0">
                <FeaturedReportSlide report={report} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-3 z-10 size-9 -translate-y-1/2 rounded-full border-white/80 bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
            onClick={() => api?.scrollPrev()}
            aria-label="이전 추천 리포트"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-3 z-10 size-9 -translate-y-1/2 rounded-full border-white/80 bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
            onClick={() => api?.scrollNext()}
            aria-label="다음 추천 리포트"
          >
            <ChevronRight className="size-4" />
          </Button>
        </Carousel>

        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="추천 리포트 슬라이드">
          {reports.map((report, index) => (
            <button
              key={report.slug}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${index + 1}번째 추천 리포트: ${report.title}`}
              className={cn(
                "h-2 rounded-full transition-all",
                index === activeIndex ? "w-6 bg-brand" : "w-2 bg-border hover:bg-brand/40",
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
