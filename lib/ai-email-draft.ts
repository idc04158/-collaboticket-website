import type { Inquiry } from "@/lib/inquiries"

type DraftInput = {
  inquiry: Pick<Inquiry, "name" | "company" | "goal" | "detail" | "services" | "salesStatus" | "budget" | "monthlyRevenue">
  customerStatus?: string
  previousMessages?: string
}

export async function generateEmailDraftWithOpenAI(input: DraftInput): Promise<{ subject: string; body: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const system = `You are a bilingual (Korean/Japanese commerce) CRM assistant for CollaboTicket, an Japan e-commerce execution agency.
Detect intent from context: pricing inquiry, partnership, consultation booking, follow-up, or general.
Write a professional but friendly email in Korean unless the inquiry is clearly in another language.
Be concise and structured (greeting, 2-4 short paragraphs, clear next step, sign-off).
Output JSON only with keys: "subject", "body" (plain text, use newlines for paragraphs).`

  const user = [
    `Recipient company: ${input.inquiry.company}`,
    `Contact name: ${input.inquiry.name}`,
    `Services interested: ${input.inquiry.services.join(", ")}`,
    `Sales status: ${input.inquiry.salesStatus}`,
    `Budget: ${input.inquiry.budget || "-"}`,
    `Revenue: ${input.inquiry.monthlyRevenue || "-"}`,
    `Goal: ${input.inquiry.goal}`,
    `Detail: ${input.inquiry.detail || "-"}`,
    input.customerStatus ? `Pipeline status: ${input.customerStatus}` : "",
    input.previousMessages ? `Previous thread summary:\n${input.previousMessages}` : "",
  ]
    .filter(Boolean)
    .join("\n")

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  })

  if (!res.ok) return null
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const raw = data.choices?.[0]?.message?.content
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { subject?: string; body?: string }
    if (!parsed.subject || !parsed.body) return null
    return { subject: parsed.subject, body: parsed.body }
  } catch {
    return null
  }
}
