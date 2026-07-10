/**
 * Insight markdown hygiene — leaked ### markers, broken FAQ merges, generic FAQ boilerplate.
 * @see scripts/insight-content-rules-registry.mjs
 */

const GENERIC_FAQ_MARKERS = [
  "### Qoo10과 Rakuten 중 어디부터 시작해야 하나요?",
  "### 일본 진출 초기에 필요한 리뷰 수는?",
  "### 광고는 언제 켜야 하나요?",
  "### 메가와리는 몇 주 전 준비해야 하나요?",
]

const GENERIC_FAQ_ANSWERS = {
  "### Qoo10과 Rakuten 중 어디부터 시작해야 하나요?":
    "리뷰·프로모션 테스트는 Qoo10, SEO·재구매 설계는 Rakuten을 우선 검토합니다. 예산 500만 원 이하라면 Qoo10 단일 채널 30일 테스트를 권장합니다.",
  "### 일본 진출 초기에 필요한 리뷰 수는?":
    "카테고리별로 다르지만, CollaboTicket 운영 데이터 기준 전환율 변곡점은 보통 20~40개 구간에서 나타납니다.",
  "### 광고는 언제 켜야 하나요?":
    "상세페이지·배송 SLA·CS 매크로가 준비된 뒤, 리뷰 10개 이상 확보 후 소액(월 20~30만 엔)으로 CTR/CVR을 먼저 검증합니다.",
  "### 메가와리는 몇 주 전 준비해야 하나요?":
    "재고·가격·쿠폰·크리에이티브·리뷰 확보 기준 최소 6~8주 전 시뮬레이션을 권장합니다.",
}

const EXTRA_GENERIC_FAQ_RE = [
  /### Amazon Japan FBA는 언제 도입하나요\?\n[^\n#]+(?:\n|$)/g,
  /### 무료 진단에서 무엇을 확인하나요\?\n[^\n#]+(?:\n|$)/g,
]

