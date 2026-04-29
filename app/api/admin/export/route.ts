import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

import { COOKIE_NAME, verifyCrmSessionToken } from "@/lib/crm-auth"
import { readInquiries } from "@/lib/inquiries"

export const runtime = "nodejs"

export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value
  const session = await verifyCrmSessionToken(token)
  if (!session) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 })
  }

  const inquiries = await readInquiries()
  const rows = inquiries.map((i) => ({
    id: i.id,
    createdAt: i.createdAt,
    company: i.company,
    name: i.name,
    email: i.email,
    phone: i.phone,
    status: i.status,
    priority: i.priority,
    priorityManual: i.priorityManual ? "yes" : "no",
    category: i.category,
    services: i.services.join("; "),
    goal: i.goal,
    memo: i.memo || "",
    lastEmailAt: i.lastEmailAt || "",
    nextFollowUpAt: i.nextFollowUpAt || "",
    emailHistory: i.emailLogs
      .map((l) => `[${l.sentAt}] ${l.subject} (${l.channel}): ${l.summary}`)
      .join("\n"),
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(wb, ws, "customers")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="collaboticket-crm-export.xlsx"',
    },
  })
}
