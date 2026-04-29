import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { generateEmailDraftWithOpenAI } from "@/lib/ai-email-draft"
import { appendActivity, readActivityLog } from "@/lib/crm-activity"
import { COOKIE_NAME, verifyCrmSessionToken } from "@/lib/crm-auth"
import { readCrmSettings, upsertEmailTemplate, deleteEmailTemplate, writeCrmSettings } from "@/lib/crm-settings"
import { extractFollowUpDateFromText } from "@/lib/follow-up-nlp"
import {
  appendEmailLog,
  bulkImportInquiries,
  readInquiries,
  seedDemoInquiries,
  updateInquiry,
  type Inquiry,
  type ImportCustomerRow,
} from "@/lib/inquiries"

export const runtime = "nodejs"

async function requireSession() {
  const token = cookies().get(COOKIE_NAME)?.value
  return verifyCrmSessionToken(token)
}

async function sendEmailResend({ to, subject, text }: { to: string; subject: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL || "CollaboTicket <onboarding@resend.dev>"

  if (!apiKey) return false

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  })

  return response.ok
}

function appendSignature(body: string, signature: string) {
  const s = signature.trim()
  if (!s) return body
  return `${body.replace(/\s+$/, "")}\n\n--\n${s}`
}

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json({ ok: false, message: "로그인이 필요합니다." }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {}
  const action = typeof payload.action === "string" ? payload.action : "list"

  if (action === "seed") {
    const inquiries = await seedDemoInquiries()
    await appendActivity({ actor: "admin", action: "crm_seed_demo" })
    return NextResponse.json({ ok: true, inquiries })
  }

  if (action === "get-settings") {
    const settings = await readCrmSettings()
    return NextResponse.json({ ok: true, settings })
  }

  if (action === "save-settings") {
    const current = await readCrmSettings()
    const emailSignature =
      typeof payload.emailSignature === "string" ? payload.emailSignature : current.emailSignature
    await writeCrmSettings({ ...current, emailSignature })
    await appendActivity({ actor: "admin", action: "crm_settings_saved" })
    return NextResponse.json({ ok: true, settings: await readCrmSettings() })
  }

  if (action === "save-template") {
    const name = typeof payload.name === "string" ? payload.name : ""
    const category = typeof payload.category === "string" ? payload.category : "first-contact"
    const subject = typeof payload.subject === "string" ? payload.subject : ""
    const tplBody = typeof payload.body === "string" ? payload.body : ""
    const id = typeof payload.id === "string" ? payload.id : undefined
    if (!name || !subject || !tplBody) {
      return NextResponse.json({ ok: false, message: "템플릿 이름, 제목, 본문이 필요합니다." }, { status: 400 })
    }
    const allowed = ["first-contact", "follow-up", "proposal", "reminder"]
    const cat = allowed.includes(category) ? (category as "first-contact" | "follow-up" | "proposal" | "reminder") : "first-contact"
    const entry = await upsertEmailTemplate({ id, name, category: cat, subject, body: tplBody })
    await appendActivity({ actor: "admin", action: "crm_template_saved", detail: name })
    return NextResponse.json({ ok: true, template: entry, settings: await readCrmSettings() })
  }

  if (action === "delete-template") {
    const id = typeof payload.id === "string" ? payload.id : ""
    if (!id) return NextResponse.json({ ok: false, message: "id가 필요합니다." }, { status: 400 })
    await deleteEmailTemplate(id)
    await appendActivity({ actor: "admin", action: "crm_template_deleted", detail: id })
    return NextResponse.json({ ok: true, settings: await readCrmSettings() })
  }

  if (action === "import-customers") {
    const rows = Array.isArray(payload.rows) ? (payload.rows as ImportCustomerRow[]) : []
    if (!rows.length) {
      return NextResponse.json({ ok: false, message: "가져올 행이 없습니다." }, { status: 400 })
    }
    const created = await bulkImportInquiries(rows)
    await appendActivity({ actor: "admin", action: "crm_import", detail: `${created.length}건` })
    return NextResponse.json({ ok: true, created: created.length, inquiries: await readInquiries() })
  }

  if (action === "ai-email-draft") {
    const id = typeof payload.id === "string" ? payload.id : ""
    const inquiries = await readInquiries()
    const target = inquiries.find((i) => i.id === id)
    if (!target) return NextResponse.json({ ok: false, message: "고객을 찾을 수 없습니다." }, { status: 404 })
    const prev =
      target.emailLogs?.slice(0, 3).map((l) => `${l.subject}\n${l.summary}`).join("\n---\n") || ""
    const draft = await generateEmailDraftWithOpenAI({
      inquiry: target,
      customerStatus: target.status,
      previousMessages: prev,
    })
    if (!draft) {
      return NextResponse.json(
        { ok: false, message: "OPENAI_API_KEY가 없거나 생성에 실패했습니다." },
        { status: 503 },
      )
    }
    return NextResponse.json({ ok: true, draft })
  }

  if (action === "activity-log") {
    const log = await readActivityLog()
    return NextResponse.json({ ok: true, log })
  }

  if (action === "update") {
    const id = typeof payload.id === "string" ? payload.id : ""
    const updates = payload.updates && typeof payload.updates === "object" ? (payload.updates as Partial<Inquiry>) : {}
    if (updates.priority !== undefined) {
      ;(updates as Inquiry).priorityManual = true
    }
    const inquiry = await updateInquiry(id, updates)
    if (!inquiry) {
      return NextResponse.json({ ok: false, message: "고객을 찾을 수 없습니다." }, { status: 404 })
    }
    await appendActivity({ actor: "admin", action: "crm_inquiry_update", detail: id })
    return NextResponse.json({ ok: true, inquiry, inquiries: await readInquiries() })
  }

  if (action === "send-email") {
    const id = typeof payload.id === "string" ? payload.id : ""
    const subject = typeof payload.subject === "string" ? payload.subject : ""
    const summary = typeof payload.summary === "string" ? payload.summary : ""
    const message = typeof payload.message === "string" ? payload.message : ""
    const channel =
      typeof payload.channel === "string" && ["gmail", "resend", "manual"].includes(payload.channel)
        ? (payload.channel as "gmail" | "resend" | "manual")
        : "manual"

    if (!subject || !summary || !message) {
      return NextResponse.json({ ok: false, message: "메일 제목, 요약, 본문을 입력해주세요." }, { status: 400 })
    }

    const settings = await readCrmSettings()
    const fullBody = appendSignature(message, settings.emailSignature)

    const inquiries = await readInquiries()
    const target = inquiries.find((inquiry) => inquiry.id === id)
    if (!target) {
      return NextResponse.json({ ok: false, message: "고객을 찾을 수 없습니다." }, { status: 404 })
    }

    const delivered = channel === "resend" ? await sendEmailResend({ to: target.email, subject, text: fullBody }) : true

    const followDate = extractFollowUpDateFromText(fullBody)
    const patch: Partial<Inquiry> = {}
    if (followDate) {
      patch.nextFollowUpAt = followDate
      patch.nextFollowUpSummary = "메일 본문 기준 후속 일정"
    }

    let inquiry = await appendEmailLog(id, {
      subject,
      summary,
      body: fullBody,
      status: delivered ? "sent" : "failed",
      channel,
    })

    if (inquiry && (patch.nextFollowUpAt || Object.keys(patch).length)) {
      inquiry = (await updateInquiry(id, patch)) || inquiry
    }

    if (!inquiry) {
      return NextResponse.json({ ok: false, message: "고객을 찾을 수 없습니다." }, { status: 404 })
    }

    await appendActivity({
      actor: "admin",
      action: "crm_email_sent",
      detail: `${id} · ${channel}`,
    })

    return NextResponse.json({
      ok: true,
      inquiry,
      inquiries: await readInquiries(),
      savedLog: true,
      followUpDetected: followDate || null,
    })
  }

  const inquiries = await readInquiries()
  return NextResponse.json({ ok: true, inquiries })
}
