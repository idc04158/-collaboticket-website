import { promises as fs } from "fs"
import path from "path"

export type IntelligenceSegment = "casual" | "engaged"
export type IntelligenceFunnel = "kakao" | "contact" | "post_submit" | "organic"

export type IntelligenceEvent = {
  at: string
  visitorId: string
  inquiryId?: string
  event: string
  segment?: IntelligenceSegment
  funnel?: IntelligenceFunnel
  path?: string
  slug?: string
  title?: string
  scrollPct?: number
  ip?: string
  userAgent?: string
  meta?: Record<string, unknown>
}

function resolveEventsPath() {
  if (process.env.INTELLIGENCE_EVENTS_PATH) {
    return process.env.INTELLIGENCE_EVENTS_PATH
  }
  if (process.env.VERCEL) {
    return path.join("/tmp", "collaboticket-intelligence-events.jsonl")
  }
  return path.join(process.cwd(), ".data", "intelligence-events.jsonl")
}

const EVENTS_FILE = resolveEventsPath()

export async function appendIntelligenceEvent(event: IntelligenceEvent) {
  await fs.mkdir(path.dirname(EVENTS_FILE), { recursive: true })
  await fs.appendFile(EVENTS_FILE, `${JSON.stringify(event)}\n`, "utf8")
}

export async function readIntelligenceEvents(limit = 200): Promise<IntelligenceEvent[]> {
  try {
    const raw = await fs.readFile(EVENTS_FILE, "utf8")
    const lines = raw.trim().split("\n").filter(Boolean)
    return lines
      .slice(-limit)
      .map((line) => JSON.parse(line) as IntelligenceEvent)
      .reverse()
  } catch {
    return []
  }
}

export async function readIntelligenceEventsForInquiry(inquiryId: string, limit = 100) {
  const events = await readIntelligenceEvents(1000)
  return events.filter((event) => event.inquiryId === inquiryId).slice(0, limit)
}
