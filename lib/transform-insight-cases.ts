import { getInsightSection, sectionAliases } from "@/lib/insight-sections"

export type ParsedCase = {
  title: string
  cause: string
  action: string
}

function caseHeadingRegex() {
  const section = getInsightSection("insight")!
  const parts = sectionAliases(section).map((a) =>
    a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*"),
  )
  return new RegExp(`^##\\s+(?:${parts.join("|")})\\s*$`, "im")
}

/**
 * Heuristic parse of "실무에서 자주 보는 사례" prose into 2–3 Case cards.
 * Looks for bold titles or short lead sentences + 원인/대응 cues.
 */
export function parseCasesFromSection(sectionBody: string): ParsedCase[] {
  if (/<CaseStudies[\s/>]/.test(sectionBody)) return []

  const text = sectionBody.replace(/\r\n/g, "\n").trim()
  if (!text) return []

  // Split on numbered patterns or blank-line paragraphs
  const chunks = text
    .split(/\n(?=\d+\.\s|\*\*[^*]+\*\*|###\s)/)
    .map((c) => c.trim())
    .filter(Boolean)

  const cases: ParsedCase[] = []

  for (const chunk of chunks) {
    if (cases.length >= 3) break
    const titleMatch =
      /^\*\*(.+?)\*\*/.exec(chunk) ||
      /^###\s+(.+)$/m.exec(chunk) ||
      /^\d+\.\s+(.+)$/m.exec(chunk)
    const title = (titleMatch?.[1] || chunk.split(/[.。\n]/)[0] || "").replace(/[*#]/g, "").trim()
    if (!title || title.length < 6) continue

    const causeMatch =
      /원인[:：]\s*(.+?)(?=실무|대응|해결|\n\n|$)/s.exec(chunk) ||
      /때문에\s*(.+?)(?=\.|。|\n|$)/.exec(chunk)
    const actionMatch =
      /(?:실무\s*대응|대응|해결)[:：]?\s*(.+?)(?=\n\n|$)/s.exec(chunk) ||
      /(?:봅니다|하세요|합니다)\.\s*(.+)$/s.exec(chunk)

    const cause = (causeMatch?.[1] || "타이틀·검색어·상세·재고 중 어디가 먼저 꺾였는지 안 가린 채 수정한 경우")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120)
    const action = (actionMatch?.[1] || "노출·클릭·구매를 나눈 뒤 수정 범위를 정한다")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120)

    if (cases.some((c) => c.title === title)) continue
    cases.push({ title: title.slice(0, 80), cause, action })
  }

  // Fallback: take first 2–3 sentences as case titles from paragraphs
  if (cases.length === 0) {
    const paras = text
      .split(/\n\n+/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter((p) => p.length > 20)
    for (const para of paras.slice(0, 3)) {
      const title = para.split(/[.。]/)[0]?.trim() || para.slice(0, 40)
      cases.push({
        title: title.slice(0, 80),
        cause: "검색어와 구매 설득·운영 조건이 어긋난 상태",
        action: "지표를 나눈 뒤 타이틀·백엔드·재고 순으로 손본다",
      })
    }
  }

  return cases.slice(0, 3)
}

export function transformInsightCasesToComponent(source: string): string {
  const normalized = source.replace(/\r\n/g, "\n")
  const match = caseHeadingRegex().exec(normalized)
  if (!match || match.index === undefined) return source

  const headingLine = match[0]
  const start = match.index
  const afterHeading = start + headingLine.length
  const rest = normalized.slice(afterHeading)
  const nextH2 = rest.search(/\n##\s+/)
  const sectionBody = nextH2 === -1 ? rest : rest.slice(0, nextH2)
  const after = nextH2 === -1 ? "" : rest.slice(nextH2)

  if (/<CaseStudies[\s/>]/.test(sectionBody)) return source

  const cases = parseCasesFromSection(sectionBody)
  if (cases.length === 0) return source

  const display = getInsightSection("insight")?.display || "실무에서 자주 보는 사례"
  const mdx = `\n\n## ${display}\n\n<CaseStudies cases={${JSON.stringify(cases)}} />\n`

  return normalized.slice(0, start).trimEnd() + mdx + after
}
