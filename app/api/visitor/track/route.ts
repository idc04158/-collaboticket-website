import fs from "fs/promises"
import { NextResponse } from "next/server"

import { appendIntelligenceEvent, type IntelligenceEvent } from "@/lib/intelligence-events"

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

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown"
  return request.headers.get("x-real-ip") || "unknown"
}

export async function POST(request: Request) {
  let body: TrackBody
  try {
    body = (await request.json()) as TrackBody
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 })
  }

  const record: IntelligenceEvent = {
    at: new Date().toISOString(),
    visitorId: body.visitorId?.slice(0, 64) || "anonymous",
    inquiryId: body.inquiryId?.slice(0, 64),
    event: body.event?.slice(0, 64) || "unknown",
    segment: body.segment,
    funnel: body.funnel,
    slug: body.slug?.slice(0, 120),
    title: body.title?.slice(0, 200),
    scrollPct: body.scrollPct,
    path: body.path?.slice(0, 200),
    ip: clientIp(request),
    userAgent: request.headers.get("user-agent")?.slice(0, 200),
    meta: body.meta,
  }

  try {
    await appendIntelligenceEvent(record)
  } catch {
    return NextResponse.json({ ok: false, error: "storage failed" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
