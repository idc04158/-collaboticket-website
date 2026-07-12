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

function ensureBlankLineBeforeTableBlocks(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const result: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    const isTableRow = trimmed.startsWith("|") && trimmed.endsWith("|")
    const prev = result[result.length - 1]
    const prevIsTableRow = prev !== undefined && prev.trim().startsWith("|") && prev.trim().endsWith("|")

    if (isTableRow && !prevIsTableRow && prev !== undefined && prev.trim() !== "") {
      result.push("")
    }

    result.push(line)
  }

  return result.join("\n")
}

function normalizeReadableMarkdown(body: string) {
  let next = normalizeCheckmarkBullets(body)

  // Blank line before headings and block elements for clearer section breaks.
  next = next.replace(/([^\n])\n(#{1,3}\s)/g, "$1\n\n$2")
  next = next.replace(/([^\n])\n(>\s)/g, "$1\n\n$2")
  next = ensureBlankLineBeforeTableBlocks(next)

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

/** Mark list items that already have a meaningful bullet so CSS does not add a second check. */
function markNativeBulletListItems(html: string) {
  // <li>★ tip...</li>
  let next = html.replace(
    /<li(\b[^>]*)>(\s*)([★☆✦✧•●○◆◇▪▫■□▶▷])\s+/g,
    (_full, attrs = "", space, bullet) => {
      if (/\binsight-native-bullet\b/.test(attrs)) {
        return `<li${attrs}>${space}${bullet} `
      }
      const nextAttrs = /\bclass=/.test(attrs)
        ? attrs.replace(/\bclass=(["'])([^"']*)\1/, (_m: string, q: string, classes: string) => {
            return `class=${q}${`${classes} insight-native-bullet`.trim()}${q}`
          })
        : `${attrs} class="insight-native-bullet"`
      return `<li${nextAttrs}>${space}<span class="insight-native-bullet-mark" aria-hidden="true">${bullet}</span> `
    },
  )

  // <li><p>★ tip...</p></li>
  next = next.replace(
    /<li(\b[^>]*)>(\s*)<p>(\s*)([★☆✦✧•●○◆◇▪▫■□▶▷])\s+/g,
    (_full, attrs = "", space1, space2, bullet) => {
      if (/\binsight-native-bullet\b/.test(attrs)) {
        return `<li${attrs}>${space1}<p>${space2}${bullet} `
      }
      const nextAttrs = /\bclass=/.test(attrs)
        ? attrs.replace(/\bclass=(["'])([^"']*)\1/, (_m: string, q: string, classes: string) => {
            return `class=${q}${`${classes} insight-native-bullet`.trim()}${q}`
          })
        : `${attrs} class="insight-native-bullet"`
      return `<li${nextAttrs}>${space1}<p>${space2}<span class="insight-native-bullet-mark" aria-hidden="true">${bullet}</span> `
    },
  )

  return next
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

function resolveInsightLinkLabels(html: string, titleBySlug?: Map<string, string>) {
  if (!titleBySlug || titleBySlug.size === 0) return html

  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs: string, inner: string) => {
    const hrefMatch = attrs.match(/\bhref=["'](\/insights\/([^"'/#?]+))["']/i)
    if (!hrefMatch) return full

    const slug = hrefMatch[2]
    const title = titleBySlug.get(slug)
    if (!title) return full

    const text = inner.replace(/<[^>]*>/g, "").trim()
    const isPathLike =
      text === `/insights/${slug}` ||
      text === slug ||
      text === `insights/${slug}` ||
      /^\/insights\//.test(text)

    if (!isPathLike) return full
    return `<a${attrs}>${title}</a>`
  })
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

function markFaqQuestionHeadings(html: string) {
  const parts = html.split(/(<h2\b[^>]*>[\s\S]*?<\/h2>)/gi)
  let inFaq = false

  return parts
    .map((part) => {
      if (/^<h2\b/i.test(part)) {
        const text = part.replace(/<[^>]+>/g, "").trim()
        inFaq = text === "FAQ"
        return part
      }

      if (inFaq) {
        return part.replace(/<h3(\s[^>]*)?>/gi, (match, attrs = "") => {
          if (/\bclass=/i.test(attrs)) {
            return match.replace(/\bclass=(["'])([^"']*)\1/i, (_full, quote, classes) => {
              const next = classes.includes("insight-faq-question")
                ? classes
                : `${classes} insight-faq-question`.trim()
              return `class=${quote}${next}${quote}`
            })
          }
          return `<h3 class="insight-faq-question"${attrs}>`
        })
      }

      return part
    })
    .join("")
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

export async function renderInsightMarkdown(
  rawBody: string,
  slug?: string,
  titleBySlug?: Map<string, string>,
) {
  const body = normalizeReadableMarkdown(stripSectionsForRender(rawBody))
  const parsed = await marked.parse(escapeNumericRangeTildes(body))
  const withLinks = resolveInsightLinkLabels(openExternalLinksInNewTab(parsed), titleBySlug)
  const wrapped = wrapTables(splitCheckmarkParagraphs(withLinks))
  const withNativeBullets = markNativeBulletListItems(wrapped)
  const withFaqHeadings = markFaqQuestionHeadings(withNativeBullets)
  const withMidCta = injectMidCtaMarker(withFaqHeadings)
  const highlighted = applyGlossaryHighlights(withMidCta, slug)
  return addHeadingIds(highlighted)
}

/** Marker consumed by InsightGlossaryBody to place a mid-article inquiry CTA. */
export const INSIGHT_MID_CTA_MARKER = "<!--INSIGHT_MID_CTA-->"

function injectMidCtaMarker(html: string) {
  if (html.includes(INSIGHT_MID_CTA_MARKER)) return html
  // Place CTA just before ACTION / 다음 단계 so readers convert after the case study.
  const replaced = html.replace(
    /(<h2\b[^>]*>\s*(?:ACTION:|다음 단계)[\s\S]*?<\/h2>)/i,
    `${INSIGHT_MID_CTA_MARKER}$1`,
  )
  return replaced === html ? `${html}${INSIGHT_MID_CTA_MARKER}` : replaced
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
