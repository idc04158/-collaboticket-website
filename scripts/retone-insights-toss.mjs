#!/usr/bin/env node
/**
 * Retone insight markdown bodies to Toss-style Korean (~합니다 / ~했습니다 / ~해요).
 *
 * Usage:
 *   node scripts/retone-insights-toss.mjs --test japan-ec-keyword-map-2026
 *   node scripts/retone-insights-toss.mjs --all
 *   node scripts/retone-insights-toss.mjs --all --resume
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { PUBLISH_ORDER } from "./insight-content-rules.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const PROGRESS_FILE = path.join(__dirname, ".retone-toss-progress.json")

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"
const DELAY_MS = Number(process.env.RETONE_DELAY_MS || 2500)

const TONE_SYSTEM = `You are a Korean UX writer for CollaboTicket (Toss-style tone).

Rewrite ONLY the tone of insight report markdown bodies. Keep everything else identical.

Tone rules (Toss-style):
- Use polite, friendly Korean: ~합니다, ~됩니다, ~입니다, ~했습니다, ~해요, ~돼요
- NEVER use plain/formal report endings: ~한다, ~했다, ~된다, ~이다, ~하라, ~것이다
- NEVER use telegraphic nominals: ~함, ~됨, ~임, ~음 at sentence end
- Convert imperatives: ~하라 → ~해보세요 or ~하면 좋아요; ~하세요 → ~합니다 or ~해요
- Expand truncated bullets (✓ lines) into complete polite sentences with numbers preserved
- Expand ACTION noun-only fragments ("분석.") into full polite sentences ("분석합니다." or "분석해요.")
- FAQ answers: keep question headings unchanged; answers in ~합니다 / ~해요
- AI 30초 요약 bullets MUST stay as lines starting with ✓ (do not convert to numbered lists)
- Mix ~합니다 and ~해요 naturally (Toss: clear, warm, not stiff)

Hard constraints — DO NOT change:
- YAML frontmatter (you will not receive it)
- Markdown heading text and order (## / ###)
- Table rows, columns, numbers, percentages, yen amounts, source citations
- Internal links [text](/insights/slug)
- Image markdown ![](...)
- Checkbox checklist format: - [ ] item
- References section source names
- English product/platform names (Qoo10, Rakuten, Amazon, LINE, Buy Box, ROAS, etc.)

Output ONLY the rewritten markdown body. No code fences. No explanation.`

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
  const order = new Map(PUBLISH_ORDER.map((slug, index) => [slug, index]))
  return [...slugs].sort((a, b) => {
    const ai = order.has(a) ? order.get(a) : 999
    const bi = order.has(b) ? order.get(b) : 999
    if (ai !== bi) return ai - bi
    return a.localeCompare(b)
  })
}

async function retoneBody(body, title) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.35,
      max_tokens: 8000,
      messages: [
        { role: "system", content: TONE_SYSTEM },
        {
          role: "user",
          content: `Title: ${title}\n\nRetone this markdown body to Toss-style Korean:\n\n${body}`,
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI ${res.status}: ${err.slice(0, 400)}`)
  }

  const data = await res.json()
  let text = data.choices?.[0]?.message?.content?.trim() || ""
  text = text.replace(/^```(?:markdown|md)?\n?/i, "").replace(/\n?```$/i, "").trim()
  return text
}

function validateRetone(original, next) {
  const issues = []
  const origHeadings = (original.match(/^##\s+.+$/gm) || []).map((h) => h.trim())
  const nextHeadings = (next.match(/^##\s+.+$/gm) || []).map((h) => h.trim())
  if (origHeadings.join("|") !== nextHeadings.join("|")) {
    issues.push("headings changed")
  }
  const origTables = (original.match(/^\|.+\|$/gm) || []).length
  const nextTables = (next.match(/^\|.+\|$/gm) || []).length
  if (Math.abs(origTables - nextTables) > 2) {
    issues.push(`table rows ${origTables} -> ${nextTables}`)
  }
  const origLinks = (original.match(/\]\(\/insights\//g) || []).length
  const nextLinks = (next.match(/\]\(\/insights\//g) || []).length
  if (nextLinks < origLinks) {
    issues.push(`internal links ${origLinks} -> ${nextLinks}`)
  }
  if (next.length < original.length * 0.75) {
    issues.push(`body too short (${next.length} vs ${original.length})`)
  }
  return issues
}

function normalizeSummaryBullets(body) {
  return body.replace(/^##\s+AI 30초 요약\s*\n(?:([\s\S]*?))(?=\n##\s+|\n!\[)/m, (_full, section) => {
    const lines = section.split("\n").map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return line
      if (trimmed.startsWith("✓")) return line
      const numbered = trimmed.match(/^\d+\.\s+(.*)$/)
      if (numbered) return `✓ ${numbered[1]}`
      if (trimmed.startsWith("- ")) return `✓ ${trimmed.slice(2)}`
      return line
    })
    return `## AI 30초 요약\n${lines.join("\n")}`
  })
}

async function processSlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  const retuned = normalizeSummaryBullets(await retoneBody(content.trim(), data.title || slug))
  const issues = validateRetone(content.trim(), retuned)
  if (issues.length > 0) {
    throw new Error(`validation failed: ${issues.join(", ")}`)
  }
  const output = matter.stringify(retuned, data)
  fs.writeFileSync(filePath, output, "utf8")
  return retuned.length
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

  if (!testSlug && !all) {
    console.log("Usage: --test <slug> | --all [--resume]")
    process.exit(1)
  }

  const progress = resume ? loadProgress() : { completed: [] }
  let slugs = testSlug ? [testSlug] : sortSlugs(listSlugs())
  if (all && resume) {
    slugs = slugs.filter((slug) => !progress.completed.includes(slug))
  }

  console.log(`Retoning ${slugs.length} insight(s) with ${MODEL}...`)

  for (const slug of slugs) {
    try {
      const chars = await processSlug(slug)
      if (!testSlug) {
        progress.completed = [...new Set([...progress.completed, slug])]
        saveProgress(progress)
      }
      console.log(`✓ ${slug} (${chars} chars)`)
    } catch (err) {
      console.error(`✗ ${slug}: ${err.message}`)
      process.exitCode = 1
      if (testSlug) break
      continue
    }
    if (slugs.indexOf(slug) < slugs.length - 1) {
      await sleep(DELAY_MS)
    }
  }
}

main()
