#!/usr/bin/env node
/**
 * Deduplicate insight posts — unique angle per slug, no boilerplate B/D pairs.
 *
 * Usage:
 *   node scripts/dedup-insights.mjs --test japan-ec-keyword-map-2026
 *   node scripts/dedup-insights.mjs --all --resume
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { OPERATIONAL_DATA_RULES } from "./insight-operational-data-rules.mjs"
import { PUBLISH_ORDER } from "./insight-content-rules.mjs"
import {
  allowsFullPlatformTable,
  allowsMarketSizeTable,
  CANONICAL_HUBS,
  getAssignedCases,
  getNeighborAngles,
  getUniqueAngle,
} from "./insight-unique-angles.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const PROGRESS_FILE = path.join(__dirname, ".dedup-insights-progress.json")

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"
const DELAY_MS = Number(process.env.DEDUP_DELAY_MS || 3000)

function buildSystemPrompt(slug) {
  const cases = getAssignedCases(slug).join(", ")
  const neighbors = getNeighborAngles(slug, PUBLISH_ORDER)
    .map((n) => `- ${n.slug}: ${n.angle}`)
    .join("\n")

  return `You are CollaboTicket's insight editor. Rewrite the markdown body to eliminate duplication across 50 reports.

THIS ARTICLE'S UNIQUE FOCUS (only write about this):
${getUniqueAngle(slug)}

Assigned case study label(s) for INSIGHT (use ONLY these, not the generic B+D pair):
${cases}

${OPERATIONAL_DATA_RULES}

DEDUPLICATION RULES (critical):
1. Do NOT repeat content that belongs in canonical hub posts — link instead:
   - Market size / TAM / CAGR tables → only if slug is "${CANONICAL_HUBS.marketData}"; else 1 sentence + link [/insights/${CANONICAL_HUBS.marketData}]
   - Full Qoo10/Rakuten/Amazon/LINE role matrix → only if slug is "${CANONICAL_HUBS.platformRoles}"; else REPLACE "## 플랫폼별 역할 정리" with "## 다음 단계" and 2-3 sentences + link [/insights/${CANONICAL_HUBS.platformRoles}]
   - Generic FAQ (시장 규모?/어떤 플랫폼?/리뷰 왜 중요?) → only in "${CANONICAL_HUBS.faq}"; this post gets 4-5 TOPIC-SPECIFIC FAQs only
2. INSIGHT: ONE primary case study (max 2 if comparing platforms within THIS topic). Never use both "헤어케어 B + 스킨케어 D" template unless slug is "${CANONICAL_HUBS.kpiOps}".
3. FACT: stats relevant to THIS slug only — no copy-pasted 20조/30조 market paragraphs from other posts.
4. AI 30초 요약: bullets must reflect THIS article's unique angle, not generic EC intro.
5. ACTION / checklist / TIP: steps unique to this workflow — not generic "시장조사→현지화→물류→마케팅" unless this slug is an entry roadmap hub.
6. Keep 2+ markdown tables but tables must be TOPIC-SPECIFIC (not repeated platform role boilerplate).
7. Toss-style Korean (~합니다/~해요). Preserve ## heading order except "## 플랫폼별 역할 정리" may become "## 다음 단계".
8. Keep image markdown, References, internal links (2-3 natural links to related insights).
9. Do NOT add footer "For more insights" blocks.
10. MUST keep "## 실행 체크리스트" section with - [ ] items.
11. FAQ: exactly 4 or 5 questions — topic-specific only.

Neighbor posts — do NOT duplicate their angles:
${neighbors}

Output ONLY the full rewritten markdown body. No frontmatter. No code fences.`
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"))
  } catch {
    return { completed: [] }
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf8")
}

function listSlugs() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
}

function sortSlugs(slugs) {
  const order = new Map(PUBLISH_ORDER.map((s, i) => [s, i]))
  return [...slugs].sort((a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999))
}

function validateDedup(slug, body) {
  const issues = []
  if (body.length < 2000) issues.push("too short")

  const hasPlatformSection = /^##\s+플랫폼별 역할/m.test(body)
  const hasBothBD =
    /헤어케어\s*브랜드\s*B/.test(body) && /스킨케어\s*브랜드\s*D/.test(body)

  if (hasPlatformSection && !allowsFullPlatformTable(slug)) {
    const platformRows = (body.match(/Qoo10|Rakuten|Amazon|LINE/gi) || []).length
    if (platformRows >= 8) issues.push("full platform table remains")
  }

  if (hasBothBD && slug !== CANONICAL_HUBS.kpiOps && slug !== "japan-ec-market-trends-2026") {
    issues.push("generic B+D case pair")
  }

  if (!/^##\s+실행 체크리스트/m.test(body)) issues.push("missing checklist")

  const faqCount = (body.match(/^###\s+/gm) || []).length
  if (faqCount > 5) issues.push(`too many FAQs (${faqCount})`)
  if (faqCount < 3) issues.push(`too few FAQs (${faqCount})`)

  const marketTable = /(?:30조|20조|2\.5조|27\.1조)/.test(body)
  if (marketTable && !allowsMarketSizeTable(slug) && slug !== "japan-ec-market-trends-2026") {
    // soft warning only — many posts may mention once in link text
  }

  return issues
}

async function dedupBody(body, slug, title) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.35,
      max_tokens: 9000,
      messages: [
        { role: "system", content: buildSystemPrompt(slug) },
        { role: "user", content: `Slug: ${slug}\nTitle: ${title}\n\nRewrite to deduplicate:\n\n${body}` },
      ],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  let text = data.choices?.[0]?.message?.content?.trim() || ""
  return text.replace(/^```(?:markdown|md)?\n?/i, "").replace(/\n?```$/i, "").trim()
}

async function processSlug(slug, force = false) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  const deduped = await dedupBody(content.trim(), slug, data.title || slug)
  const issues = validateDedup(slug, deduped)
  if (issues.length > 0 && !force) throw new Error(issues.join(", "))
  if (issues.length > 0) console.warn(`  warn ${slug}: ${issues.join(", ")}`)
  fs.writeFileSync(filePath, matter.stringify(deduped, data), "utf8")
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set")
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const testSlug = args.includes("--test") ? args[args.indexOf("--test") + 1] : null
  const all = args.includes("--all")
  const resume = args.includes("--resume")
  const force = args.includes("--force")

  if (!testSlug && !all) {
    console.log("Usage: --test <slug> | --all [--resume]")
    process.exit(1)
  }

  const progress = resume ? loadProgress() : { completed: [] }
  let slugs = testSlug ? [testSlug] : sortSlugs(listSlugs())
  if (all && resume) slugs = slugs.filter((s) => !progress.completed.includes(s))

  console.log(`Deduplicating ${slugs.length} insight(s)...`)

  for (const slug of slugs) {
    try {
      await processSlug(slug, force)
      if (!testSlug) {
        progress.completed = [...new Set([...progress.completed, slug])]
        saveProgress(progress)
      }
      console.log(`✓ ${slug}`)
    } catch (err) {
      console.error(`✗ ${slug}: ${err.message}`)
      process.exitCode = 1
      if (testSlug) break
      continue
    }
    if (slugs.indexOf(slug) < slugs.length - 1) await sleep(DELAY_MS)
  }
}

main()
