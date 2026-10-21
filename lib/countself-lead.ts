const DEFAULT_LEAD_URL = "https://count-self.vercel.app/api/crm/inbound/website"
const PUSH_TIMEOUT_MS = 12_000

export type CountSelfLeadInput = {
  company: string
  name: string
  email: string
  phone: string
  source?: string
  notes: string
  occurredAt?: string
}

export async function pushLeadToCountSelf(input: CountSelfLeadInput) {
  const secret = process.env.COUNTSELF_INBOUND_SECRET?.trim()
  if (!secret) return false

  const url = process.env.COUNTSELF_LEAD_URL?.trim() || DEFAULT_LEAD_URL
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PUSH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        company: input.company,
        name: input.name,
        email: input.email,
        phone: input.phone,
        source: input.source || "homepage",
        notes: input.notes,
        occurredAt: input.occurredAt,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error("[countself] lead push failed:", response.status)
      return false
    }

    return true
  } catch (error) {
    console.error("[countself] lead push failed:", error)
    return false
  } finally {
    clearTimeout(timer)
  }
}
