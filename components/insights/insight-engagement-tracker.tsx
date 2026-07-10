"use client"

import { useEffect, useRef } from "react"

import {
  trackInsightPageView,
  trackInsightReadThreshold,
  trackInsightScroll,
} from "@/lib/analytics/gtag-client"
import {
  READ_THRESHOLD,
  getInquiryIdFromUrl,
  getOrCreateVisitorId,
  recordPageVisit,
  sendServerTrackEvent,
  updateArticleProgress,
} from "@/lib/visitor-tracking"

type InsightEngagementTrackerProps = {
  slug: string
  title: string
}

const SCROLL_MILESTONES = [25, 50, 75, 90] as const

function getArticleScrollDepth(articleEl: HTMLElement): number {
  const rect = articleEl.getBoundingClientRect()
  const articleTop = rect.top + window.scrollY
  const articleHeight = Math.max(articleEl.offsetHeight, 1)
  const viewportBottom = window.scrollY + window.innerHeight
  const readPx = viewportBottom - articleTop
  return Math.min(1, Math.max(0, readPx / articleHeight))
}

function countAtThreshold(activity: ReturnType<typeof updateArticleProgress>) {
  return Object.values(activity.reads).filter((r) => r.reachedThreshold).length
}

export function InsightEngagementTracker({ slug, title }: InsightEngagementTrackerProps) {
  const firedMilestones = useRef<Set<number>>(new Set())
  const thresholdSent = useRef(false)
  const postSubmitReadSent = useRef(false)

  useEffect(() => {
    const visitorId = getOrCreateVisitorId()
    const inquiryId = getInquiryIdFromUrl() || undefined
    const funnel = inquiryId ? "post_submit" : "organic"

    recordPageVisit(`/insights/${slug}`, title)
    trackInsightPageView(slug, title)

    void sendServerTrackEvent({
      visitorId,
      inquiryId,
      event: "insight_page_view",
      funnel,
      slug,
      title,
      path: `/insights/${slug}`,
    })

    firedMilestones.current = new Set()
    thresholdSent.current = false
    postSubmitReadSent.current = false

    const onScroll = () => {
      const articleEl = document.querySelector("article")
      if (!articleEl) return

      const depth = getArticleScrollDepth(articleEl)
      const pct = Math.round(depth * 100)
      const activity = updateArticleProgress(slug, title, depth)
      const vid = getOrCreateVisitorId()
      const currentInquiryId = getInquiryIdFromUrl() || undefined

      for (const milestone of SCROLL_MILESTONES) {
        if (pct >= milestone && !firedMilestones.current.has(milestone)) {
          firedMilestones.current.add(milestone)
          trackInsightScroll(slug, milestone)
          void sendServerTrackEvent({
            visitorId: vid,
            inquiryId: currentInquiryId,
            event: "scroll",
            funnel: currentInquiryId ? "post_submit" : "organic",
            slug,
            title,
            scrollPct: milestone,
            path: `/insights/${slug}`,
          })
        }
      }

      if (depth >= READ_THRESHOLD && !thresholdSent.current) {
        thresholdSent.current = true
        const count = countAtThreshold(activity)
        trackInsightReadThreshold(slug, count)
        void sendServerTrackEvent({
          visitorId: vid,
          inquiryId: currentInquiryId,
          event: "read_threshold",
          funnel: currentInquiryId ? "post_submit" : "organic",
          slug,
          title,
          scrollPct: 50,
          path: `/insights/${slug}`,
          meta: { articlesAtThreshold: count },
        })
      }

      if (
        currentInquiryId &&
        depth >= READ_THRESHOLD &&
        !postSubmitReadSent.current
      ) {
        postSubmitReadSent.current = true
        void sendServerTrackEvent({
          visitorId: vid,
          inquiryId: currentInquiryId,
          event: "post_submit_article_read",
          funnel: "post_submit",
          slug,
          title,
          scrollPct: 50,
          path: `/insights/${slug}`,
        })
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [slug, title])

  return null
}
