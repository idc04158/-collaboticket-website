type DiscordEmbed = {
  title?: string
  description?: string
  color?: number
  fields?: { name: string; value: string; inline?: boolean }[]
  footer?: { text: string }
  timestamp?: string
}

type DiscordPayload = {
  content?: string
  embeds?: DiscordEmbed[]
}

const WEBHOOK_TIMEOUT_MS = 4_000

async function postDiscordWebhook(webhookUrl: string, payload: DiscordPayload) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

function truncate(value: string, max = 1000) {
  if (value.length <= max) return value
  return `${value.slice(0, max - 3)}...`
}

export async function notifyDiscordContact(payload: {
  id: string
  message: string
  selfDiagnosisSummary?: string
  source?: string
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_CONTACT
  if (!webhookUrl) return false

  const fields = [
    { name: "CRM ID", value: payload.id, inline: true },
    { name: "유입", value: payload.source || "homepage", inline: true },
  ]

  if (payload.selfDiagnosisSummary) {
    fields.push({
      name: "셀프 진단",
      value: truncate(payload.selfDiagnosisSummary, 900),
      inline: false,
    })
  }

  fields.push({
    name: "문의 내용",
    value: truncate(payload.message, 900),
    inline: false,
  })

  return postDiscordWebhook(webhookUrl, {
    embeds: [
      {
        title: "새 상담 신청",
        color: 0x00b140,
        fields,
        footer: { text: "CollaboTicket Contact" },
        timestamp: new Date().toISOString(),
      },
    ],
  })
}

export async function notifyDiscordVisitor(payload: {
  visitorId: string
  path: string
  title?: string
  referrer?: string
  userAgent?: string
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_VISITORS
  if (!webhookUrl) return false

  return postDiscordWebhook(webhookUrl, {
    embeds: [
      {
        title: "웹사이트 방문",
        color: 0x5865f2,
        fields: [
          { name: "페이지", value: payload.path || "/", inline: true },
          { name: "제목", value: truncate(payload.title || "-", 200), inline: true },
          { name: "방문자 ID", value: payload.visitorId.slice(0, 36), inline: false },
          {
            name: "유입",
            value: truncate(payload.referrer || "직접 방문", 300),
            inline: false,
          },
        ],
        footer: { text: truncate(payload.userAgent || "unknown", 120) },
        timestamp: new Date().toISOString(),
      },
    ],
  })
}
