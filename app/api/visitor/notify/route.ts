import { NextResponse } from "next/server"

import { notifyDiscordVisitor } from "@/lib/discord"

type NotifyBody = {
  visitorId?: string
  path?: string
  title?: string
  referrer?: string
}

export async function POST(request: Request) {
  if (!process.env.DISCORD_WEBHOOK_VISITORS) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  let body: NotifyBody
  try {
    body = (await request.json()) as NotifyBody
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 })
  }

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
