import { NextResponse } from "next/server"

import { calendarBookingUrl, kakaoChannelUrl } from "@/lib/contact-links"
import { notifyDiscordContact } from "@/lib/discord"
import { recommendInsightSlugsForInquiry } from "@/lib/inquiry-recommendations"
import { appendIntelligenceEvent } from "@/lib/intelligence-events"
import { getInsightBySlug } from "@/lib/insights"
import {
  formatInquiryMessage,
  saveInquiry,
  type InquiryInput,
  type SelfDiagnosisInput,
} from "@/lib/inquiries"

export const runtime = "nodejs"

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
}

function asSelfDiagnosis(value: unknown): SelfDiagnosisInput | undefined {
  if (!value || typeof value !== "object") return undefined

  const body = value as Record<string, unknown>
  const enteredJapan =
    typeof body.enteredJapan === "boolean" ? body.enteredJapan : body.enteredJapan === null ? null : undefined

  const result: SelfDiagnosisInput = {
    enteredJapan,
    concern: asString(body.concern) || undefined,
    preStage: asString(body.preStage) || undefined,
    preInterest: asString(body.preInterest) || undefined,
    completedAt: asString(body.completedAt) || undefined,
  }

  if (
    result.enteredJapan === undefined &&
    !result.concern &&
    !result.preStage &&
    !result.preInterest &&
    !result.completedAt
  ) {
    return undefined
  }

  return result
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
    selfDiagnosis: asSelfDiagnosis(body.selfDiagnosis),
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

function formatSelfDiagnosisSummary(selfDiagnosis?: SelfDiagnosisInput) {
  if (!selfDiagnosis) return ""

  const lines: string[] = []
  if (selfDiagnosis.enteredJapan === true) lines.push("일본 진출: 진행 중")
  if (selfDiagnosis.enteredJapan === false) lines.push("일본 진출: 준비/검토 단계")
  if (selfDiagnosis.concern) lines.push(`주요 고민: ${selfDiagnosis.concern}`)
  if (selfDiagnosis.preStage) lines.push(`현재 단계: ${selfDiagnosis.preStage}`)
  if (selfDiagnosis.preInterest) lines.push(`관심 영역: ${selfDiagnosis.preInterest}`)

  return lines.join("\n")
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
  try {
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

    const inquiryId = crypto.randomUUID()
    let inquiry = {
      id: inquiryId,
      createdAt: new Date().toISOString(),
      ...inquiryInput,
    }

    try {
      inquiry = await saveInquiry(inquiryInput)
    } catch (error) {
      console.error("[contact] saveInquiry failed:", error)
    }

    const inquiryMessage = formatInquiryMessage(inquiryInput)
    const selfDiagnosisSummary = formatSelfDiagnosisSummary(inquiryInput.selfDiagnosis)
    const internalEmail = process.env.CONTACT_INTERNAL_EMAIL

    const recommendedSlugs = recommendInsightSlugsForInquiry(inquiryInput)
    const recommendedArticles = recommendedSlugs
      .map((slug) => {
        const insight = getInsightBySlug(slug)
        if (!insight) return null
        return { slug, title: insight.meta.title }
      })
      .filter((item): item is { slug: string; title: string } => Boolean(item))

    await Promise.allSettled([
      notifyDiscordContact({
        id: inquiry.id,
        message: inquiryMessage,
        selfDiagnosisSummary,
        source: inquiryInput.source,
      }),
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

    try {
      await appendIntelligenceEvent({
        at: new Date().toISOString(),
        visitorId: "server",
        inquiryId: inquiry.id,
        event: "contact_submit",
        funnel: inquiryInput.selfDiagnosis ? "contact" : "organic",
        path: "/contact",
        meta: {
          source: inquiryInput.source,
          goal: inquiryInput.goal,
          services: inquiryInput.services,
          recommendedSlugs,
          selfDiagnosis: inquiryInput.selfDiagnosis,
        },
      })
    } catch (error) {
      console.error("[contact] intelligence log failed:", error)
    }

    return NextResponse.json({
      ok: true,
      id: inquiry.id,
      calendarUrl: calendarBookingUrl,
      kakaoUrl: kakaoChannelUrl,
      recommendedArticles,
    })
  } catch (error) {
    console.error("[contact] unexpected error:", error)
    return NextResponse.json({ ok: false, message: "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 })
  }
}
