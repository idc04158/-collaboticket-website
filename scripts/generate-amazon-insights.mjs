#!/usr/bin/env node
/**
 * CollaboTicket Insight Engine v2 — Amazon Japan consulting insights.
 * Body model is locked to GPT-5.5 (never gpt-4o).
 *
 * Usage:
 *   node scripts/generate-amazon-insights.mjs
 *   node scripts/generate-amazon-insights.mjs --resume
 *   node scripts/generate-amazon-insights.mjs --force
 *   node scripts/generate-amazon-insights.mjs --test amazon-japan-search-ranking-2026-jul
 *   node scripts/generate-amazon-insights.mjs --dry-run
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { imageForIndex } from "./insight-images.mjs"
import { PUBLISH_ORDER, pickRelatedSlugs } from "./insight-content-rules.mjs"
import { normalizeInsightKorean } from "../lib/insight-language-rules.mjs"
import {
  buildInsightArticlePrompt,
  buildInsightResponsesPayload,
  INSIGHT_ENGINE_VERSION,
  resolveInsightBodyModel,
} from "../lib/ai/prompts/prompt-builder.mjs"
import { bodyHasSection } from "../lib/insight-sections.mjs"
import { saveSeenSlugs } from "./select-amazon-topics.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const MANIFEST = path.join(__dirname, "amazon-news-manifest.json")
const RAW_NEWS = path.join(__dirname, "amazon-news-raw.json")
const PROGRESS = path.join(__dirname, ".amazon-insights-progress.json")
const ANGLES_PATCH = path.join(__dirname, "amazon-unique-angles.json")

const MODEL = resolveInsightBodyModel()
const DELAY_MS = Number(process.env.AMAZON_INSIGHT_DELAY_MS || 6000)
const MIN_BODY_CHARS = Number(process.env.AMAZON_INSIGHT_MIN_CHARS || 3800)
const REASONING_EFFORT = process.env.INSIGHT_REASONING_EFFORT || "high"

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS, "utf8"))
  } catch {
    return { completed: [] }
  }
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2), "utf8")
}

function extractResponseText(data) {
  let text = ""
  for (const item of data.output || []) {
    if (item.type === "message") {
      for (const part of item.content || []) {
        if (part.type === "output_text" && part.text) text += part.text
      }
    }
  }
  return text.trim()
}

function sanitizeBody(body) {
  return normalizeInsightKorean(
    body
      .replace(/^---[\s\S]*?---\n+/m, "")
      .replace(/^```(?:markdown)?\n?/m, "")
      .replace(/\n?```\s*$/m, "")
      .replace(/^#\s+.+\n+/m, "")
      .replace(/^##\s+AI 30초 요약[\s\S]*?(?=\n##\s+)/m, "")
      .replace(/^##\s+FACT:[\s\S]*?(?=\n##\s+)/m, "")
      .replace(/^##\s+INSIGHT:[\s\S]*?(?=\n##\s+)/m, "")
      .replace(/^##\s+ACTION:[\s\S]*?(?=\n##\s+)/m, "")
      .trim(),
  )
}

function loadNewsSeeds(item, limit = 4) {
  try {
    if (!fs.existsSync(RAW_NEWS)) return []
    const raw = JSON.parse(fs.readFileSync(RAW_NEWS, "utf8"))
    const articles = raw.articles || []
    const keywords = [
      ...(item.tags || []),
      item.slugBase || "",
      item.title || "",
      item.angle || "",
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9가-힣ァ-ンぁ-ん一-龯]+/)
      .filter((t) => t.length > 2)

    const scored = articles
      .map((a) => {
        const text = `${a.title || ""} ${a.snippet || ""}`.toLowerCase()
        let score = 0
        for (const kw of keywords) {
          if (text.includes(kw.toLowerCase())) score += 1
        }
        if (/amazon|アマゾン|amazon\.co\.jp/.test(text)) score += 0.5
        return { a, score }
      })
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, limit)
      .map((x) => x.a)

    return scored
  } catch {
    return []
  }
}

function requiredSectionsPresent(body) {
  const needed = ["conclusion", "why", "practice", "checklist", "faq", "insight", "cta"]
  return needed.every((id) => bodyHasSection(body, id))
}

function hasInventedOpsTable(body) {
  // Block common fake KPI progression tables from old template
  return /\|\s*월\s*\|\s*리뷰/.test(body) || /\|\s*1개월\s*차\s*\|/.test(body)
}

function buildPrompt(item, relatedSlugs) {
  return buildInsightArticlePrompt({
    item,
    relatedSlugs,
    newsSeeds: loadNewsSeeds(item),
  })
}

async function callResponses(prompt, { withReasoning = true } = {}) {
  const payload = buildInsightResponsesPayload({
    model: MODEL,
    prompt,
    reasoningEffort: withReasoning ? REASONING_EFFORT : null,
  })
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) {
    const msg = data.error?.message || `OpenAI ${res.status}`
    // If reasoning option unsupported, retry once without it.
    if (withReasoning && /reasoning|effort|unsupported|unknown/i.test(msg)) {
      console.warn(`  reasoning unsupported (${msg}) — retrying without reasoning`)
      return callResponses(prompt, { withReasoning: false })
    }
    throw new Error(msg)
  }
  return sanitizeBody(extractResponseText(data))
}

async function callOpenAI(prompt) {
  return callResponses(prompt, { withReasoning: true })
}

function fixInternalLinks(body) {
  return body
    .replace(/\]\(https?:\/\/example\.com[^)]*\)/gi, "](/contact?topic=diagnosis)")
    .replace(/\]\(https?:\/\/[^)]*\/insights\/([a-z0-9-]+)\/?\)/gi, "](/insights/$1)")
    .replace(/\]\(https?:\/\/[^)]*\/contact\/?[^)]*\)/gi, "](/contact?topic=diagnosis)")
}

async function generateBody(item, relatedSlugs) {
  let body = fixInternalLinks(await callOpenAI(buildPrompt(item, relatedSlugs)))
  const needsRetry =
    body.length < MIN_BODY_CHARS || !requiredSectionsPresent(body) || hasInventedOpsTable(body)

  if (needsRetry) {
    console.warn(
      `  retry (len=${body.length}, sections=${requiredSectionsPresent(body)}, fakeTable=${hasInventedOpsTable(body)})…`,
    )
    const expandPrompt = `${buildPrompt(item, relatedSlugs)}

---
이전 초고에 문제가 있다. Insight Engine v2 기준으로 다시 작성하라.
- 필수 섹션 누락 금지 (결론 / 왜 중요한가 / 실무에서는 어떻게 보는가 / 체크리스트 / FAQ / 실무에서 자주 보는 사례 / 다음 단계). 헤딩에 CTA·Insight 금지.
- 가짜 운영 KPI 표·존재하지 않는 사례 삭제
- FAQ 각 답변 200자 이상
- 본문 ${MIN_BODY_CHARS}자 이상
- 뉴스 요약·FACT/INSIGHT/ACTION·한 줄 나열 문체 금지
- AI처럼 보이지 않게, CollaboTicket만 말할 수 있는 실무 관점으로

이전 초고:
${body}`
    body = fixInternalLinks(await callOpenAI(expandPrompt))
  }
  return body
}

async function generateDescription(title, body) {
  const conclusion =
    body.match(/##\s+결론[^\n]*\n+([\s\S]*?)(?=\n##\s+)/)?.[1]?.trim().slice(0, 500) ||
    body.slice(0, 500)
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content: `CollaboTicket Insight Engine v2 카드용 description.
규칙: 한국어 1문장, 90자 내외, 답이 먼저, 가짜 숫자 금지, 상담 톤, 일반론 금지.
제목: ${title}
결론 초고:
${conclusion}`,
        },
      ],
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim()
}

function writeAnglesPatch(items) {
  let prev = { UNIQUE_ANGLES: {}, ASSIGNED_CASE_LABELS: {} }
  try {
    if (fs.existsSync(ANGLES_PATCH)) prev = JSON.parse(fs.readFileSync(ANGLES_PATCH, "utf8"))
  } catch {
    /* ignore */
  }
  const angles = { ...(prev.UNIQUE_ANGLES || {}) }
  const cases = { ...(prev.ASSIGNED_CASE_LABELS || {}) }
  for (const item of items) {
    angles[item.slug] = item.angle
    cases[item.slug] = [`${item.brandType} 브랜드`]
  }
  fs.writeFileSync(
    ANGLES_PATCH,
    JSON.stringify({ UNIQUE_ANGLES: angles, ASSIGNED_CASE_LABELS: cases }, null, 2),
    "utf8",
  )
  console.log(`Wrote angles patch → ${ANGLES_PATCH}`)
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")
  const resume = process.argv.includes("--resume")
  const force = process.argv.includes("--force")
  const testSlug = process.argv.includes("--test")
    ? process.argv[process.argv.indexOf("--test") + 1]
    : null

  if (!dryRun && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY required (or use --dry-run)")
  }

  console.log(`Insight Engine ${INSIGHT_ENGINE_VERSION} · body model=${MODEL}`)

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  const items = testSlug
    ? manifest.items.filter((m) => m.slug === testSlug)
    : manifest.items
  if (items.length === 0) throw new Error(testSlug ? `No manifest item for ${testSlug}` : "Empty manifest")

  if (!dryRun) writeAnglesPatch(manifest.items)

  const progress = resume && !force ? loadProgress() : { completed: [] }
  if (force && !testSlug) saveProgress({ completed: [] })
  const blogSlugs = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
  const allSlugs = [...new Set([...PUBLISH_ORDER, ...blogSlugs, ...manifest.items.map((m) => m.slug)])]

  const written = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (progress.completed.includes(item.slug) && !testSlug) {
      console.log(`skip (done): ${item.slug}`)
      continue
    }

    const outPath = path.join(BLOG_DIR, `${item.slug}.md`)
    if (fs.existsSync(outPath) && !testSlug && resume) {
      console.log(`skip (exists): ${item.slug}`)
      progress.completed.push(item.slug)
      saveProgress(progress)
      continue
    }

    const relatedSlugs = pickRelatedSlugs(item.slug, allSlugs)
    const imageIndex = PUBLISH_ORDER.length + i + (manifest.mode === "weekly" ? 200 : 120)
    const image = imageForIndex(imageIndex)

    if (dryRun) {
      console.log(`[dry-run] would write ${item.slug} date=${item.date}`)
      written.push(item.slug)
      continue
    }

    console.log(`rewriting(AEO): ${item.slug}`)
    const body = await generateBody(item, relatedSlugs)
    const description = (await generateDescription(item.title, body)) || item.title

    const frontmatter = {
      title: item.title,
      description,
      category: item.category,
      tags: item.tags,
      date: item.date,
      image,
    }

    const cleanedBody = body.replace(/!\[[^\]]*\]\([^)]*IMAGE_PLACEHOLDER[^)]*\)\n*/g, "")
    fs.writeFileSync(outPath, matter.stringify(cleanedBody, frontmatter), "utf8")
    console.log(`write: ${outPath} (${cleanedBody.length} chars) date=${item.date}`)

    progress.completed.push(item.slug)
    written.push(item.slug)
    saveProgress(progress)

    if (i < items.length - 1) await sleep(DELAY_MS)
  }

  if (written.length) saveSeenSlugs(written)
  console.log(`Done. wrote=${written.length}`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