const INLINE_HEADING_RE = /^([^\n#]*?)(\d{4}년\s*)?###\s*(.+\?)\s*$/

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
}

/** Join FAQ ### questions split across two source lines (### … / …?). */
function joinSplitFaqQuestions(body) {
  const lines = body.split("\n")
  const result = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    const next = lines[i + 1]?.trim() ?? ""

    if (
      /^### .+[^?]$/.test(trimmed) &&
      /^[^\n#|>-].+\?$/.test(next) &&
      !/^#{1,6}\s/.test(next)
    ) {
      result.push(`${trimmed} ${next}`)
      i++
      continue
    }

    result.push(line)
  }

  return result.join("\n")
}

function fixConsecutiveFaqHeadings(body) {
  return body.replace(/(### [^\n]+\?)\n(### [^\n]+\?)\n/g, (match, first, second) => {
    if (first.includes("시장의 규모") || first.includes("시장 규모")) {
      return `${first}\n2025년 기준 일본 EC 시장 규모는 약 20조 엔으로 예상됩니다 (METI EC Market Survey 2024).\n\n${second}\n`
    }
    return match
  })
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** @param {string} content @param {string} [slug] */
export function scanMarkdownHygiene(content, slug = "") {
  const normalized = normalizeNewlines(content)
  const issues = []
  const lines = normalized.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNo = i + 1
    const trimmed = line.trim()
    const next = lines[i + 1]?.trim() ?? ""

    if (
      /^### .+[^?]$/.test(trimmed) &&
      /^[^\n#|>-].+\?$/.test(next) &&
      !/^#{1,6}\s/.test(next)
    ) {
      issues.push({
        line: lineNo,
        type: "split-faq-question",
        message: "FAQ 질문이 두 줄로 나뉘어 있습니다 — 한 줄로 작성하세요",
        snippet: `${trimmed} / ${next}`,
      })
    }

    if (line.includes("###") && !/^\s*#{1,6}\s/.test(line)) {
      issues.push({
        line: lineNo,
        type: "inline-heading",
        message: "본문 줄에 ### 마크다운 기호가 그대로 노출됩니다",
        snippet: line.trim().slice(0, 120),
      })
    }

    if (/^\s*#{4,6}\s/.test(line) && slug !== "japan-ecommerce-marketing-glossary") {
      issues.push({
        line: lineNo,
        type: "deep-heading",
        message: "h4 이상 헤딩은 인사이트 본문에서 사용하지 않습니다",
        snippet: line.trim().slice(0, 120),
      })
    }

    if (/\{"description"\s*:/.test(line)) {
      issues.push({
        line: lineNo,
        type: "json-leak",
        message: "생성 프롬프트 JSON description 누수",
        snippet: line.trim().slice(0, 120),
      })
    }
  }

  if (GENERIC_FAQ_MARKERS.every((m) => normalized.includes(m))) {
    issues.push({
      line: normalized.indexOf(GENERIC_FAQ_MARKERS[0]),
      type: "generic-faq-boilerplate",
      message: `${slug || "post"}에 범용 FAQ 보일러플레이트가 붙어 있습니다`,
      snippet: GENERIC_FAQ_MARKERS[0],
    })
  }

  return issues
}

function fixInlineFaqLine(line) {
  const match = line.match(INLINE_HEADING_RE)
  if (!match) {
    return line.replace(/\s*###\s*/g, " ")
  }
  return `### ${match[3].trim()}`
}

function fixBrokenFaqSection(body) {
  const lines = body.split("\n")
  const next = [...lines]

  for (let i = 0; i < next.length; i++) {
    if (!next[i].includes("###") || /^\s*#{1,6}\s/.test(next[i])) continue

    const fixed = fixInlineFaqLine(next[i])
    if (fixed === next[i]) continue

    const prev = next[i - 1] ?? ""
    if (/^### .+\?$/.test(prev.trim()) && !next[i - 2]?.trim()) {
      // Previous ### question had no answer — leave for manual/default fill below
    }

    next[i] = fixed
  }

  return next.join("\n")
}

function removeGenericFaqBoilerplate(body) {
  if (!GENERIC_FAQ_MARKERS.every((m) => body.includes(m))) return body

  let next = body
  for (const [question, answer] of Object.entries(GENERIC_FAQ_ANSWERS)) {
    const blockRe = new RegExp(
      `${escapeRegExp(question)}\\n${escapeRegExp(answer)}(?:\\n\\n|\\n(?=## ))`,
      "g",
    )
    next = next.replace(blockRe, "")
  }

  for (const re of EXTRA_GENERIC_FAQ_RE) {
    next = next.replace(re, "")
  }

  next = next.replace(
    /^## FAQ\n\n> 일반적인 일본 EC 질문은 \[일본 이커머스 FAQ 50\]\(\/insights\/japan-ecommerce-faq-50\)에서 확인하세요\.\n+(?=## )/m,
    "## FAQ\n\n> 일반적인 일본 EC 질문은 [일본 이커머스 FAQ 50](/insights/japan-ecommerce-faq-50)에서 확인하세요.\n\n",
  )

  return next
}

/** @param {string} content @param {string} [slug] */
export function fixMarkdownHygiene(content, slug = "") {
  let body = normalizeNewlines(content)

  body = joinSplitFaqQuestions(body)
  body = fixBrokenFaqSection(body)
  body = fixConsecutiveFaqHeadings(body)
  body = removeGenericFaqBoilerplate(body)

  body = body.replace(/^\s*\{"description"\s*:\s*"[\s\S]*?"\}\s*$/gm, "")
  body = body.replace(/^\s*\{"description"\s*:\s*"[^\n]*$/gm, "")

  return body.trimEnd()
}

export const MARKDOWN_HYGIENE_RULES_PROMPT = `Markdown hygiene (critical):
- Section headings (## FACT / ## INSIGHT / ## ACTION) and FAQ questions (### …?) must be ONE markdown line — never split the title across two lines.
- FAQ questions use ### at the START of a line only — never inline in a paragraph (bad: "2025년 ### Qoo10의…").
- Every ### FAQ question must be followed by one or more answer paragraphs before the next ###.
- Do NOT append the generic 5-question FAQ boilerplate (브랜드 규모/Qoo10 vs Rakuten/리뷰 수/광고 시점/메가와리 준비) when the article already has topic-specific FAQ.
- Use ## for sections and ### for FAQ/subsections only — no #### or deeper headings.
- Never output {"description": "..."} JSON lines in the body.`
