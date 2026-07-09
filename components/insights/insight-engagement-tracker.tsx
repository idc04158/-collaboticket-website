"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  trackConversionPopup,
  trackInsightPageView,
  trackInsightReadThreshold,
  trackInsightScroll,
} from "@/lib/analytics/gtag-client"
import {
  READ_THRESHOLD,
  dismissPopup,
  getOrCreateVisitorId,
  markPopupShown,
  recordPageVisit,
  sendServerTrackEvent,
  shouldShowConversionPopup,
  updateArticleProgress,
} from "@/lib/visitor-tracking"

import { InsightConversionPopup } from "./insight-conversion-popup"

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
  const popupTriggered = useRef(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [articlesRead, setArticlesRead] = useState(0)

  useEffect(() => {
    const visitorId = getOrCreateVisitorId()
    recordPageVisit(`/insights/${slug}`, title)
    trackInsightPageView(slug, title)

    void sendServerTrackEvent({
      visitorId,
      event: "page_view",
      slug,
      title,
      path: `/insights/${slug}`,
    })

    firedMilestones.current = new Set()
    thresholdSent.current = false
    popupTriggered.current = false

    const onScroll = () => {
      const articleEl = document.querySelector("article")
      if (!articleEl) return

      const depth = getArticleScrollDepth(articleEl)
      const pct = Math.round(depth * 100)
      const activity = updateArticleProgress(slug, title, depth)
      const vid = getOrCreateVisitorId()

      for (const milestone of SCROLL_MILESTONES) {
        if (pct >= milestone && !firedMilestones.current.has(milestone)) {
          firedMilestones.current.add(milestone)
          trackInsightScroll(slug, milestone)
          void sendServerTrackEvent({
            visitorId: vid,
            event: "scroll",
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
          event: "read_threshold",
          slug,
          title,
          scrollPct: 50,
          path: `/insights/${slug}`,
          meta: { articlesAtThreshold: count },
        })
      }

      if (!popupTriggered.current && shouldShowConversionPopup(activity, slug, depth)) {
        popupTriggered.current = true
        const count = countAtThreshold(activity)
        setArticlesRead(count)
        markPopupShown(activity)
        setPopupOpen(true)
        trackConversionPopup("shown", slug)
        void sendServerTrackEvent({
          visitorId: vid,
          event: "popup_shown",
          slug,
          title,
          path: `/insights/${slug}`,
          meta: { articlesAtThreshold: count },
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

  const handleDismiss = useCallback(() => {
    dismissPopup()
    setPopupOpen(false)
    trackConversionPopup("dismiss", slug)
    void sendServerTrackEvent({
      visitorId: getOrCreateVisitorId(),
      event: "popup_dismiss",
      slug,
      path: `/insights/${slug}`,
    })
  }, [slug])

  const handleContinue = useCallback(() => {
    setPopupOpen(false)
    trackConversionPopup("continue", slug)
  }, [slug])

  return (
    <InsightConversionPopup
      open={popupOpen}
      onOpenChange={setPopupOpen}
      onDismiss={handleDismiss}
      onContinue={handleContinue}
      onCtaClick={() => trackConversionPopup("cta_click", slug)}
      articlesRead={articlesRead}
    />
  )
}
