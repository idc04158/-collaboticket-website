import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { appendActivity } from "@/lib/crm-activity"
import {
  COOKIE_NAME,
  crmSessionCookieOptions,
  signCrmSessionToken,
  verifyAdminPassword,
  verifyCrmSessionToken,
} from "@/lib/crm-auth"

export const runtime = "nodejs"

export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value
  const session = await verifyCrmSessionToken(token)
  return NextResponse.json({ ok: Boolean(session), role: session?.role })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const password = body && typeof body.password === "string" ? body.password : ""

  const ok = await verifyAdminPassword(password)
  if (!ok) {
    await appendActivity({ actor: "unknown", action: "crm_login_failed" }).catch(() => {})
    return NextResponse.json({ ok: false, message: "비밀번호가 올바르지 않습니다." }, { status: 401 })
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
