import { marked } from "marked"

export type InsightTocItem = {
  id: string
  level: number
  text: string
}

marked.setOptions({
  gfm: true,
  breaks: false,
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

function stripSectionsForRender(body: string) {
  let next = body
  next = next.replace(/^##\s+AI 30초 요약\s*\n+[\s\S]*?(?=\n##\s+|\n!\[|\n*$)/m, "")
  next = next.replace(/^##\s+실행 체크리스트\s*\n+[\s\S]*?(?=\n##\s+|\n*$)/m, "")
  next = next.replace(/^##\s+참고\s*출처[\s\S]*?(?=^##\s+|(?![\s\S]))/gm, "")
  return next.trim()
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

export async function renderInsightMarkdown(rawBody: string) {
  const body = stripSectionsForRender(rawBody)
  const parsed = await marked.parse(body)
  return addHeadingIds(parsed)
}

export function splitSummaryBullets(summary: string) {
  return summary
    .split(/\n+/)
    .map((line) => line.replace(/^[\s•✓\-*]+\s*/, "").trim())
    .filter((line) => line.length > 0)
}
