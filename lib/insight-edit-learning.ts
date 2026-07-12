import {
  appendEditSession,
  buildLearnedRulesPrompt,
  loadLearnedRulesStore,
  mergeLearnedRules,
  saveLearnedRulesStore,
  writeEditorialLocalBackup,
} from "@/lib/insight-learned-rules.mjs"

type LearnedRule = {
  id: string
  rule: string
  hypothesis?: string
  status: "proposed" | "verified" | "active" | "rejected"
  confidence?: number
  createdAt?: string
  updatedAt?: string
  hitCount?: number
  evidence?: {
    slug?: string
    instruction?: string
    summary?: string
    sessionId?: string
  }
}

export type LearnFromEditInput = {
  slug: string
  title?: string
  instruction: string
  summary?: string
  before: string
  after: string
  chat?: Array<{ role: string; content: string }>
}

export type EditorialBackupPayload = {
  kind: "collaboticket-editorial-backup"
  version: 1
  at: string
  sessionId: string
  slug: string
  title?: string
  instruction: string
  summary?: string
  chat?: Array<{ role: string; content: string }>
  before: string
  after: string
  added: LearnedRule[]
  rulesStore: { version: number; updatedAt: string | null; rules: LearnedRule[] }
  ephemeral: boolean
  localBackupFiles?: string[]
}

export type LearnFromEditResult = {
  sessionId: string
  added: LearnedRule[]
  storePersisted: boolean
  ephemeral: boolean
  message: string
  backup: EditorialBackupPayload
  localBackupFiles: string[]
}

function excerpt(text: string, max = 3500) {
  const t = text || ""
  if (t.length <= max) return t
  return `${t.slice(0, max)}\n\n…(생략 ${t.length - max}자)`
}

function slugifyRuleId(rule: string) {
  const base = rule
    .replace(/[^\w가-힣]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
    .toLowerCase()
  return `learned-${base || "rule"}-${Date.now().toString(36)}`
}

async function callJsonModel(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages,
    }),
  })
  if (!res.ok) return null
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const raw = data.choices?.[0]?.message?.content
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

type ExtractedCandidate = {
  rule: string
  hypothesis: string
  confidence: number
}

async function extractRuleHypotheses(input: LearnFromEditInput): Promise<ExtractedCandidate[]> {
  const parsed = await callJsonModel([
    {
      role: "system",
      content: `You turn accepted blog edit diffs into reusable editorial RULES for CollaboTicket (Japan EC consulting, Korean B2B insights).

Output JSON only:
{
  "rules": [
    {
      "rule": "구체적 작성/편집 규칙 한 문장 (한국어, 명령형)",
      "hypothesis": "왜 이 규칙이 맞는지 한 문장 가설",
      "confidence": 0.0
    }
  ]
}

Rules:
- 1~5 rules max. Prefer generalizable patterns over one-off slug facts.
- Do NOT invent market statistics rules.
- Skip pure typos unless they reveal a recurring pattern.
- rule must be actionable for the NEXT article (not "이 글에서 X 삭제").
- confidence 0~1.`,
    },
    {
      role: "user",
      content: [
        `slug: ${input.slug}`,
        `title: ${input.title || ""}`,
        `editor instruction: ${input.instruction}`,
        `change summary: ${input.summary || "(없음)"}`,
        "",
        "BEFORE markdown excerpt:",
        excerpt(input.before),
        "",
        "AFTER markdown excerpt:",
        excerpt(input.after),
      ].join("\n"),
    },
  ])

  const rows = Array.isArray(parsed?.rules) ? parsed.rules : []
  const out: ExtractedCandidate[] = []
  for (const row of rows) {
    if (!row || typeof row !== "object") continue
    const item = row as Record<string, unknown>
    const rule = typeof item.rule === "string" ? item.rule.trim() : ""
    if (!rule) continue
    out.push({
      rule,
      hypothesis: typeof item.hypothesis === "string" ? item.hypothesis.trim() : "",
      confidence: Math.min(1, Math.max(0, Number(item.confidence) || 0.5)),
    })
  }
  return out
}

async function verifyRulesAgainstDiff(
  input: LearnFromEditInput,
  candidates: ExtractedCandidate[],
): Promise<ExtractedCandidate[]> {
  if (candidates.length === 0) return []

  const parsed = await callJsonModel([
    {
      role: "system",
      content: `Verify whether AFTER better satisfies each hypothesized editorial rule than BEFORE.

Output JSON:
{
  "results": [
    { "rule": "...", "pass": true, "confidence": 0.0, "note": "한 줄" }
  ]
}
Only keep rules that are supported by the diff (pass=true). Drop vague or unsupported rules.`,
    },
    {
      role: "user",
      content: [
        `instruction: ${input.instruction}`,
        `summary: ${input.summary || ""}`,
        `candidates:\n${candidates.map((c, i) => `${i + 1}. ${c.rule}`).join("\n")}`,
        "",
        "BEFORE excerpt:",
        excerpt(input.before, 2500),
        "",
        "AFTER excerpt:",
        excerpt(input.after, 2500),
      ].join("\n"),
    },
  ])

  const results = Array.isArray(parsed?.results) ? parsed.results : []
  const kept: ExtractedCandidate[] = []
  for (const row of results) {
    if (!row || typeof row !== "object") continue
    const item = row as Record<string, unknown>
    if (item.pass !== true) continue
    const ruleText = typeof item.rule === "string" ? item.rule.trim() : ""
    const match =
      candidates.find((c) => c.rule === ruleText) ||
      candidates.find((c) => ruleText && c.rule.includes(ruleText)) ||
      candidates.find((c) => ruleText && ruleText.includes(c.rule))
    if (!match) continue
    kept.push({
      ...match,
      confidence: Math.min(
        1,
        Math.max(match.confidence, Number(item.confidence) || match.confidence),
      ),
    })
  }

  // If verifier failed soft, keep high-confidence extracts
  if (kept.length === 0) {
    return candidates.filter((c) => c.confidence >= 0.7).slice(0, 3)
  }
  return kept
}

