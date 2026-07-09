import {
  MARKETING_GLOSSARY_SLUG,
  MARKETING_GLOSSARY_TERMS,
  type MarketingGlossaryTerm,
} from "@/lib/marketing-glossary"

type GlossaryMatch = {
  term: MarketingGlossaryTerm
  match: string
  start: number
  end: number
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function buildMatchers() {
  const matchers: Array<{ term: MarketingGlossaryTerm; pattern: string }> = []

  for (const term of MARKETING_GLOSSARY_TERMS) {
    const labels = [term.label, ...(term.aliases ?? [])]
    for (const label of labels) {
      const isLatin = /^[A-Za-z0-9][A-Za-z0-9\s-]*$/.test(label)
      const pattern = isLatin
        ? `\\b${escapeRegExp(label)}\\b`
        : escapeRegExp(label)
      matchers.push({ term, pattern })
    }
  }

  return matchers.sort((a, b) => b.pattern.length - a.pattern.length)
}

const GLOSSARY_MATCHERS = buildMatchers()

function findMatches(text: string): GlossaryMatch[] {
  const matches: GlossaryMatch[] = []

  for (const { term, pattern } of GLOSSARY_MATCHERS) {
    const re = new RegExp(pattern, "gi")
    let result: RegExpExecArray | null

    while ((result = re.exec(text)) !== null) {
      const start = result.index
      const end = start + result[0].length
      const overlaps = matches.some((existing) => start < existing.end && end > existing.start)
      if (overlaps) continue

      matches.push({ term, match: result[0], start, end })
    }
  }

  return matches.sort((a, b) => a.start - b.start)
}

function wrapMatch(match: GlossaryMatch) {
  const { term, match: label } = match
  return `<span class="glossary-term" tabindex="0" data-glossary-id="${term.id}" data-glossary-label="${escapeHtml(term.label)}" data-glossary-def="${escapeHtml(term.shortDefinition)}">${label}</span>`
}

function highlightTextNode(text: string) {
  const matches = findMatches(text)
  if (matches.length === 0) return text

  let cursor = 0
  let next = ""

  for (const match of matches) {
    next += text.slice(cursor, match.start)
    next += wrapMatch(match)
    cursor = match.end
  }

  next += text.slice(cursor)
  return next
}

function updateTagState(tag: string, state: { inAnchor: boolean; inGlossary: boolean }) {
  if (/^<a[\s>]/i.test(tag)) state.inAnchor = true
  if (/^<\/a>/i.test(tag)) state.inAnchor = false
  if (/class="[^"]*glossary-term/i.test(tag)) state.inGlossary = true
  if (/^<\/span>/i.test(tag) && state.inGlossary) state.inGlossary = false
}

export function applyGlossaryHighlights(html: string, slug?: string) {
  if (!html || slug === MARKETING_GLOSSARY_SLUG) return html

  const parts = html.split(/(<[^>]+>)/g)
  const state = { inAnchor: false, inGlossary: false }

  return parts
    .map((part) => {
      if (!part.startsWith("<")) {
        if (state.inAnchor || state.inGlossary) return part
        return highlightTextNode(part)
      }

      updateTagState(part, state)
      return part
    })
    .join("")
}
