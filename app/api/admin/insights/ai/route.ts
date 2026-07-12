import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { reviseInsightWithAi } from "@/lib/admin-insight-ai"
import { COOKIE_NAME, verifyCrmSessionToken } from "@/lib/crm-auth"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  const token = cookies().get(COOKIE_NAME)?.value
  const session = await verifyCrmSessionToken(token)
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
  const instruction = typeof payload.instruction === "string" ? payload.instruction.trim() : ""
  if (!instruction) {
    return NextResponse.json({ ok: false, message: "요청 내용을 입력해주세요." }, { status: 400 })
  }

  const historyRaw = Array.isArray(payload.history) ? payload.history : []
  const history = historyRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const row = item as Record<string, unknown>
      const role = row.role === "assistant" ? "assistant" : row.role === "user" ? "user" : null
      const content = typeof row.content === "string" ? row.content : ""
      if (!role || !content) return null
      return { role, content }
    })
    .filter((item): item is { role: "user" | "assistant"; content: string } => Boolean(item))
    .slice(-8)

  const result = await reviseInsightWithAi({
    title: typeof payload.title === "string" ? payload.title : "",
    description: typeof payload.description === "string" ? payload.description : "",
    content: typeof payload.content === "string" ? payload.content : "",
    instruction,
    history,
  })

  if (!result) {
    return NextResponse.json({ ok: false, message: "AI 응답 생성에 실패했습니다." }, { status: 502 })
  }

  return NextResponse.json({ ok: true, ...result })
}
