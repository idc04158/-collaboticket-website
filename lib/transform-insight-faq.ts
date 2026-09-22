import { getInsightSection, sectionAliases } from "@/lib/insight-sections"

export type InsightFaqItem = {
  question: string
  answer: string
}

function faqHeadingRegex() {
  const parts = sectionAliases(getInsightSection("faq")!).map((a) =>
    a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*"),
  )
  return new RegExp(`^##\\s+(?:${parts.join("|")})\\s*$`, "im")
}

function parseFaqItems(sectionBody: string): InsightFaqItem[] {
  const lines = sectionBody.replace(/\r\n/g, "\n").split("\n")
  const items: InsightFaqItem[] = []
  let question: string | null = null
  let answerLines: string[] = []

  const flush = () => {
    if (!question) return
    const answer = answerLines.join("\n").trim()
    if (answer) {
      items.push({ question: question.trim(), answer })
    }
    question = null
    answerLines = []
  }

  for (const line of lines) {
    if (/^\s*</.test(line) && /FAQCard/.test(line)) {
      flush()
      return []
    }
    const heading = /^###\s+(.+)$/.exec(line.trim())
    if (heading) {
      flush()
      question = heading[1].replace(/[#*_`]/g, "").trim()
      continue
    }
    if (question !== null) {
      answerLines.push(line)
    }
  }
  flush()
  return items
}

/**
 * Convert markdown FAQ (### Q + answer paragraphs) into FAQCard accordion MDX.
 * Keeps the ## heading; skips when FAQCard already present or no parsable items.
 */
export function transformInsightFaqToAccordion(source: string): string {
  const normalized = source.replace(/\r\n/g, "\n")
  const match = faqHeadingRegex().exec(normalized)
  if (!match || match.index === undefined) return source

  const headingLine = match[0]
  const start = match.index
  const afterHeading = start + headingLine.length
  const rest = normalized.slice(afterHeading)
  const nextH2 = rest.search(/\n##\s+/)
  const sectionBody = nextH2 === -1 ? rest : rest.slice(0, nextH2)
  const after = nextH2 === -1 ? "" : rest.slice(nextH2)

  if (/<FAQCard[\s/>]/.test(sectionBody)) return source

  const items = parseFaqItems(sectionBody)
  if (items.length === 0) return source

  const headingText = getInsightSection("faq")?.display || "자주 묻는 질문"
  const mdx = `\n\n## ${headingText}\n\n<FAQCard items={${JSON.stringify(items)}} />\n`

  return normalized.slice(0, start).trimEnd() + mdx + after
}
