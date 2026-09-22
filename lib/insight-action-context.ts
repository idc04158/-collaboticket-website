export type InsightContentContext = {
  slug: string
  title?: string
  checkedItems: string[]
  progress: string
  step: string
  source: string
}

const STORAGE_PREFIX = "ct-insight-action:"

export function actionStorageKey(slug: string) {
  return `${STORAGE_PREFIX}${slug}`
}

export function loadCheckedItems(slug: string): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(actionStorageKey(slug))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []
  } catch {
    return []
  }
}

export function saveCheckedItems(slug: string, items: string[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(actionStorageKey(slug), JSON.stringify(items))
}

export function buildInsightActionContactHref(opts: {
  slug: string
  title?: string
  checkedItems: string[]
  total: number
  step?: string
}) {
  const params = new URLSearchParams()
  params.set("topic", "insight-action")
  params.set("source", "insight-action")
  params.set("slug", opts.slug)
  if (opts.title) params.set("title", opts.title)
  params.set("step", opts.step || "action-checklist")
  params.set("progress", `${opts.checkedItems.length}/${opts.total}`)
  if (opts.checkedItems.length > 0) {
    params.set("checked", opts.checkedItems.map(encodeURIComponent).join("|"))
  }
  return `/contact?${params.toString()}`
}

export function parseContentContextFromSearch(search: string): InsightContentContext | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
  const slug = params.get("slug")?.trim()
  if (!slug) return null

  const checkedRaw = params.get("checked") || ""
  const checkedItems = checkedRaw
    ? checkedRaw.split("|").map((s) => {
        try {
          return decodeURIComponent(s)
        } catch {
          return s
        }
      })
    : []

  return {
    slug,
    title: params.get("title")?.trim() || undefined,
    checkedItems,
    progress: params.get("progress")?.trim() || `${checkedItems.length}/?`,
    step: params.get("step")?.trim() || "action-checklist",
    source: params.get("source")?.trim() || params.get("topic")?.trim() || "insight-action",
  }
}

export function formatContentContextMemo(ctx: InsightContentContext) {
  const lines = [
    "[인사이트 액션]",
    `글: ${ctx.title || ctx.slug} (${ctx.slug})`,
    `진행: ${ctx.progress}`,
    `단계: ${ctx.step}`,
    `유입: ${ctx.source}`,
  ]
  if (ctx.checkedItems.length > 0) {
    lines.push("체크 항목:")
    for (const item of ctx.checkedItems) {
      lines.push(`- ${item}`)
    }
  } else {
    lines.push("체크 항목: 없음 (CTA만 클릭)")
  }
  return lines.join("\n")
}
