/** Anonymous visitor insight read tracking (cookie + localStorage, no login). */

export const VISITOR_COOKIE = "ct_vid"
export const ACTIVITY_COOKIE = "ct_activity"
export const VISIT_COUNT_COOKIE = "ct_visit_count"
export const SESSION_FLAG = "ct_session_started"
export const POPUP_DISMISS_COOKIE = "ct_popup_dismiss"
export const KAKAO_POPUP_DISMISS_COOKIE = "ct_kakao_popup_dismiss"
export const CONTACT_POPUP_DISMISS_COOKIE = "ct_contact_popup_dismiss"
export const INQUIRY_CONTEXT_KEY = "ct_inquiry_context"
export const READ_THRESHOLD = 0.5
export const POPUP_DISMISS_DAYS = 7
export const COOKIE_MAX_AGE_DAYS = 400

export type ArticleReadRecord = {
  slug: string
  title: string
  firstSeen: number
  lastSeen: number
  maxScroll: number
  reachedThreshold: boolean
  visits: number
}

export type PageVisitRecord = {
  path: string
  title: string
  at: number
}

export type VisitorActivity = {
  v: 2
  reads: Record<string, ArticleReadRecord>
  pageVisits: PageVisitRecord[]
  popupShownAt?: number
  kakaoPopupShownAt?: number
  contactPopupShownAt?: number
  totalDwellMs?: number
}

export type InquiryContext = {
  id: string
  services: string[]
  goal: string
  category: string
  recommendedSlugs: string[]
  submittedAt: string
}

export type RecommendedInsight = {
  slug: string
  title: string
}

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

function setCookie(name: string, value: string, days: number) {
  if (!isBrowser()) return
  const maxAge = days * 86400
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (!isBrowser()) return null
  const prefix = `${name}=`
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim()
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length))
    }
  }
  return null
}

export function getOrCreateVisitorId(): string {
  if (!isBrowser()) return "ssr"

  let id = getCookie(VISITOR_COOKIE)
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    setCookie(VISITOR_COOKIE, id, COOKIE_MAX_AGE_DAYS)
  }
  return id
}

export function getVisitCount(): number {
  const raw = getCookie(VISIT_COUNT_COOKIE)
  const count = Number(raw)
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 1
}

export function incrementVisitIfNewSession(): number {
  if (!isBrowser()) return 1

  if (sessionStorage.getItem(SESSION_FLAG)) {
    return getVisitCount()
  }

  sessionStorage.setItem(SESSION_FLAG, "1")
  const current = Number(getCookie(VISIT_COUNT_COOKIE))
  const next = Number.isFinite(current) && current > 0 ? current + 1 : 1
  setCookie(VISIT_COUNT_COOKIE, String(next), COOKIE_MAX_AGE_DAYS)
  return next
}

function emptyActivity(): VisitorActivity {
  return { v: 2, reads: {}, pageVisits: [], totalDwellMs: 0 }
}

function migrateActivity(parsed: Partial<VisitorActivity> & { v?: number }): VisitorActivity {
  return {
    v: 2,
    reads: parsed.reads || {},
    pageVisits: Array.isArray(parsed.pageVisits) ? parsed.pageVisits.slice(-80) : [],
    popupShownAt: parsed.popupShownAt,
    kakaoPopupShownAt: parsed.kakaoPopupShownAt,
    contactPopupShownAt: parsed.contactPopupShownAt,
    totalDwellMs: parsed.totalDwellMs ?? 0,
  }
}

export function loadActivity(): VisitorActivity {
  if (!isBrowser()) return emptyActivity()

  try {
    const raw = getCookie(ACTIVITY_COOKIE) || localStorage.getItem(ACTIVITY_COOKIE)
    if (!raw) return emptyActivity()
    const parsed = JSON.parse(raw) as VisitorActivity
    if (!parsed?.reads) return emptyActivity()
    return migrateActivity(parsed)
  } catch {
    return emptyActivity()
  }
}

function persistActivity(activity: VisitorActivity) {
  if (!isBrowser()) return
  const trimmed: VisitorActivity = {
    ...activity,
    pageVisits: activity.pageVisits.slice(-80),
  }
  const json = JSON.stringify(trimmed)
  localStorage.setItem(ACTIVITY_COOKIE, json)
  if (json.length < 3500) {
    setCookie(ACTIVITY_COOKIE, json, COOKIE_MAX_AGE_DAYS)
  } else {
    const compact: VisitorActivity = {
      v: 2,
      reads: trimmed.reads,
      pageVisits: trimmed.pageVisits.slice(-30),
      popupShownAt: trimmed.popupShownAt,
      kakaoPopupShownAt: trimmed.kakaoPopupShownAt,
      contactPopupShownAt: trimmed.contactPopupShownAt,
      totalDwellMs: trimmed.totalDwellMs,
    }
    const compactJson = JSON.stringify(compact)
    setCookie(ACTIVITY_COOKIE, compactJson, COOKIE_MAX_AGE_DAYS)
    localStorage.setItem(ACTIVITY_COOKIE, json)
  }
}

