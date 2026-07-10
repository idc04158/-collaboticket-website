import { marked } from "marked"
import { applyGlossaryHighlights } from "@/lib/apply-glossary-highlights"
import { polishInsightCopy } from "@/lib/insight-plaintext-polish.mjs"

export type InsightTocItem = {
  id: string
  level: number
  text: string
}

marked.setOptions({
  gfm: true,
  breaks: true,
})

function toAnchorId(text: string, index: number) {
  const normalized = text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")

  return normalized || `section-${index + 1}`
}

function escapeNumericRangeTildes(text: string) {
  return text.replace(/(\d+(?:\.\d+)?)~(\d+(?:\.\d+)?)/g, "$1\\~$2")
}

/** Turn ✓ / • lines into markdown lists so they render with line breaks. */
export function normalizeCheckmarkBullets(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const result: string[] = []
  let listBuffer: string[] = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    if (result.length > 0 && result[result.length - 1]?.trim() !== "") {
      result.push("")
    }
    for (const item of listBuffer) {
      result.push(`- ${item}`)
    }
    listBuffer = []
    result.push("")
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (/^✓\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^✓\s+/, ""))
      continue
    }

    if (/^•\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^•\s+/, ""))
      continue
    }

    if (trimmed.includes("✓") && (trimmed.match(/✓/g)?.length ?? 0) > 1) {
      flushList()
      const parts = trimmed
        .split(/\s*✓\s+/)
        .map((part) => part.trim())
        .filter(Boolean)
      if (parts.length > 0) {
        if (result.length > 0 && result[result.length - 1]?.trim() !== "") result.push("")
        for (const part of parts) result.push(`- ${part}`)
        result.push("")
      }
      continue
    }

    flushList()
    result.push(line)
  }

  flushList()
  return result.join("\n")
}

function normalizeReadableMarkdown(body: string) {
  let next = normalizeCheckmarkBullets(body)

  // Blank line before headings and block elements for clearer section breaks.
  next = next.replace(/([^\n])\n(#{1,3}\s)/g, "$1\n\n$2")
  next = next.replace(/([^\n])\n(>\s)/g, "$1\n\n$2")
  next = next.replace(/([^\n])\n(\|[^\n]+\|)/g, "$1\n\n$2")

  return next
}

function stripSectionsForRender(body: string) {
  let next = body
  next = next.replace(/^##\s+AI 30초 요약\s*\n+[\s\S]*?(?=\n##\s+|\n!\[|\n*$)/m, "")
  next = next.replace(/^##\s+요약\s*\n+[\s\S]*?(?=\n##\s+|\n!\[|\n*$)/m, "")
  next = next.replace(/^##\s+실행 체크리스트\s*\n+[\s\S]*?(?=\n##\s+|\n*$)/m, "")
  next = next.replace(/^##\s+관련 리포트\s*\n+[\s\S]*?(?=\n##\s+|\n*$)/m, "")
  next = next.replace(/^##\s+참고\s*출처[\s\S]*?(?=^##\s+|(?![\s\S]))/gm, "")
  return next.trim()
}

function wrapTables(html: string) {
  return html.replace(/<table(\s[^>]*)?>([\s\S]*?)<\/table>/g, (match) => {
    return `<div class="insight-table-wrap">${match}</div>`
  })
}

function splitCheckmarkParagraphs(html: string) {
  return html.replace(/<p>([\s\S]*?)<\/p>/g, (match, inner: string) => {
    if (!inner.includes("✓") || inner.includes("<")) return match
    const items = inner
      .split(/\s*✓\s+/)
      .map((part) => part.trim())
      .filter(Boolean)
    if (items.length <= 1) return match
    return `<ul class="insight-check-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
  })
}

const INTERNAL_HOSTS = new Set(["collaboticket.com", "www.collaboticket.com", "localhost"])

function isExternalHref(href: string) {
  const value = href.trim()
  if (!value || value.startsWith("#") || value.startsWith("/") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return false
  }

  try {
    const url = new URL(value, "https://collaboticket.com")
    return !INTERNAL_HOSTS.has(url.hostname.toLowerCase())
  } catch {
    return false
  }
}

function openExternalLinksInNewTab(html: string) {
  return html.replace(/<a\b([^>]*)>/gi, (match, attrs: string) => {
    const hrefMatch = attrs.match(/\bhref=["']([^"']+)["']/i)
    if (!hrefMatch || !isExternalHref(hrefMatch[1])) return match
    if (/\btarget=/i.test(attrs)) return match

    let nextAttrs = attrs
    if (/\brel=/i.test(nextAttrs)) {
      nextAttrs = nextAttrs.replace(/\brel=["']([^"']*)["']/i, (_full, rel: string) => {
        const tokens = new Set(rel.split(/\s+/).filter(Boolean))
        tokens.add("noopener")
        tokens.add("noreferrer")
        return `rel="${[...tokens].join(" ")}"`
      })
    } else {
      nextAttrs += ` rel="noopener noreferrer"`
    }

    return `<a${nextAttrs} target="_blank">`
  })
}

function addHeadingIds(html: string) {
  const toc: InsightTocItem[] = []
  const usedIds = new Map<string, number>()

  const withIds = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_full, level: string, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, "").trim()
    const baseId = toAnchorId(text, toc.length)
    const count = usedIds.get(baseId) || 0
    usedIds.set(baseId, count + 1)
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`

    toc.push({ id, level: Number(level), text })

    return `<h${level} id="${id}">${inner}</h${level}>`
  })

  return { html: withIds, toc }
}

export async function renderInsightMarkdown(rawBody: string, slug?: string) {
  const body = normalizeReadableMarkdown(stripSectionsForRender(rawBody))
  const parsed = await marked.parse(escapeNumericRangeTildes(body))
  const wrapped = wrapTables(splitCheckmarkParagraphs(openExternalLinksInNewTab(parsed)))
  const highlighted = applyGlossaryHighlights(wrapped, slug)
  return addHeadingIds(highlighted)
}

export function splitSummaryBullets(summary: string) {
  const polished = polishInsightCopy(summary)

  let lines = polished
    .split(/\n+/)
    .map((line) => line.replace(/^[\s•✓\-*]+\s*/, "").trim())
    .filter((line) => line.length > 0)

  if (lines.length <= 1 && polished.includes("✓")) {
    lines = polished
      .split(/\s*✓\s+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  return lines
}
