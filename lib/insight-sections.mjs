/**
 * Insight section model — internal (CMS/AI structure) vs display (reader-facing).
 * SINGLE SOURCE OF TRUTH. Do not hardcode section titles elsewhere.
 */

/**
 * @typedef {{
 *   id: string,
 *   internal: string,
 *   display: string,
 *   aliases?: string[],
 * }} InsightSectionDef
 */

/** @type {InsightSectionDef[]} */
export const INSIGHT_SECTIONS = [
  {
    id: "conclusion",
    internal: "결론",
    display: "결론",
  },
  {
    id: "why",
    internal: "왜 중요한가",
    display: "왜 중요한가",
  },
  {
    id: "practice",
    internal: "실무에서는 어떻게 보는가",
    display: "실무에서는 어떻게 보는가",
  },
  {
    id: "checklist",
    internal: "바로 실행할 체크리스트",
    display: "바로 실행할 체크리스트",
    aliases: ["실무 체크리스트", "실행 전 체크리스트", "실행 체크리스트", "체크리스트"],
  },
  {
    id: "faq",
    internal: "자주 묻는 질문",
    display: "자주 묻는 질문",
    aliases: ["FAQ"],
  },
  {
    id: "insight",
    internal: "CollaboTicket 인사이트",
    display: "실무에서 자주 보는 사례",
    aliases: ["현장에서 많이 놓치는 부분"],
  },
  {
    id: "cta",
    internal: "무료 진단 CTA",
    display: "다음 단계",
    aliases: ["우리 상품에도 적용해보기", "내 상품 실행 순서 확인하기"],
  },
  {
    id: "references",
    internal: "참고 출처",
    display: "참고한 자료",
    aliases: ["References", "관련 리포트", "이 글의 근거 자료"],
  },
]

/** @param {InsightSectionDef} section */
export function sectionAliases(section) {
  const set = new Set([section.internal, section.display, ...(section.aliases || [])])
  return [...set].filter(Boolean)
}

/** @param {string} id */
export function getInsightSection(id) {
  return INSIGHT_SECTIONS.find((s) => s.id === id) || null
}

/** @param {string} headingText */
export function resolveInsightSection(headingText) {
  const text = String(headingText || "").trim()
  if (!text) return null
  return (
    INSIGHT_SECTIONS.find((section) =>
      sectionAliases(section).some((alias) => alias.toLowerCase() === text.toLowerCase()),
    ) || null
  )
}

/** Display ## heading for a section id. */
export function displayHeading(id) {
  const section = getInsightSection(id)
  return section ? `## ${section.display}` : null
}

/** Regex matching any alias for a section (for ## headings). */
export function sectionHeadingRegex(id, flags = "im") {
  const section = getInsightSection(id)
  if (!section) return null
  const parts = sectionAliases(section).map((a) =>
    a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*"),
  )
  return new RegExp(`^##\\s+(?:${parts.join("|")})\\s*$`, flags)
}

/** True if body contains a ## heading for this section id (any alias). */
export function bodyHasSection(body, id) {
  const re = sectionHeadingRegex(id, "im")
  return re ? re.test(body) : false
}

/**
 * Rewrite known internal/alias ## headings to reader-facing display titles.
 * Does not invent new sections — only normalizes known ones.
 */
export function transformInsightSectionHeadings(source) {
  const normalized = String(source || "").replace(/\r\n/g, "\n")
  const lines = normalized.split("\n")

  const next = lines.map((line) => {
    const match = /^(##)\s+(.+?)\s*$/.exec(line)
    if (!match) return line
    const section = resolveInsightSection(match[2])
    if (!section) return line
    return `## ${section.display}`
  })

  return next.join("\n")
}

/** Ordered display headings for AI output structure docs. */
export function insightDisplayStructureLines() {
  return INSIGHT_SECTIONS.map((s) => `## ${s.display}`)
}

/** Human-readable internal→display map for prompts. */
export function insightSectionMappingPromptBlock() {
  const rows = INSIGHT_SECTIONS.map(
    (s) => `- \`${s.id}\` / 내부 \`${s.internal}\` → 화면 \`## ${s.display}\``,
  ).join("\n")
  return `### 섹션명 규칙 (내부 ≠ 화면)
본문 \`##\` 제목은 **화면 표시명(display)** 만 쓴다.
CTA, Insight, Block, Section 등 내부/개발 용어를 헤딩에 쓰지 않는다.

매핑:
${rows}

금지 예: \`## 무료 진단 CTA\`, \`## CollaboTicket 인사이트\`
사용 예: \`## 다음 단계\`, \`## 실무에서 자주 보는 사례\``
}
