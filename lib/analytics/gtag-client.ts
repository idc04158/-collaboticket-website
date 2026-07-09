/** GA4 client-side event helpers (requires GoogleAnalytics script in layout). */

export type GtagEventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function trackGtagEvent(eventName: string, params?: GtagEventParams) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", eventName, params)
}

export function trackInsightPageView(slug: string, title: string) {
  trackGtagEvent("insight_page_view", {
    page_path: `/insights/${slug}`,
    insight_slug: slug,
    insight_title: title,
  })
}

export function trackInsightScroll(slug: string, percent: number) {
  trackGtagEvent("insight_scroll", {
    insight_slug: slug,
    scroll_percent: percent,
  })
}

export function trackInsightReadThreshold(slug: string, articleCount: number) {
  trackGtagEvent("insight_read_threshold", {
    insight_slug: slug,
    articles_at_threshold: articleCount,
  })
}

export function trackConversionPopup(action: "shown" | "cta_click" | "dismiss" | "continue", slug?: string) {
  trackGtagEvent("conversion_popup", {
    popup_action: action,
    insight_slug: slug,
  })
}
