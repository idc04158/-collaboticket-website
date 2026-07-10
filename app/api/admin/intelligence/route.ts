import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { COOKIE_NAME, verifyCrmSessionToken } from "@/lib/crm-auth"
import { readIntelligenceEvents, readIntelligenceEventsForInquiry } from "@/lib/intelligence-events"

export const runtime = "nodejs"

async function requireSession() {
  const token = cookies().get(COOKIE_NAME)?.value
  return verifyCrmSessionToken(token)
}

export async function GET(request: Request) {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const inquiryId = searchParams.get("inquiryId")?.slice(0, 64)
  const limit = Math.min(500, Math.max(1, Number(searchParams.get("limit")) || 200))

  const events = inquiryId
    ? await readIntelligenceEventsForInquiry(inquiryId, limit)
    : await readIntelligenceEvents(limit)

  return NextResponse.json({ ok: true, events })
}
