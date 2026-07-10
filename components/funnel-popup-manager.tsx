"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { ContactFunnelPopup } from "@/components/contact-funnel-popup"
import { KakaoConsultPopup } from "@/components/kakao-consult-popup"
import { getVisitorSegment, shouldOfferContactFunnel, shouldOfferKakaoFunnel } from "@/lib/funnel"
import {
  addDwellTime,
  dismissContactPopup,
  dismissKakaoPopup,
  getInquiryIdFromUrl,
  getOrCreateVisitorId,
  incrementVisitIfNewSession,
  isContactPopupDismissed,
  isKakaoPopupDismissed,
  loadActivity,
  markContactPopupShown,
  markKakaoPopupShown,
  recordPageVisit,
  sendServerTrackEvent,
  updateArticleProgress,
} from "@/lib/visitor-tracking"

const DWELL_TICK_MS = 10_000
const EXCLUDED_PREFIXES = ["/contact", "/admin"]

export function FunnelPopupManager() {
  const pathname = usePathname()
  const [kakaoOpen, setKakaoOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const pageEnteredAt = useRef(Date.now())
  const popupShown = useRef(false)
  const visitCount = useRef(1)

  const isExcluded = EXCLUDED_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  useEffect(() => {
    visitCount.current = incrementVisitIfNewSession()
    pageEnteredAt.current = Date.now()
    popupShown.current = false

    if (pathname) {
      recordPageVisit(pathname, document.title)
    }

    const visitorId = getOrCreateVisitorId()
    void sendServerTrackEvent({
      visitorId,
      event: "page_view",
      path: pathname || "/",
      inquiryId: getInquiryIdFromUrl() || undefined,
      segment: getVisitorSegment(loadActivity(), visitCount.current),
      funnel: getInquiryIdFromUrl() ? "post_submit" : "organic",
    })
  }, [pathname])

  useEffect(() => {
    if (isExcluded) return

    const tick = window.setInterval(() => {
      addDwellTime(DWELL_TICK_MS)
    }, DWELL_TICK_MS)

    return () => {
      window.clearInterval(tick)
      const elapsed = Date.now() - pageEnteredAt.current
      if (elapsed > 0) addDwellTime(elapsed % DWELL_TICK_MS)
    }
  }, [isExcluded, pathname])

  const tryShowPopup = useCallback(() => {
    if (isExcluded || popupShown.current) return

    const activity = loadActivity()
    const visits = visitCount.current
    const segment = getVisitorSegment(activity, visits)
    const dwellOnPage = Date.now() - pageEnteredAt.current
    const scrollDepth = getPageScrollDepth()
    const articleEl = document.querySelector("article")
    const insightSlug = pathname?.startsWith("/insights/") ? pathname.split("/")[2] : undefined

    if (insightSlug && articleEl) {
      updateArticleProgress(insightSlug, document.title, getArticleScrollDepth(articleEl))
    }

    const visitorId = getOrCreateVisitorId()

    if (
      !isContactPopupDismissed() &&
      shouldOfferContactFunnel(activity, visits, scrollDepth, insightSlug, dwellOnPage)
    ) {
      popupShown.current = true
      markContactPopupShown(activity)
      setContactOpen(true)
      void sendServerTrackEvent({
        visitorId,
        event: "funnel_popup_shown",
        funnel: "contact",
        segment,
        path: pathname || "/",
        slug: insightSlug,
        meta: { visitCount: visits, dwellMs: activity.totalDwellMs },
      })
      return
    }

    if (
      !isKakaoPopupDismissed() &&
      shouldOfferKakaoFunnel(activity, visits, dwellOnPage, scrollDepth)
    ) {
      popupShown.current = true
      markKakaoPopupShown(activity)
      setKakaoOpen(true)
      void sendServerTrackEvent({
        visitorId,
        event: "funnel_popup_shown",
        funnel: "kakao",
        segment,
        path: pathname || "/",
        meta: { visitCount: visits, dwellOnPageMs: dwellOnPage },
      })
    }
  }, [isExcluded, pathname])

  useEffect(() => {
    if (isExcluded) return

    const onScroll = () => tryShowPopup()
    const timer = window.setTimeout(() => tryShowPopup(), 22_000)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [isExcluded, tryShowPopup])

  const handleKakaoDismiss = useCallback(() => {
    dismissKakaoPopup()
    setKakaoOpen(false)
    void sendServerTrackEvent({
      visitorId: getOrCreateVisitorId(),
      event: "funnel_popup_dismiss",
      funnel: "kakao",
      path: pathname || "/",
    })
  }, [pathname])

  const handleContactDismiss = useCallback(() => {
    dismissContactPopup()
    setContactOpen(false)
    void sendServerTrackEvent({
      visitorId: getOrCreateVisitorId(),
      event: "funnel_popup_dismiss",
      funnel: "contact",
      path: pathname || "/",
    })
  }, [pathname])

  return (
    <>
      <KakaoConsultPopup
        open={kakaoOpen}
        onOpenChange={setKakaoOpen}
        onDismiss={handleKakaoDismiss}
        onContinue={() => setKakaoOpen(false)}
        onKakaoClick={() => {
          void sendServerTrackEvent({
            visitorId: getOrCreateVisitorId(),
            event: "funnel_kakao_click",
            funnel: "kakao",
            path: pathname || "/",
          })
        }}
      />
      <ContactFunnelPopup
        open={contactOpen}
        onOpenChange={setContactOpen}
        onDismiss={handleContactDismiss}
        onContinue={() => setContactOpen(false)}
        onCtaClick={() => {
          void sendServerTrackEvent({
            visitorId: getOrCreateVisitorId(),
            event: "funnel_contact_click",
            funnel: "contact",
            path: pathname || "/",
          })
        }}
      />
    </>
  )
}

function getPageScrollDepth() {
  const doc = document.documentElement
  const scrollTop = window.scrollY
  const viewport = window.innerHeight
  const height = Math.max(doc.scrollHeight - viewport, 1)
  return Math.min(1, Math.max(0, scrollTop / height))
}

function getArticleScrollDepth(articleEl: HTMLElement) {
  const rect = articleEl.getBoundingClientRect()
  const articleTop = rect.top + window.scrollY
  const articleHeight = Math.max(articleEl.offsetHeight, 1)
  const viewportBottom = window.scrollY + window.innerHeight
  const readPx = viewportBottom - articleTop
  return Math.min(1, Math.max(0, readPx / articleHeight))
}
