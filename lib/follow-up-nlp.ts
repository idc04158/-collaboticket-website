/** Extract a follow-up date hint from outbound email text (regex + weekday names). */

const ISO = /\b(20\d{2}-\d{2}-\d{2})\b/
const KOREAN_REL = /(\d+)\s*일\s*(?:이내|안에|까지)/

const EN_DAY: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

const KO_DAY: Record<string, number> = {
  일요일: 0,
  월요일: 1,
  화요일: 2,
  수요일: 3,
  목요일: 4,
  금요일: 5,
  토요일: 6,
}

function nextWeekday(targetDow: number, from = new Date()) {
  const d = new Date(from)
  d.setHours(12, 0, 0, 0)
  const current = d.getDay()
  let add = (targetDow - current + 7) % 7
  if (add === 0) add = 7
  d.setDate(d.getDate() + add)
  return d.toISOString().slice(0, 10)
}

export function extractFollowUpDateFromText(text: string): string | null {
  const t = text.trim()
  if (!t) return null

  const iso = t.match(ISO)
  if (iso) return iso[1]

  const rel = t.match(KOREAN_REL)
  if (rel) {
    const days = Math.min(90, Math.max(1, parseInt(rel[1], 10)))
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
  }

  const lower = t.toLowerCase()
  for (const [ko, dow] of Object.entries(KO_DAY)) {
    if (t.includes(`${ko}까지`) || t.includes(`${ko} 안에`)) {
      return nextWeekday(dow)
    }
  }

  for (const [en, dow] of Object.entries(EN_DAY)) {
    const re = new RegExp(`\\b(?:by|before|until)\\s+${en}\\b`, "i")
    if (re.test(lower)) return nextWeekday(dow)
  }

  return null
}
