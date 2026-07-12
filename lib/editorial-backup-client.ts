/** Browser-side editorial learning backups (download + localStorage). */

const RULES_KEY = "ct-editorial-learned-rules-v1"
const LOG_KEY = "ct-editorial-learning-log-v1"
const MAX_LOG = 40

export type BrowserLearnedRule = {
  id: string
  rule: string
  hypothesis?: string
  confidence?: number
  hitCount?: number
}

export function downloadJsonBackup(filename: string, payload: unknown) {
  if (typeof window === "undefined") return
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
    type: "application/json;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function mirrorRulesToLocalStorage(rules: BrowserLearnedRule[]) {
  if (typeof window === "undefined") return
  try {
    const prev = readRulesFromLocalStorage()
    const map = new Map<string, BrowserLearnedRule>()
    for (const r of prev) map.set(r.id, r)
    for (const r of rules) {
      if (!r?.id || !r.rule) continue
      map.set(r.id, { ...map.get(r.id), ...r })
    }
    const merged = [...map.values()].slice(0, 80)
    localStorage.setItem(
      RULES_KEY,
      JSON.stringify({ updatedAt: new Date().toISOString(), rules: merged }),
    )
  } catch {
    /* quota / private mode */
  }
}

export function readRulesFromLocalStorage(): BrowserLearnedRule[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(RULES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { rules?: BrowserLearnedRule[] }
    return Array.isArray(parsed.rules) ? parsed.rules : []
  } catch {
    return []
  }
}

export function appendLearningLogLocal(entry: Record<string, unknown>) {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(LOG_KEY)
    const prev = raw ? (JSON.parse(raw) as unknown[]) : []
    const list = Array.isArray(prev) ? prev : []
    list.unshift({ ...entry, at: entry.at || new Date().toISOString() })
    localStorage.setItem(LOG_KEY, JSON.stringify(list.slice(0, MAX_LOG)))
  } catch {
    /* ignore */
  }
}

export function backupLearnResultToBrowser(payload: {
  sessionId: string
  slug?: string
  backup?: unknown
  added?: BrowserLearnedRule[]
  localBackupFiles?: string[]
  ephemeral?: boolean
}) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const slug = payload.slug || "draft"
  const filename = `ct-editorial-backup-${slug}-${payload.sessionId || stamp}.json`

  if (payload.backup) {
    downloadJsonBackup(filename, payload.backup)
  }

  if (payload.added?.length) {
    mirrorRulesToLocalStorage(payload.added)
  } else if (payload.backup && typeof payload.backup === "object") {
    const store = (payload.backup as { rulesStore?: { rules?: BrowserLearnedRule[] } }).rulesStore
    if (store?.rules?.length) mirrorRulesToLocalStorage(store.rules)
  }

  appendLearningLogLocal({
    sessionId: payload.sessionId,
    slug,
    addedCount: payload.added?.length || 0,
    localBackupFiles: payload.localBackupFiles || [],
    ephemeral: payload.ephemeral,
    downloaded: Boolean(payload.backup),
  })

  return filename
}
