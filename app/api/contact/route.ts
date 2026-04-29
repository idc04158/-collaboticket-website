import { NextResponse } from "next/server"

import { calendarBookingUrl, formatInquiryMessage, kakaoChannelUrl, saveInquiry, type InquiryInput } from "@/lib/inquiries"

export const runtime = "nodejs"

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
}

function validateInquiry(body: Record<string, unknown>): InquiryInput | null {
  const input: InquiryInput = {
    name: asString(body.name),
    company: asString(body.company),
    email: asString(body.email),
    phone: asString(body.phone),
    category: asString(body.category),
    services: asStringArray(body.services),
    salesStatus: asString(body.salesStatus),
    monthlyRevenue: asString(body.monthlyRevenue),
    budget: asString(body.budget),
    startTiming: asString(body.startTiming),
    channels: asString(body.channels),
    goal: asString(body.goal),
    detail: asString(body.detail),
    source: asString(body.source) || "homepage",
  }

  const required = [
    input.name,
    input.company,
    input.email,
    input.phone,
    input.category,
    input.salesStatus,
    input.goal,
  ]

  if (required.some((item) => !item) || input.services.length === 0) {
    return null
  }

  return input
}

async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
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

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, message: "잘못된 요청입니다." }, { status: 400 })
  }

  if (asString((body as Record<string, unknown>).website)) {
    return NextResponse.json({ ok: true, calendarUrl: calendarBookingUrl, kakaoUrl: kakaoChannelUrl })
  }

  const inquiryInput = validateInquiry(body as Record<string, unknown>)
  if (!inquiryInput) {
    return NextResponse.json({ ok: false, message: "필수 항목을 확인해주세요." }, { status: 400 })
  }

  const inquiry = await saveInquiry(inquiryInput)
  const inquiryMessage = formatInquiryMessage(inquiryInput)
  const internalEmail = process.env.CONTACT_INTERNAL_EMAIL

  await Promise.allSettled([
    internalEmail
      ? sendEmail({
          to: internalEmail,
          subject: `[CollaboTicket 문의] ${inquiryInput.company} / ${inquiryInput.name}`,
          text: `${inquiryMessage}\n\nCRM ID: ${inquiry.id}`,
        })
      : Promise.resolve(false),
    sendEmail({
      to: inquiryInput.email,
      subject: "CollaboTicket 상담 신청이 접수되었습니다.",
      text: [
        `${inquiryInput.name}님, 상담 신청이 접수되었습니다.`,
        "",
        "문의 내용을 확인한 뒤 연락드리겠습니다.",
        "먼저 편한 상담 시간을 예약하고 싶으시면 아래 링크에서 일정을 선택해주세요.",
        "",
        calendarBookingUrl,
        "",
        "가볍게 카카오톡으로 상담하고 싶으시면 아래 채널로 문의해주세요.",
        kakaoChannelUrl,
        "",
        "접수 내용",
        inquiryMessage,
      ].join("\n"),
    }),
  ])

  return NextResponse.json({ ok: true, id: inquiry.id, calendarUrl: calendarBookingUrl, kakaoUrl: kakaoChannelUrl })
}
