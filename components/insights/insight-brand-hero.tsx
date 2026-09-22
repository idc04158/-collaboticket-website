import Link from "next/link"

import { InsightBrandCover } from "@/components/insights/insight-brand-cover"
import { getInsightCategoryLabel } from "@/lib/insight-categories"
import { getGlossaryHref } from "@/lib/marketing-glossary"
import { cn } from "@/lib/utils"

type Props = {
  title: string
  description?: string
  category: string
  date?: string
  readingTimeMinutes?: number
  audience?: string
  platforms?: string[]
  difficulty?: string
  image?: string
  heroMode?: "brand" | "diagram"
}

export function InsightBrandHero({
  title,
  description,
  category,
  date,
  readingTimeMinutes,
  audience,
  platforms = [],
  difficulty,
  image,
  heroMode = "brand",
}: Props) {
  return (
    <header className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
      <InsightBrandCover
        heroMode={heroMode}
        mediaSrc={image}
        className="min-h-[min(72vh,560px)] w-full"
      >
        <div className="mx-auto flex min-h-[min(72vh,560px)] max-w-4xl flex-col justify-end px-6 pb-10 pt-24 sm:pb-14 sm:pt-28">
          <nav
            aria-label="인사이트 breadcrumb"
            className="mb-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/80"
          >
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 font-semibold text-white underline-offset-4 hover:underline"
            >
              ← 일본 시장 인사이트
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href={getGlossaryHref()}
              className="font-semibold text-white/90 underline-offset-4 hover:underline"
            >
              용어 사전
            </Link>
          </nav>

          <p className="mt-10 text-xs font-bold uppercase tracking-[0.14em] text-brand-light">
            {getInsightCategoryLabel(category)}
            {difficulty ? ` · ${difficulty}` : ""}
            {platforms.length > 0 ? ` · ${platforms.slice(0, 2).join(" · ")}` : ""}
          </p>
          <h1
            className={cn(
              "mt-3 max-w-3xl text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-[1.25] tracking-tight text-white",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {description}
            </p>
          ) : null}
          {(date || readingTimeMinutes || audience) && (
            <p className="mt-4 text-sm text-white/65">
              {date ? <time dateTime={date}>업데이트 {date}</time> : null}
              {date && readingTimeMinutes ? <span className="mx-2">·</span> : null}
              {readingTimeMinutes ? <span>{readingTimeMinutes}분 읽기</span> : null}
              {(date || readingTimeMinutes) && audience ? <span className="mx-2">·</span> : null}
              {audience ? <span>추천 대상: {audience}</span> : null}
            </p>
          )}
        </div>
      </InsightBrandCover>
    </header>
  )
}
