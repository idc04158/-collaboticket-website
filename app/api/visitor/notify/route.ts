import { NextResponse } from "next/server"

import { notifyDiscordVisitor } from "@/lib/discord"
import { clientIp, rateLimit, readJsonBody } from "@/lib/public-request-guard"

type NotifyBody = {
  visitorId?: string
  path?: string
  title?: string
  referrer?: string
}

const BODY_LIMIT = 4_000
const RATE_LIMIT = 12
const RATE_WINDOW_MS = 10 * 60 * 1000

export async function POST(request: Request) {
  if (!rateLimit(`visitor-notify:${clientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ ok: false, error: "rate limited" }, { status: 429 })
  }

  const parsed = await readJsonBody(request, BODY_LIMIT)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: parsed.status })
  }

  if (!process.env.DISCORD_WEBHOOK_VISITORS) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const body = (parsed.body || {}) as NotifyBody
  const visitorId = body.visitorId?.slice(0, 64)
  const path = body.path?.slice(0, 200) || "/"

  if (!visitorId) {
    return NextResponse.json({ ok: false, error: "missing visitorId" }, { status: 400 })
  }

  const ok = await notifyDiscordVisitor({
    visitorId,
    path,
    title: body.title?.slice(0, 200),
    referrer: body.referrer?.slice(0, 500),
    userAgent: request.headers.get("user-agent")?.slice(0, 200),
  })

  if (!ok) {
    return NextResponse.json({ ok: false, error: "discord failed" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
