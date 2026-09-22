import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { InsightBrandCover } from "@/components/insights/insight-brand-cover"
import { articleSpaceClass, articleTypeClass } from "@/lib/design-tokens"
import type { InsightEnriched } from "@/lib/insight-hub"
import { cn } from "@/lib/utils"

export type RelatedInsightItem = {
  post: InsightEnriched
  reason: string
}

type Props = {
  items: RelatedInsightItem[]
}

export function InsightRelatedRail({ items }: Props) {
  if (!items.length) return null

  return (
    <section aria-labelledby="related-title" className="border-t border-border pt-[var(--article-space-8)]">
      <h2 id="related-title" className={cn(articleTypeClass.h2, "text-foreground")}>
        더 읽어보기
      </h2>
      <p className={cn(articleTypeClass.caption, articleSpaceClass.mt2, "text-muted-foreground")}>
        지금 글에서 막힌 지점과 이어지는 다음 리포트입니다.
      </p>
      <ul className={cn("grid md:grid-cols-3", articleSpaceClass.mt3, articleSpaceClass.gap2)}>
        {items.map(({ post, reason }) => (
          <li key={post.slug}>
            <Link
              href={`/insights/${post.slug}`}
              className="article-card article-card--info group flex h-full flex-col overflow-hidden !p-0 no-underline transition hover:border-brand/35"
            >
              <InsightBrandCover
                heroMode={post.heroMode === "diagram" ? "diagram" : "brand"}
                mediaSrc={post.image}
                className="aspect-[16/9] w-full"
              />
              <div className="flex flex-1 flex-col p-[var(--article-space-2)]">
                <p className={cn(articleTypeClass.caption, "font-semibold text-brand")}>{reason}</p>
                <h3
                  className={cn(
                    articleTypeClass.title,
                    articleSpaceClass.mt1,
                    "line-clamp-2 text-foreground group-hover:text-brand",
                  )}
                >
                  {post.title}
                </h3>
                <span
                  className={cn(
                    "article-icon-text mt-auto pt-[var(--article-space-2)] text-sm font-semibold text-brand",
                  )}
                >
                  리포트 읽기
                  <ArrowRight className="article-icon article-icon--sm size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
