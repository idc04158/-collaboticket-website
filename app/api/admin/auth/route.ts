import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { appendActivity } from "@/lib/crm-activity"
import {
  COOKIE_NAME,
  crmSessionCookieOptions,
  signCrmSessionToken,
  verifyAdminCredentials,
  verifyAdminPassword,
  verifyCrmSessionToken,
} from "@/lib/crm-auth"
import { clientIp, rateLimit, readJsonBody } from "@/lib/public-request-guard"

export const runtime = "nodejs"

export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value
  const session = await verifyCrmSessionToken(token)
  return NextResponse.json({ ok: Boolean(session), role: session?.role })
}

const LOGIN_BODY_LIMIT = 2_000
const LOGIN_RATE_LIMIT = 10
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000

export async function POST(request: Request) {
  if (!rateLimit(`admin-login:${clientIp(request)}`, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS)) {
    return NextResponse.json(
      { ok: false, message: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 },
    )
  }

  const parsed = await readJsonBody(request, LOGIN_BODY_LIMIT)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, message: "잘못된 요청입니다." }, { status: parsed.status })
  }

  const body = parsed.body && typeof parsed.body === "object" ? (parsed.body as Record<string, unknown>) : null
  const password = body && typeof body.password === "string" ? body.password : ""
  const username =
    body && typeof body.username === "string"
      ? body.username
      : body && typeof body.id === "string"
        ? body.id
        : "admin"

  const hasExplicitUser =
    Boolean(body && typeof body.username === "string" && body.username.trim()) ||
    Boolean(body && typeof body.id === "string" && body.id.trim())

  const ok = hasExplicitUser
    ? await verifyAdminCredentials(username, password)
    : await verifyAdminPassword(password)

  if (!ok) {
    await appendActivity({ actor: "unknown", action: "crm_login_failed" }).catch(() => {})
    return NextResponse.json({ ok: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 })
  }

  const token = await signCrmSessionToken()
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookies().set(COOKIE_NAME, token, crmSessionCookieOptions(expires))
  await appendActivity({ actor: "admin", action: "crm_login" }).catch(() => {})

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  cookies().delete(COOKIE_NAME)
  await appendActivity({ actor: "admin", action: "crm_logout" }).catch(() => {})
  return NextResponse.json({ ok: true })
}
