import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { searchCoverImages } from "@/lib/admin-insight-images"
import { COOKIE_NAME, verifyCrmSessionToken } from "@/lib/crm-auth"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const token = cookies().get(COOKIE_NAME)?.value
  const session = await verifyCrmSessionToken(token)
  if (!session) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim() || ""
  if (!q) {
    return NextResponse.json({ ok: false, message: "검색 키워드를 입력해주세요." }, { status: 400 })
  }

  const images = await searchCoverImages(q, 8)
  return NextResponse.json({
    ok: true,
    images,
    provider: process.env.UNSPLASH_ACCESS_KEY ? "unsplash" : "pool",
  })
}
