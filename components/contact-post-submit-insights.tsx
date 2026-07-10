"use client"

import Link from "next/link"

import type { RecommendedInsight } from "@/lib/visitor-tracking"
import { getOrCreateVisitorId, sendServerTrackEvent } from "@/lib/visitor-tracking"

type Props = {
  inquiryId: string
  articles: RecommendedInsight[]
}

export function ContactPostSubmitInsights({ inquiryId, articles }: Props) {
  if (articles.length === 0) return null

  function trackClick(slug: string, title: string) {
    void sendServerTrackEvent({
      visitorId: getOrCreateVisitorId(),
      inquiryId,
      event: "post_submit_article_click",
      funnel: "post_submit",
      slug,
      title,
      path: `/insights/${slug}`,
    })
  }

  return (
    <div className="mt-10 rounded-2xl border bg-background p-6 text-left">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand">맞춤 인사이트</p>
      <h3 className="mt-2 text-lg font-bold">상담 전에 읽어보면 좋은 글</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        신청 내용을 바탕으로 선별한 실행 가이드입니다. 미리 읽어두시면 상담이 더 빠르게 진행됩니다.
      </p>
      <ul className="mt-5 space-y-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/insights/${article.slug}?inquiryId=${encodeURIComponent(inquiryId)}&source=post_submit`}
              onClick={() => trackClick(article.slug, article.title)}
              className="block rounded-xl border px-4 py-3 text-sm font-semibold transition hover:border-brand hover:bg-brand-light"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
