import { NextResponse } from "next/server"

import { appendIntelligenceEvent, type IntelligenceEvent } from "@/lib/intelligence-events"
import { clientIp, rateLimit, readJsonBody, sanitizeMeta } from "@/lib/public-request-guard"

type TrackBody = {
  visitorId?: string
  inquiryId?: string
  event?: string
  segment?: "casual" | "engaged"
  funnel?: "kakao" | "contact" | "post_submit" | "organic"
  slug?: string
  title?: string
  scrollPct?: number
  path?: string
  meta?: Record<string, unknown>
}

const BODY_LIMIT = 8_000
const RATE_LIMIT = 120
const RATE_WINDOW_MS = 10 * 60 * 1000

const ALLOWED_EVENTS = new Set([
  "page_view",
  "insight_page_view",
  "scroll",
  "read_threshold",
  "floating_kakao_click",
  "funnel_popup_shown",
  "funnel_popup_dismiss",
  "funnel_kakao_click",
  "funnel_contact_click",
  "contact_submit_success",
  "post_submit_recommendations_shown",
  "post_submit_kakao_click",
  "post_submit_article_click",
  "post_submit_article_read",
])

const SEGMENTS = new Set(["casual", "engaged"])
const FUNNELS = new Set(["kakao", "contact", "post_submit", "organic"])

export async function POST(request: Request) {
  if (!rateLimit(`visitor-track:${clientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ ok: false, error: "rate limited" }, { status: 429 })
  }

  const parsed = await readJsonBody(request, BODY_LIMIT)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: parsed.status })
  }

  const body = (parsed.body || {}) as TrackBody
  const event = body.event?.slice(0, 64) || ""
  if (!ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ ok: false, error: "unknown event" }, { status: 400 })
  }

  const scrollPct = typeof body.scrollPct === "number" && Number.isFinite(body.scrollPct)
    ? Math.min(100, Math.max(0, body.scrollPct))
    : undefined

  const record: IntelligenceEvent = {
    at: new Date().toISOString(),
    visitorId: body.visitorId?.slice(0, 64) || "anonymous",
    inquiryId: body.inquiryId?.slice(0, 64),
    event,
    segment: body.segment && SEGMENTS.has(body.segment) ? body.segment : undefined,
    funnel: body.funnel && FUNNELS.has(body.funnel) ? body.funnel : undefined,
    slug: body.slug?.slice(0, 120),
    title: body.title?.slice(0, 200),
    scrollPct,
    path: body.path?.slice(0, 200),
    ip: clientIp(request),
    userAgent: request.headers.get("user-agent")?.slice(0, 200),
    meta: sanitizeMeta(body.meta),
  }

  try {
    await appendIntelligenceEvent(record)
  } catch {
    return NextResponse.json({ ok: false, error: "storage failed" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
