/** Anonymous visitor insight read tracking (cookie + localStorage, no login). */

export const VISITOR_COOKIE = "ct_vid"
export const ACTIVITY_COOKIE = "ct_activity"
export const POPUP_DISMISS_COOKIE = "ct_popup_dismiss"
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
  v: 1
  reads: Record<string, ArticleReadRecord>
  pageVisits: PageVisitRecord[]
  popupShownAt?: number
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

function emptyActivity(): VisitorActivity {
  return { v: 1, reads: {}, pageVisits: [] }
}

export function loadActivity(): VisitorActivity {
  if (!isBrowser()) return emptyActivity()

  try {
    const raw = getCookie(ACTIVITY_COOKIE) || localStorage.getItem(ACTIVITY_COOKIE)
    if (!raw) return emptyActivity()
    const parsed = JSON.parse(raw) as VisitorActivity
    if (parsed?.v !== 1 || !parsed.reads) return emptyActivity()
    return {
      v: 1,
      reads: parsed.reads,
      pageVisits: Array.isArray(parsed.pageVisits) ? parsed.pageVisits.slice(-80) : [],
      popupShownAt: parsed.popupShownAt,
    }
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
      v: 1,
      reads: trimmed.reads,
      pageVisits: trimmed.pageVisits.slice(-30),
      popupShownAt: trimmed.popupShownAt,
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
    visits: prev?.visits ?? 1,
  }

  persistActivity(activity)
  return activity
}

export function countArticlesAtThreshold(activity: VisitorActivity): number {
  return Object.values(activity.reads).filter((r) => r.reachedThreshold).length
}

export function isPopupDismissed(): boolean {
  const until = getCookie(POPUP_DISMISS_COOKIE)
  if (!until) return false
  const ts = Number(until)
  return Number.isFinite(ts) && ts > Date.now()
}

export function dismissPopup(days = POPUP_DISMISS_DAYS) {
  setCookie(POPUP_DISMISS_COOKIE, String(Date.now() + days * 86400000), days)
}

export function markPopupShown(activity: VisitorActivity) {
  activity.popupShownAt = Date.now()
  persistActivity(activity)
}

export function shouldShowConversionPopup(
  activity: VisitorActivity,
  currentSlug: string,
  currentScroll: number,
): boolean {
  if (isPopupDismissed()) return false
  if (currentScroll < READ_THRESHOLD) return false

  const atThreshold = Object.values(activity.reads).filter((r) => r.reachedThreshold)
  if (atThreshold.length < 2) return false

  const current = activity.reads[currentSlug]
  if (!current?.reachedThreshold) return false

  return true
}

export async function sendServerTrackEvent(payload: {
  visitorId: string
  event: string
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
