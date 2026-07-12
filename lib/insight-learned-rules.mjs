/**
 * Admin AI 수정에서 학습된 에디토리얼 룰 저장소.
 * @see scripts/insight-content-rules-registry.mjs — id: learned-from-edits
 */

import fs from "fs/promises"
import { readFileSync, existsSync } from "fs"
import path from "path"

const MAX_ACTIVE_RULES_IN_PROMPT = 24

/**
 * @typedef {Object} LearnedRule
 * @property {string} id
 * @property {string} rule
 * @property {string} [hypothesis]
 * @property {"proposed"|"verified"|"active"|"rejected"} status
 * @property {number} [confidence]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 * @property {number} [hitCount]
 * @property {{ slug?: string, instruction?: string, summary?: string, sessionId?: string }} [evidence]
 */

/**
 * @typedef {Object} LearnedRulesStore
 * @property {number} version
 * @property {string|null} updatedAt
 * @property {LearnedRule[]} rules
 */

function editorialDir() {
  if (process.env.EDITORIAL_LEARNING_PATH) {
    return path.dirname(process.env.EDITORIAL_LEARNING_PATH)
  }
  if (process.env.VERCEL) {
    return path.join("/tmp", "collaboticket-editorial")
  }
  return path.join(process.cwd(), "content", "editorial")
}

export function getLearnedRulesPath() {
  if (process.env.EDITORIAL_LEARNING_PATH) return process.env.EDITORIAL_LEARNING_PATH
  return path.join(editorialDir(), "learned-rules.json")
}

export function getEditSessionsPath() {
  return path.join(editorialDir(), "edit-sessions.jsonl")
}

/** Always under the repo (local next/dev). On Vercel this path is usually read-only. */
export function getRepoEditorialDir() {
  return path.join(process.cwd(), "content", "editorial")
}

export function getRepoBackupsDir() {
  return path.join(getRepoEditorialDir(), "backups")
}

export function getRepoLearningLogPath() {
  return path.join(getRepoEditorialDir(), "learning-log.jsonl")
}

function seedLearnedRulesPath() {
  return path.join(getRepoEditorialDir(), "learned-rules.json")
}

/** @returns {LearnedRulesStore} */
function parseStore(raw) {
  const parsed = JSON.parse(raw)
  return {
    version: typeof parsed.version === "number" ? parsed.version : 1,
    updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    rules: Array.isArray(parsed.rules) ? parsed.rules : [],
  }
}

/** @returns {LearnedRulesStore} */
export function loadLearnedRulesStoreSync() {
  const candidates = [getLearnedRulesPath(), seedLearnedRulesPath()]
  for (const filePath of candidates) {
    try {
      if (!existsSync(filePath)) continue
      return parseStore(readFileSync(filePath, "utf8"))
    } catch {
      /* try next */
    }
  }
  return { version: 1, updatedAt: null, rules: [] }
}

/** @returns {Promise<LearnedRulesStore>} */
export async function loadLearnedRulesStore() {
  const filePath = getLearnedRulesPath()
  try {
    const raw = await fs.readFile(filePath, "utf8")
    return parseStore(raw)
  } catch {
    if (process.env.VERCEL || filePath !== seedLearnedRulesPath()) {
      try {
        const raw = await fs.readFile(seedLearnedRulesPath(), "utf8")
        return parseStore(raw)
      } catch {
        /* empty */
      }
    }
    return { version: 1, updatedAt: null, rules: [] }
  }
}

/** @param {LearnedRulesStore} store */
export async function saveLearnedRulesStore(store) {
  const filePath = getLearnedRulesPath()
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const next = {
    version: store.version || 1,
    updatedAt: new Date().toISOString(),
    rules: store.rules || [],
  }
  await fs.writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8")
  return next
}

/** @param {Record<string, unknown>} session */
export async function appendEditSession(session) {
  const filePath = getEditSessionsPath()
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.appendFile(filePath, `${JSON.stringify(session)}\n`, "utf8")
}

/**
 * Write a timestamped local backup + append learning-log under content/editorial.
 * Returns paths that succeeded (empty on read-only hosts like Vercel).
 * @param {Record<string, unknown>} payload
 */
