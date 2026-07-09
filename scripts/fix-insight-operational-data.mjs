#!/usr/bin/env node
/**
 * Fix unrealistic operational metrics in insight INSIGHT sections.
 *
 * Usage:
 *   node scripts/fix-insight-operational-data.mjs --test qoo10-launch-checklist-30days
 *   node scripts/fix-insight-operational-data.mjs --all --resume
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { OPERATIONAL_DATA_RULES } from "./insight-operational-data-rules.mjs"
import { PUBLISH_ORDER } from "./insight-content-rules.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const PROGRESS_FILE = path.join(__dirname, ".fix-operational-data-progress.json")

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"
const DELAY_MS = Number(process.env.FIX_OPS_DELAY_MS || 2500)

const SYSTEM = `You are CollaboTicket's Japan EC data editor.

Fix ONLY operational/case-study metrics in insight markdown bodies to match the rules below.
Output the COMPLETE markdown body (no frontmatter). Preserve structure, headings, tables, links, tone (Toss-style ~합니다).

${OPERATIONAL_DATA_RULES}

What to fix:
- ## INSIGHT section and all case study bullets/tables within it
- ✓ bullets in ## AI 30초 요약 IF they cite CollaboTicket operational metrics (ROAS/CVR/CTR/reviews/ad spend)
- ## ACTION / ## 실무 TIP lines that repeat unrealistic operational numbers from the case studies
- Tables in INSIGHT with brand performance metrics

What NOT to change:
- ## FACT section third-party statistics (platform MAU, market size 兆, JETRO/METI cited figures)
- FAQ unless it states CollaboTicket operational case metrics
- References, image markdown, checklist items without metrics
- Platform visitor counts (e.g. LIPS 500万 visitors) in FACT tables

When rewriting case studies:
- Use 万엔 for ad spend (e.g. 35万엔, 52万엔) not millions unless 6+ month cumulative totals with clear label
- Show month progression in tables when multiple periods exist
- Keep 2+ distinct anonymized brands with platform-appropriate metrics

Output ONLY the full corrected markdown body. No code fences.`

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

function validateBody(original, next) {
  const issues = []
  const origHeadings = (original.match(/^##\s+.+$/gm) || []).join("|")
  const nextHeadings = (next.match(/^##\s+.+$/gm) || []).join("|")
  if (origHeadings !== nextHeadings) issues.push("headings changed")
  if (next.length < original.length * 0.7) issues.push("body too short")
  if (/첫.*30.*일.*2,?500|5,000,000엔|ROAS 600|CVR 1[0-9]%|CTR 1[0-9]%/.test(next)) {
    issues.push("still contains banned patterns")
  }
  return issues
}

async function fixBody(body, title) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.25,
      max_tokens: 8000,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Title: ${title}\n\nFix operational metrics in this markdown body:\n\n${body}` },
      ],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  let text = data.choices?.[0]?.message?.content?.trim() || ""
  return text.replace(/^```(?:markdown|md)?\n?/i, "").replace(/\n?```$/i, "").trim()
}

async function processSlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  const fixed = await fixBody(content.trim(), data.title || slug)
  const issues = validateBody(content.trim(), fixed)
  if (issues.length > 0) throw new Error(issues.join(", "))
  fs.writeFileSync(filePath, matter.stringify(fixed, data), "utf8")
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
  if (all && resume) slugs = slugs.filter((s) => !progress.completed.includes(s))

  console.log(`Fixing operational data in ${slugs.length} file(s)...`)

  for (const slug of slugs) {
    try {
      await processSlug(slug)
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
