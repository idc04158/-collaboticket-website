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

function seedLearnedRulesPath() {
  return path.join(process.cwd(), "content", "editorial", "learned-rules.json")
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
