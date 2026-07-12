import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { learnFromAcceptedEdit } from "@/lib/insight-edit-learning"
import { loadLearnedRulesStore } from "@/lib/insight-learned-rules.mjs"
import { COOKIE_NAME, verifyCrmSessionToken } from "@/lib/crm-auth"

export const runtime = "nodejs"
export const maxDuration = 60

async function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value
  return verifyCrmSessionToken(token)
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 })
  }

  const store = await loadLearnedRulesStore()
  const active = store.rules.filter((r) => r.status === "active" || r.status === "verified")
  return NextResponse.json({
    ok: true,
    updatedAt: store.updatedAt,
    rules: active.slice(0, 40),
    total: active.length,
    ephemeral: Boolean(process.env.VERCEL) && !process.env.EDITORIAL_LEARNING_PATH,
  })
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { ok: false, message: "OPENAI_API_KEY가 설정되지 않았습니다." },
      { status: 503 },
    )
  }

  const body = await request.json().catch(() => null)
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {}
  const slug = typeof payload.slug === "string" ? payload.slug.trim() : ""
  const instruction = typeof payload.instruction === "string" ? payload.instruction.trim() : ""
  const before = typeof payload.before === "string" ? payload.before : ""
  const after = typeof payload.after === "string" ? payload.after : ""

  if (!slug || !before || !after) {
    return NextResponse.json(
      { ok: false, message: "slug / before / after가 필요합니다." },
      { status: 400 },
    )
  }

  const chatRaw = Array.isArray(payload.chat) ? payload.chat : []
  const chat = chatRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const row = item as Record<string, unknown>
      const role = typeof row.role === "string" ? row.role : ""
      const content = typeof row.content === "string" ? row.content : ""
      if (!role || !content) return null
      return { role, content }
    })
    .filter((item): item is { role: string; content: string } => Boolean(item))
    .slice(-12)

  const result = await learnFromAcceptedEdit({
    slug,
    title: typeof payload.title === "string" ? payload.title : "",
    instruction: instruction || "(대화형 수정 적용)",
    summary: typeof payload.summary === "string" ? payload.summary : "",
    before,
    after,
    chat,
  })

  return NextResponse.json({ ok: true, ...result })
}
