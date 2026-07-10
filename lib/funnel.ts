import { countArticlesAtThreshold, type VisitorActivity } from "@/lib/visitor-tracking"

export type VisitorSegment = "casual" | "engaged"

export const MIN_VISITS_FOR_CONTACT = 3
export const MIN_DWELL_MS_FOR_CONTACT = 90_000
export const KAKAO_POPUP_DELAY_MS = 22_000
export const KAKAO_POPUP_SCROLL_RATIO = 0.28

export function getVisitorSegment(activity: VisitorActivity, visitCount: number): VisitorSegment {
  const dwell = activity.totalDwellMs ?? 0
  const articlesRead = countArticlesAtThreshold(activity)

  if (visitCount >= MIN_VISITS_FOR_CONTACT && dwell >= MIN_DWELL_MS_FOR_CONTACT) {
    return "engaged"
  }

  if (articlesRead >= 2 && dwell >= 60_000 && visitCount >= 2) {
    return "engaged"
  }

  return "casual"
}

export function shouldOfferContactFunnel(
  activity: VisitorActivity,
  visitCount: number,
  scrollDepth = 0,
  currentSlug?: string,
  dwellOnPageMs = 0,
): boolean {
  if (getVisitorSegment(activity, visitCount) !== "engaged") return false

  if (currentSlug) {
    const current = activity.reads[currentSlug]
    if (scrollDepth >= 0.45 && current?.reachedThreshold) return true
  }

  if (visitCount >= MIN_VISITS_FOR_CONTACT && dwellOnPageMs >= 15_000 && scrollDepth >= 0.1) {
    return true
  }

  return false
}

export function shouldOfferKakaoFunnel(
  activity: VisitorActivity,
  visitCount: number,
  dwellOnPageMs: number,
  scrollDepth: number,
): boolean {
  if (getVisitorSegment(activity, visitCount) === "engaged") return false
  if (dwellOnPageMs < KAKAO_POPUP_DELAY_MS && scrollDepth < KAKAO_POPUP_SCROLL_RATIO) return false
  return true
}