export async function learnFromAcceptedEdit(input: LearnFromEditInput): Promise<LearnFromEditResult> {
  const sessionId = `edit-${Date.now().toString(36)}`
  const ephemeral = Boolean(process.env.VERCEL) && !process.env.EDITORIAL_LEARNING_PATH
  const now = new Date().toISOString()

  const emptyBackup = async (
    added: LearnedRule[],
    message: string,
    storePersisted: boolean,
  ): Promise<LearnFromEditResult> => {
    const store = await loadLearnedRulesStore()
    const backup: EditorialBackupPayload = {
      kind: "collaboticket-editorial-backup",
      version: 1,
      at: now,
      sessionId,
      slug: input.slug,
      title: input.title,
      instruction: input.instruction,
      summary: input.summary,
      chat: input.chat,
      before: input.before,
      after: input.after,
      added,
      rulesStore: store,
      ephemeral,
    }
    const local = await writeEditorialLocalBackup(backup)
    backup.localBackupFiles = local.written
    return {
      sessionId,
      added,
      storePersisted,
      ephemeral,
      message,
      backup,
      localBackupFiles: local.written,
    }
  }

  if (!input.before.trim() || !input.after.trim() || input.before === input.after) {
    return emptyBackup([], "변경 내용이 없어 학습을 건너뛰었습니다.", false)
  }

  const extracted = await extractRuleHypotheses(input)
  const verified = await verifyRulesAgainstDiff(input, extracted)

  const learned: LearnedRule[] = verified.map((item) => ({
    id: slugifyRuleId(item.rule),
    rule: item.rule,
    hypothesis: item.hypothesis,
    status: "active" as const,
    confidence: item.confidence,
    createdAt: now,
    updatedAt: now,
    hitCount: 1,
    evidence: {
      slug: input.slug,
      instruction: input.instruction.slice(0, 400),
      summary: (input.summary || "").slice(0, 600),
      sessionId,
    },
  }))

  await appendEditSession({
    id: sessionId,
    at: now,
    slug: input.slug,
    instruction: input.instruction.slice(0, 500),
    summary: (input.summary || "").slice(0, 800),
    beforeChars: input.before.length,
    afterChars: input.after.length,
    chatTurns: (input.chat || []).length,
    ruleIds: learned.map((r) => r.id),
    ephemeral,
  })

  if (learned.length === 0) {
    const result = await emptyBackup(
      [],
      "세션은 기록했지만, 재사용 가능한 규칙으로 승격할 패턴은 없었습니다.",
      true,
    )
    if (result.localBackupFiles.length) {
      result.message += ` 로컬 백업: ${result.localBackupFiles[0]}`
    } else {
      result.message += " 브라우저로 백업 파일을 자동 저장합니다."
    }
    return result
  }

  const store = await loadLearnedRulesStore()
  const merged = mergeLearnedRules(store.rules, learned)
  const saved = await saveLearnedRulesStore({ ...store, rules: merged })

  const backup: EditorialBackupPayload = {
    kind: "collaboticket-editorial-backup",
    version: 1,
    at: now,
    sessionId,
    slug: input.slug,
    title: input.title,
    instruction: input.instruction,
    summary: input.summary,
    chat: input.chat,
    before: input.before,
    after: input.after,
    added: learned,
    rulesStore: saved,
    ephemeral,
  }
  const local = await writeEditorialLocalBackup(backup)
  backup.localBackupFiles = local.written

  let message = ephemeral
    ? `규칙 ${learned.length}개를 학습했습니다. 서버 저장은 휘발될 수 있어 로컬/브라우저 백업을 남깁니다.`
    : `규칙 ${learned.length}개를 학습·검증 후 learned-rules에 반영했습니다.`

  if (local.written.length) {
    message += ` 로컬 백업 ${local.written.length}건 저장.`
  } else {
    message += " 브라우저 다운로드로 백업합니다."
  }

  return {
    sessionId,
    added: learned,
    storePersisted: true,
    ephemeral,
    message,
    backup,
    localBackupFiles: local.written,
  }
}

export { buildLearnedRulesPrompt, loadLearnedRulesStore }
