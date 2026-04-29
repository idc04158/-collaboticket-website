import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { appendActivity } from "@/lib/crm-activity"
import { COOKIE_NAME, verifyCrmSessionToken } from "@/lib/crm-auth"
import { getInsightForEdit, listInsightMetas, saveInsight } from "@/lib/insight-admin"

export const runtime = "nodejs"

async function requireSession() {
  const token = cookies().get(COOKIE_NAME)?.value
  return verifyCrmSessionToken(token)
}

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {}
  const action = typeof payload.action === "string" ? payload.action : "list"

  if (action === "list") {
    return NextResponse.json({ ok: true, insights: await listInsightMetas() })
  }

  if (action === "get") {
    const slug = typeof payload.slug === "string" ? payload.slug : ""
    if (!slug) return NextResponse.json({ ok: false, message: "slug가 필요합니다." }, { status: 400 })
    const item = await getInsightForEdit(slug)
    if (!item) return NextResponse.json({ ok: false, message: "글을 찾을 수 없습니다." }, { status: 404 })
    return NextResponse.json({ ok: true, insight: item })
  }

  if (action === "save") {
    const next = {
      slug: typeof payload.slug === "string" ? payload.slug : undefined,
      title: typeof payload.title === "string" ? payload.title : "",
      description: typeof payload.description === "string" ? payload.description : "",
      category: typeof payload.category === "string" ? payload.category : "Insight",
      tags: Array.isArray(payload.tags) ? (payload.tags as string[]) : [],
      date: typeof payload.date === "string" ? payload.date : "",
      image: typeof payload.image === "string" ? payload.image : "",
      content: typeof payload.content === "string" ? payload.content : "",
    }
    if (!next.title || !next.content) {
      return NextResponse.json({ ok: false, message: "제목과 본문은 필수입니다." }, { status: 400 })
    }
    const savedSlug = await saveInsight(next)
    await appendActivity({ actor: "admin", action: "insight_save", detail: savedSlug }).catch(() => {})
    return NextResponse.json({ ok: true, slug: savedSlug, insights: await listInsightMetas() })
  }

  return NextResponse.json({ ok: false, message: "지원하지 않는 action입니다." }, { status: 400 })
}
