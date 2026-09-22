#!/usr/bin/env node
/**
 * Import Poomgo Japan e-commerce topics → CollaboTicket insight reports (rewritten).
 *
 * Usage:
 *   node scripts/import-poomgo-insights.mjs
 *   node scripts/import-poomgo-insights.mjs --test japan-tiktok-shop-entry-ops
 *   node scripts/import-poomgo-insights.mjs --resume
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { imageForIndex } from "./insight-images.mjs"
import {
  assignPublishDate,
  buildArticlePrompt,
  PUBLISH_ORDER,
  pickRelatedSlugs,
} from "./insight-content-rules.mjs"
import { normalizeInsightKorean } from "../lib/insight-language-rules.mjs"
import { getUniqueAngle } from "./insight-unique-angles.mjs"
import {
  buildInsightResponsesPayload,
  resolveInsightBodyModel,
} from "../lib/ai/prompts/prompt-builder.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const MANIFEST = path.join(__dirname, "poomgo-import-manifest.json")
const POOMGO_JSON = path.join(__dirname, "poomgo-japan-articles.json")
const PROGRESS = path.join(__dirname, ".poomgo-import-progress.json")

const MODEL = resolveInsightBodyModel(process.env.OPENAI_MODEL)
const DELAY_MS = Number(process.env.POOMGO_IMPORT_DELAY_MS || 5000)

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
      .trim(),
  )
}

function buildPoomgoPrompt(item, poomgoMeta, publishDate, relatedSlugs) {
  const sourceBrief = `SOURCE BRIEF (Poomgo logistics blog — DO NOT copy sentences; topic reference only):
- Original title: ${poomgoMeta?.title || item.title}
- Original summary: ${poomgoMeta?.description || ""}
- CollaboTicket rewrite note: ${item.sourceNote || ""}
- Source URL (reference only, do not link): ${poomgoMeta?.url || ""}

CRITICAL angle shift:
- Poomgo audience = fulfillment buyers. CollaboTicket audience = brand EC/marketing operators.
- Replace "use our fulfillment" with channel / conversion / PDP / CRM / ad ops advice.
- Never pitch 품고, Poomgo, or other fulfillment vendors.
- Logistics only when it affects CVR, ROAS, or trust — keep brief.`

  return buildArticlePrompt({
    meta: {
      slug: item.slug,
      title: item.title,
      category: item.category || "물류·운영",
      tags: item.tags || [],
    },
    publishDate,
    relatedSlugs,
    existingExcerpt: "(없음 — 소스 브리프만으로 Insight Engine v2 구조로 작성)",
    sourceBrief,
    uniqueAngle: getUniqueAngle(item.slug),
  })
}

async function generateBody(item, poomgoMeta, publishDate, relatedSlugs) {
  const prompt = buildPoomgoPrompt(item, poomgoMeta, publishDate, relatedSlugs)

  const payload = buildInsightResponsesPayload({
    model: MODEL,
    prompt,
    reasoningEffort: process.env.INSIGHT_REASONING_EFFORT || "high",
  })
  let res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  let data = await res.json()
  if (!res.ok && /reasoning|effort|unsupported|unknown/i.test(data.error?.message || "")) {
    res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildInsightResponsesPayload({ model: MODEL, prompt, reasoningEffort: null })),
    })
    data = await res.json()
  }
  if (!res.ok) throw new Error(data.error?.message || `OpenAI ${res.status}`)
  return sanitizeBody(extractResponseText(data))
}

async function generateDescription(title, body) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `CollaboTicket 인사이트 카드용 description 1문장(100자 내, 숫자 1개, 한국어, ~합니다):\n제목: ${title}\n${body.slice(0, 600)}`,
        },
      ],
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim()
}

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY required")

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  const poomgoArticles = JSON.parse(fs.readFileSync(POOMGO_JSON, "utf8")).articles
  const poomgoBySlug = Object.fromEntries(poomgoArticles.map((a) => [a.slug, a]))

  const testSlug = process.argv.includes("--test") ? process.argv[process.argv.indexOf("--test") + 1] : null
  const resume = process.argv.includes("--resume")
  const progress = resume ? loadProgress() : { completed: [] }

  const allSlugs = [
    ...PUBLISH_ORDER,
    ...manifest.map((m) => m.slug).filter((s) => !PUBLISH_ORDER.includes(s)),
  ]

  const items = testSlug ? manifest.filter((m) => m.slug === testSlug) : manifest
  if (items.length === 0) throw new Error(`No manifest item for slug ${testSlug}`)

  const baseIndex = PUBLISH_ORDER.length

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (progress.completed.includes(item.slug) && !testSlug) {
      console.log(`skip (done): ${item.slug}`)
      continue
    }

    const poomgoMeta = poomgoBySlug[item.poomgoSlug]
    const orderIndex = baseIndex + manifest.findIndex((m) => m.slug === item.slug)
    const publishDate = assignPublishDate(orderIndex)
    const relatedSlugs = pickRelatedSlugs(item.slug, allSlugs)
    const image = imageForIndex(orderIndex)

    console.log(`rewriting: ${item.slug} ← poomgo/${item.poomgoSlug}`)
    const body = await generateBody(item, poomgoMeta, publishDate, relatedSlugs)
    const description = (await generateDescription(item.title, body)) || item.title

    const frontmatter = {
      title: item.title,
      description,
      category: item.category,
      tags: item.tags,
      date: publishDate,
      image,
    }

    const outPath = path.join(BLOG_DIR, `${item.slug}.md`)
    fs.writeFileSync(outPath, matter.stringify(body, frontmatter), "utf8")
    console.log(`write: ${outPath} (${body.length} chars)`)

    progress.completed.push(item.slug)
    saveProgress(progress)

    if (i < items.length - 1) await sleep(DELAY_MS)
  }

  console.log("Done.")
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