export async function writeEditorialLocalBackup(payload) {
  const at = typeof payload.at === "string" ? payload.at : new Date().toISOString()
  const sessionId = typeof payload.sessionId === "string" ? payload.sessionId : `edit-${Date.now().toString(36)}`
  const slug = typeof payload.slug === "string" ? payload.slug : "draft"
  const stamp = at.replace(/[:.]/g, "-")
  const fileName = `${stamp}-${slug}-${sessionId}.json`

  /** @type {string[]} */
  const written = []
  /** @type {string[]} */
  const errors = []

  const targets = [
    path.join(getRepoBackupsDir(), fileName),
    path.join(editorialDir(), "backups", fileName),
  ]
  // Deduplicate identical paths
  const uniqueTargets = [...new Set(targets)]

  const body = `${JSON.stringify({ ...payload, at, sessionId, slug }, null, 2)}\n`
  for (const filePath of uniqueTargets) {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, body, "utf8")
      written.push(filePath)
    } catch (err) {
      errors.push(`${filePath}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const logLine = JSON.stringify({
    at,
    sessionId,
    slug,
    instruction: payload.instruction,
    summary: payload.summary,
    addedRuleIds: Array.isArray(payload.added)
      ? payload.added.map((r) => (r && typeof r === "object" && "id" in r ? r.id : null)).filter(Boolean)
      : [],
    backupFiles: written,
    ephemeral: Boolean(payload.ephemeral),
  })

  for (const logPath of [...new Set([getRepoLearningLogPath(), path.join(editorialDir(), "learning-log.jsonl")])]) {
    try {
      await fs.mkdir(path.dirname(logPath), { recursive: true })
      await fs.appendFile(logPath, `${logLine}\n`, "utf8")
      if (!written.includes(logPath)) written.push(logPath)
    } catch (err) {
      errors.push(`${logPath}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Keep a mirrored learned-rules snapshot in backups when rules store is included
  if (payload.rulesStore && typeof payload.rulesStore === "object") {
    const mirrorName = `learned-rules-mirror-${stamp}.json`
    for (const dir of [...new Set([getRepoBackupsDir(), path.join(editorialDir(), "backups")])]) {
      try {
        await fs.mkdir(dir, { recursive: true })
        const mirrorPath = path.join(dir, mirrorName)
        await fs.writeFile(mirrorPath, `${JSON.stringify(payload.rulesStore, null, 2)}\n`, "utf8")
        written.push(mirrorPath)
      } catch (err) {
        errors.push(`mirror: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  return { written, errors, fileName }
}

/** Active rules for generation prompts */
export async function listActiveLearnedRules() {
  const store = await loadLearnedRulesStore()
  return store.rules
    .filter((r) => r && (r.status === "active" || r.status === "verified") && typeof r.rule === "string")
    .sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
    .slice(0, MAX_ACTIVE_RULES_IN_PROMPT)
}

/** @param {LearnedRule[]} rules */
function formatLearnedRulesPrompt(rules) {
  if (!rules.length) return ""
  const lines = rules.map((r, i) => {
    const hyp = r.hypothesis ? ` (가설: ${r.hypothesis})` : ""
    return `${i + 1}. ${r.rule.trim()}${hyp}`
  })
  return `Learned editorial rules (from accepted human/AI edits — follow these when writing or revising):
${lines.join("\n")}
- Prefer these over generic fluff. Do not invent conflicting market stats to satisfy a rule.`
}

export async function buildLearnedRulesPrompt() {
  return formatLearnedRulesPrompt(await listActiveLearnedRules())
}

/** Sync variant for Node rewrite scripts */
export function buildLearnedRulesPromptSync() {
  const store = loadLearnedRulesStoreSync()
  const rules = store.rules
    .filter((r) => r && (r.status === "active" || r.status === "verified") && typeof r.rule === "string")
    .sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
    .slice(0, MAX_ACTIVE_RULES_IN_PROMPT)
  return formatLearnedRulesPrompt(rules)
}

/**
 * @param {LearnedRule[]} existing
 * @param {LearnedRule[]} incoming
 */
export function mergeLearnedRules(existing, incoming) {
  const out = [...existing]
  for (const rule of incoming) {
    if (!rule?.rule?.trim()) continue
    const normalized = rule.rule.trim().toLowerCase()
    const idx = out.findIndex((item) => {
      const a = (item.rule || "").trim().toLowerCase()
      return a === normalized || a.includes(normalized) || normalized.includes(a)
    })
    if (idx >= 0) {
      const prev = out[idx]
      out[idx] = {
        ...prev,
        ...rule,
        id: prev.id,
        hitCount: (prev.hitCount || 1) + 1,
        updatedAt: new Date().toISOString(),
        status: rule.status === "rejected" ? prev.status : rule.status || prev.status,
        confidence: Math.max(Number(prev.confidence) || 0, Number(rule.confidence) || 0),
        hypothesis: rule.hypothesis || prev.hypothesis,
        evidence: { ...(prev.evidence || {}), ...(rule.evidence || {}) },
      }
    } else {
      out.push({
        ...rule,
        hitCount: rule.hitCount || 1,
        createdAt: rule.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }
  return out
}
