import { sectionHeadingRegex } from "@/lib/insight-sections"

export type InsightReferenceItem = {
  text: string
}

/**
 * Pull the references section out of insight markdown so it can render
 * as a collapsed footer control instead of an in-body heading + list.
 */
export function extractInsightReferences(source: string): {
  body: string
  items: InsightReferenceItem[]
} {
  const normalized = source.replace(/\r\n/g, "\n")
  const headingRe = sectionHeadingRegex("references", "im")
  if (!headingRe) return { body: source, items: [] }

  const match = headingRe.exec(normalized)
  if (!match || match.index === undefined) {
    return { body: source, items: [] }
  }

  const start = match.index
  const afterHeading = start + match[0].length
  const rest = normalized.slice(afterHeading)
  const nextH2 = rest.search(/\n##\s+/)
  const sectionBody = (nextH2 === -1 ? rest : rest.slice(0, nextH2)).trim()
  const after = nextH2 === -1 ? "" : rest.slice(nextH2)
  const before = normalized.slice(0, start).trimEnd()

  const items = parseReferenceItems(sectionBody)
  const body = `${before}${after ? `\n\n${after.trimStart()}` : ""}`.trim()

  return { body, items }
}

function parseReferenceItems(sectionBody: string): InsightReferenceItem[] {
  const items: InsightReferenceItem[] = []

  for (const rawLine of sectionBody.split("\n")) {
    const line = rawLine.trim()
    if (!line) continue

    const bullet = /^(?:[-*+]|\d+\.)\s+(.+)$/.exec(line)
    if (bullet) {
      const text = bullet[1].trim()
      if (text) items.push({ text })
      continue
    }

    // Rare non-list leftovers — keep as a single citation line.
    if (!line.startsWith("#") && !line.startsWith("<")) {
      items.push({ text: line })
    }
  }

  return items
}
