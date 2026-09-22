import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"

import { InsightBrandCover } from "@/components/insights/insight-brand-cover"
import { Badge } from "@/components/ui/badge"
import { articleTypeClass } from "@/lib/design-tokens"
import { getInsightCategoryLabel } from "@/lib/insight-categories"
import type { InsightEnriched } from "@/lib/insight-hub"
import { cn } from "@/lib/utils"

type Props = {
  post: InsightEnriched
  reason?: string
}

export function InsightCard({ post, reason }: Props) {
  return (
    <Link href={`/insights/${post.slug}`} className="group block h-full min-w-0">
      <article className="article-card article-card--info flex h-full flex-col overflow-hidden !p-0 transition hover:border-brand/35">
        <InsightBrandCover
          heroMode={post.heroMode === "diagram" ? "diagram" : "brand"}
          mediaSrc={post.image}
          className="aspect-[16/9] w-full"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-[var(--article-space-2)] p-[var(--article-space-2)]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getInsightCategoryLabel(post.category)}
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              {post.difficulty}
            </Badge>
          </div>

          {reason ? (
            <p className={cn(articleTypeClass.caption, "font-semibold text-brand")}>{reason}</p>
          ) : null}

          <h3
            className={cn(
              articleTypeClass.title,
              "line-clamp-2 transition group-hover:text-brand",
            )}
          >
            {post.title}
          </h3>

          <p className={cn(articleTypeClass.caption, "line-clamp-3 text-muted-foreground")}>
            {post.aiSummary || post.description}
          </p>

          <dl className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div className="article-icon-text">
              <Clock className="article-icon article-icon--sm size-4 shrink-0" aria-hidden="true" />
              <dt className="sr-only">읽는 시간</dt>
              <dd>{post.readingTimeMinutes}분</dd>
            </div>
            <div className="article-icon-text">
              <Calendar className="article-icon article-icon--sm size-4 shrink-0" aria-hidden="true" />
              <dt className="sr-only">업데이트</dt>
              <dd>
                <time dateTime={post.date}>{post.date}</time>
              </dd>
            </div>
          </dl>

          <span className="article-icon-text mt-auto text-sm font-semibold text-brand">
            리포트 읽기
            <ArrowRight className="article-icon article-icon--sm size-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  )
}
