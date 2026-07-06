import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, FileText, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { getInsightCategoryLabel } from "@/lib/insight-categories"
import type { InsightEnriched } from "@/lib/insight-hub"

type Props = {
  post: InsightEnriched
}

export function InsightCard({ post }: Props) {
  return (
    <Link href={`/insights/${post.slug}`} className="group block h-full min-w-0">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
        {post.image ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/30">
            <Image
              src={post.image}
              alt={`${post.title} 썸네일`}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-muted/40 text-muted-foreground">
            <FileText className="size-6" aria-hidden="true" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getInsightCategoryLabel(post.category)}
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              {post.difficulty}
            </Badge>
          </div>

          <h3 className="line-clamp-2 text-base font-bold leading-snug transition group-hover:text-brand">
            {post.title}
          </h3>

          <div className="rounded-xl border border-brand/15 bg-brand-light/30 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand">
              <Sparkles className="size-3.5" aria-hidden="true" />
              AI 요약
            </p>
            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-foreground/80">{post.aiSummary}</p>
          </div>

          {post.checklist.length > 0 && (
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {post.checklist.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand" aria-hidden="true">
                    □
                  </span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          )}

          <dl className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" aria-hidden="true" />
              <dt className="sr-only">읽는 시간</dt>
              <dd>{post.readingTimeMinutes}분</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
              <dt className="sr-only">업데이트</dt>
              <dd>
                <time dateTime={post.date}>{post.date}</time>
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="font-semibold text-foreground/70">추천 대상</dt>
              <dd className="mt-0.5 line-clamp-1">{post.audience}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-semibold text-foreground/70">관련 플랫폼</dt>
              <dd className="mt-0.5 line-clamp-1">
                {post.platforms.length > 0 ? post.platforms.join(" · ") : "일본 EC·SNS"}
              </dd>
            </div>
          </dl>

          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
            리포트 읽기
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  )
}
