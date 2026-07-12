import { buildLearnedRulesPrompt } from "@/lib/insight-learned-rules.mjs"

type ChatMessage = { role: "user" | "assistant"; content: string }

type AiEditInput = {
  title: string
  description: string
  content: string
  instruction: string
  history?: ChatMessage[]
}

export type AiEditResult = {
  reply: string
  summary?: string
  content?: string
  title?: string
  description?: string
}

export async function reviseInsightWithAi(input: AiEditInput): Promise<AiEditResult | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const learned = await buildLearnedRulesPrompt()

  const system = `You are CollaboTicket's insight article editor assistant.
CollaboTicket helps Korean brands execute Japan EC (Qoo10, Rakuten, Amazon, LINE, influencer, reviews).

Rules:
- Reply in Korean.
- Output JSON only with keys: "reply" (required string), optional "summary", "content", "title", "description".
- If the user asks to rewrite/edit the article body, return the FULL updated markdown in "content".
- When returning "content", also set "summary": a short Korean bullet list (3–8 lines, each starting with "- ") of what changed vs the previous body. Be concrete (어떤 섹션/문단을 삭제·추가·다듬었는지). Do not paste the full article into "summary".
- "reply" should be 1–2 sentences confirming the edit; details go in "summary".
- If they only ask a question, set "reply" and omit "content" and "summary".
- Keep FACT / INSIGHT / ACTION / FAQ / References structure unless the user asks to change it.
- Natural Korean (토스형), no translation-ese, no forced line breaks, no slug handles as link text.
- Preserve existing internal links as [readable title](/insights/slug).
- Do not invent fake METI/JETRO numbers; keep or lightly polish existing figures.
- Keep markdown tables valid (no blank lines between table rows).
${learned ? `\n${learned}` : ""}`

  const context = [
    `Current title: ${input.title || "(empty)"}`,
    `Current description: ${input.description || "(empty)"}`,
    `Current markdown body:\n---\n${input.content || "(empty)"}\n---`,
  ].join("\n\n")

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: system },
    { role: "user", content: context },
  ]

  for (const item of input.history || []) {
    if (item.role === "user" || item.role === "assistant") {
      messages.push({ role: item.role, content: item.content })
    }
  }

  messages.push({ role: "user", content: input.instruction })

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages,
    }),
  })

  if (!res.ok) return null
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const raw = data.choices?.[0]?.message?.content
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as AiEditResult
    if (!parsed.reply || typeof parsed.reply !== "string") return null
    return {
      reply: parsed.reply.trim(),
      summary: typeof parsed.summary === "string" ? parsed.summary.trim() : undefined,
      content: typeof parsed.content === "string" ? parsed.content.trim() : undefined,
      title: typeof parsed.title === "string" ? parsed.title.trim() : undefined,
      description: typeof parsed.description === "string" ? parsed.description.trim() : undefined,
    }
  } catch {
    return null
  }
}
