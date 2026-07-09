import fs from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

const DATA_DIR = path.join(process.cwd(), ".data")
const EVENTS_FILE = path.join(DATA_DIR, "visitor-events.jsonl")

type TrackBody = {
  visitorId?: string
  event?: string
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

  const visitorId = body.visitorId?.slice(0, 64) || "anonymous"
  const event = body.event?.slice(0, 64) || "unknown"

  const record = {
    at: new Date().toISOString(),
    visitorId,
    ip: clientIp(request),
    event,
    slug: body.slug?.slice(0, 120),
    title: body.title?.slice(0, 200),
    scrollPct: body.scrollPct,
    path: body.path?.slice(0, 200),
    userAgent: request.headers.get("user-agent")?.slice(0, 200),
    meta: body.meta,
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.appendFile(EVENTS_FILE, `${JSON.stringify(record)}\n`, "utf8")
  } catch {
    return NextResponse.json({ ok: false, error: "storage failed" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