export function recordPageVisit(path: string, title: string) {
  const activity = loadActivity()
  activity.pageVisits.push({ path, title, at: Date.now() })
  persistActivity(activity)
}

export function addDwellTime(ms: number) {
  if (ms <= 0) return
  const activity = loadActivity()
  activity.totalDwellMs = (activity.totalDwellMs ?? 0) + ms
  persistActivity(activity)
}

export function updateArticleProgress(slug: string, title: string, scrollDepth: number): VisitorActivity {
  const activity = loadActivity()
  const now = Date.now()
  const prev = activity.reads[slug]
  const maxScroll = Math.max(prev?.maxScroll ?? 0, scrollDepth)
  const reachedThreshold = maxScroll >= READ_THRESHOLD

  activity.reads[slug] = {
    slug,
    title,
    firstSeen: prev?.firstSeen ?? now,
    lastSeen: now,
    maxScroll,
    reachedThreshold: (prev?.reachedThreshold ?? false) || reachedThreshold,
    visits: (prev?.visits ?? 0) + (prev ? 0 : 1),
  }

  persistActivity(activity)
  return activity
}

export function countArticlesAtThreshold(activity: VisitorActivity): number {
  return Object.values(activity.reads).filter((r) => r.reachedThreshold).length
}

function isDismissed(cookieName: string) {
  const until = getCookie(cookieName)
  if (!until) return false
  const ts = Number(until)
  return Number.isFinite(ts) && ts > Date.now()
}

export function isPopupDismissed() {
  return isDismissed(POPUP_DISMISS_COOKIE)
}

export function isKakaoPopupDismissed() {
  return isDismissed(KAKAO_POPUP_DISMISS_COOKIE)
}

export function isContactPopupDismissed() {
  return isDismissed(CONTACT_POPUP_DISMISS_COOKIE)
}

export function dismissPopup(days = POPUP_DISMISS_DAYS) {
  setCookie(POPUP_DISMISS_COOKIE, String(Date.now() + days * 86400000), days)
}

export function dismissKakaoPopup(days = POPUP_DISMISS_DAYS) {
  setCookie(KAKAO_POPUP_DISMISS_COOKIE, String(Date.now() + days * 86400000), days)
}

export function dismissContactPopup(days = POPUP_DISMISS_DAYS) {
  setCookie(CONTACT_POPUP_DISMISS_COOKIE, String(Date.now() + days * 86400000), days)
}

export function markKakaoPopupShown(activity: VisitorActivity) {
  activity.kakaoPopupShownAt = Date.now()
  activity.popupShownAt = Date.now()
  persistActivity(activity)
}

export function markContactPopupShown(activity: VisitorActivity) {
  activity.contactPopupShownAt = Date.now()
  activity.popupShownAt = Date.now()
  persistActivity(activity)
}

export function saveInquiryContext(context: InquiryContext) {
  if (!isBrowser()) return
  try {
    sessionStorage.setItem(INQUIRY_CONTEXT_KEY, JSON.stringify(context))
    localStorage.setItem(INQUIRY_CONTEXT_KEY, JSON.stringify(context))
  } catch {
    /* ignore */
  }
}

export function loadInquiryContext(): InquiryContext | null {
  if (!isBrowser()) return null
  try {
    const raw = sessionStorage.getItem(INQUIRY_CONTEXT_KEY) || localStorage.getItem(INQUIRY_CONTEXT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as InquiryContext
  } catch {
    return null
  }
}

export function getInquiryIdFromUrl(): string | null {
  if (!isBrowser()) return null
  const params = new URLSearchParams(window.location.search)
  return params.get("inquiryId")?.slice(0, 64) || null
}

export async function sendServerTrackEvent(payload: {
  visitorId: string
  event: string
  inquiryId?: string
  segment?: "casual" | "engaged"
  funnel?: "kakao" | "contact" | "post_submit" | "organic"
  slug?: string
  title?: string
  scrollPct?: number
  path?: string
  meta?: Record<string, unknown>
}) {
  try {
    await fetch("/api/visitor/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    /* non-blocking */
  }
}
