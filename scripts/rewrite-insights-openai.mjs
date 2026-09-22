#!/usr/bin/env node
/**
 * Rewrite insight posts as CollaboTicket v2 operational reports.
 *
 * Usage:
 *   node scripts/rewrite-insights-openai.mjs --test japan-ec-kpi-dashboard
 *   node scripts/rewrite-insights-openai.mjs --all --resume
 *   node scripts/rewrite-insights-openai.mjs --all --limit 3
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { imageForIndex, INSIGHT_IMAGES } from "./insight-images.mjs"
import {
  assignPublishDate,
  buildArticlePrompt,
  CONTENT_RULES_VERSION,
  pickRelatedSlugs,
  PUBLISH_ORDER,
  sortPostsByPublishOrder,
} from "./insight-content-rules.mjs"
import { normalizeInsightKorean } from "../lib/insight-language-rules.mjs"
import { fixMarkdownHygiene } from "../lib/insight-markdown-hygiene.mjs"
import {
  buildInsightResponsesPayload,
  resolveInsightBodyModel,
} from "../lib/ai/prompts/prompt-builder.mjs"
import {
  bodyHasSection,
  getInsightSection,
  sectionAliases,
  sectionHeadingRegex,
} from "../lib/insight-sections.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const PROGRESS_FILE = path.join(__dirname, ".rewrite-progress-v2.json")

const MODEL = resolveInsightBodyModel(process.env.OPENAI_MODEL)
const DELAY_MS = Number(process.env.REWRITE_DELAY_MS || 4000)
const MIN_BODY_CHARS = Number(process.env.REWRITE_MIN_CHARS || 2800)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"))
  } catch {
    return { version: CONTENT_RULES_VERSION, completed: [] }
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf8")
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

function sanitizeGeneratedBody(body) {
  let cleaned = body
  cleaned = cleaned.replace(/^---[\s\S]*?---\n+/m, "").trim()
  cleaned = cleaned.replace(/^\s*\{"description"\s*:\s*"[\s\S]*?"\}\s*$/gm, "")
  cleaned = cleaned.replace(/^\s*\{"description"\s*:\s*"[^\n]*$/gm, "")
  cleaned = cleaned.replace(/^<aside[\s\S]*?<\/aside>\s*$/gm, "")
  cleaned = cleaned.replace(/^<script[\s\S]*?<\/script>\s*$/gm, "")
  return normalizeInsightKorean(fixMarkdownHygiene(cleaned.trim()))
}

function countFaqItems(body) {
  const start = body.search(/^##\s+(?:FAQ|자주\s*묻는\s*질문)/m)
  if (start < 0) return 0

  const tail = body.slice(start)
  const end = tail.search(/\n##\s+(?:References|관련 리포트)/m)
  const section = end >= 0 ? tail.slice(0, end) : tail

  const h3 = (section.match(/^###\s+/gm) || []).length
  const qMarks = (section.match(/^###\s+.+\?/gm) || []).length
  const bullets = (section.match(/^[-*]\s+.+\?/gm) || []).length
  return Math.max(h3, qMarks, bullets)
}

function buildFaqBlock(topic) {
  return `### ${topic}을 시작하기에 적합한 브랜드 규모는?
연 매출 5억~50억 원, SKU 3~15개, 월 마케팅 예산 300~800만 원 이상이면 4주 파일럿 테스트가 가능합니다.

### Qoo10과 Rakuten 중 어디부터 시작해야 하나요?
리뷰·프로모션 테스트는 Qoo10, SEO·재구매 설계는 Rakuten을 우선 검토합니다. 예산 500만 원 이하라면 Qoo10 단일 채널 30일 테스트를 권장합니다.

### 일본 진출 초기에 필요한 리뷰 수는?
카테고리별로 다르지만, CollaboTicket 운영 데이터 기준 전환율 변곡점은 보통 20~40개 구간에서 나타납니다.

### 광고는 언제 켜야 하나요?
상세페이지·배송 SLA·CS 매크로가 준비된 뒤, 리뷰 10개 이상 확보 후 소액(월 20~30만 엔)으로 CTR/CVR을 먼저 검증합니다.

### 메가와리는 몇 주 전 준비해야 하나요?
재고·가격·쿠폰·크리에이티브·리뷰 확보 기준 최소 6~8주 전 시뮬레이션을 권장합니다.

### Amazon Japan FBA는 언제 도입하나요?
SKU 1~2개에서 전환율 2% 이상, 반품률 5% 이하가 4주 유지될 때 FBA 전환을 검토합니다.

### 무료 진단에서 무엇을 확인하나요?
현재 SKU, 판매가, 목표 플랫폼, 월 예산만으로 1차 진입 채널·리스크·90일 로드맵 초안을 제공합니다.`
}

function escapeHeadingAlias(alias) {
  return alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*")
}

function ensureMinimumFaq(body, meta) {
  if (countFaqItems(body) >= 4) return body

  const topic = meta.title.replace(/^\d+\.\s*/, "")
  const block = buildFaqBlock(topic)
  const faqDisplay = getInsightSection("faq").display
  const faqAliases = sectionAliases(getInsightSection("faq")).map(escapeHeadingAlias).join("|")
  const afterFaqAliases = ["insight", "cta", "references"]
    .flatMap((id) => sectionAliases(getInsightSection(id)))
    .map(escapeHeadingAlias)
    .join("|")

  let next = body.replace(
    new RegExp(
      `^##\\s+(?:${faqAliases})[\\s\\S]*?(?=\\n##\\s+(?:${afterFaqAliases})|\\n*$)`,
      "m",
    ),
    "",
  )

  const insightRe = sectionHeadingRegex("insight", "m")
  if (insightRe.test(next)) {
    return next.replace(
      insightRe,
      `## ${faqDisplay}\n${block}\n\n## ${getInsightSection("insight").display}`,
    )
  }
  const refRe = sectionHeadingRegex("references", "m")
  if (refRe.test(next)) {
    return next.replace(
      refRe,
      `## ${faqDisplay}\n${block}\n\n## ${getInsightSection("references").display}`,
    )
  }
  return `${next.trim()}\n\n## ${faqDisplay}\n${block}\n`
}

function slugToLinkLabel(slug) {
  const labels = {
    "japan-ecommerce-2025": "2025 일본 이커머스 시장",
    "japan-ec-market-trends-2026": "2026 일본 EC 트렌드",
    "qoo10-megawari-prep-plan": "Qoo10 메가와리 준비",
    "qoo10-megawari-live-commerce-strategy": "Qoo10 메가와리 라이브커머스",
    "qoo10-launch-checklist-30days": "Qoo10 30일 런칭",
    "rakuten-seo-title-structure": "Rakuten SEO 상품명",
    "rakuten-super-sale-ops": "Rakuten 슈퍼세일 운영",
    "rakuten-vs-amazon": "Rakuten vs Amazon",
    "amazon-japan-fba-onboarding": "Amazon Japan FBA",
    "amazon-japan-review-velocity": "Amazon Japan 리뷰",
    "japan-review-structure": "일본 리뷰 구조",
    "cosme-lips-review-operations": "@cosme·LIPS 리뷰",
    "line-official-account-funnel": "LINE 공식계정 퍼널",
    "line-x-crm-fan-marketing-japan": "LINE·X CRM",
    "japan-ec-kpi-dashboard": "일본 EC KPI 대시보드",
    "kbeauty-japan-entry-roadmap": "K-Beauty 일본 진출",
    "search-to-conversion-flow-japan": "검색→전환 흐름",
    "fba-vs-3pl-japan": "FBA vs 3PL",
    "ai-shopping-commerce-japan-2026": "AI 쇼핑커머스 2026",
  }
  if (labels[slug]) return labels[slug]
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function ensureInternalLinks(body, relatedSlugs) {
  const current = (body.match(/\]\(\/insights\//g) || []).length
  if (current >= 2) return body

  const existing = new Set(
    [...body.matchAll(/\]\(\/insights\/([a-z0-9-]+)\)/g)].map((m) => m[1]),
  )

  const links = relatedSlugs
    .filter((slug) => !existing.has(slug))
    .slice(0, Math.max(0, 2 - current))
    .map((slug) => `[${slugToLinkLabel(slug)}](/insights/${slug})`)

  if (links.length === 0) return body

  const weave = `\n\n관련해서는 ${links.join(", ")}도 함께 참고하세요.\n`
  const ctaRe = sectionHeadingRegex("cta", "m")
  if (ctaRe.test(body)) {
    return body.replace(ctaRe, `${weave}\n## ${getInsightSection("cta").display}`)
  }
  return `${body}\n${weave}`
}

function validateBody(body) {
  const issues = []
  if (body.length < MIN_BODY_CHARS) issues.push(`too short (${body.length} chars)`)
  const needed = [
    ["conclusion", "missing 결론"],
    ["why", "missing 왜 중요한가"],
    ["practice", "missing 실무에서는 어떻게 보는가"],
    ["checklist", "missing 바로 실행할 체크리스트"],
    ["faq", "missing 자주 묻는 질문"],
    ["insight", "missing 실무에서 자주 보는 사례"],
    ["cta", "missing 다음 단계"],
  ]
  for (const [id, label] of needed) {
    if (!bodyHasSection(body, id)) issues.push(label)
  }
  const faqCount = countFaqItems(body)
  if (faqCount < 5) issues.push(`FAQ count low (${faqCount})`)
  const linkCount = (body.match(/\]\(\/insights\//g) || []).length
  if (linkCount < 2) issues.push(`internal links low (${linkCount})`)
  return issues
}

async function generateDescription(body, title) {
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
          content: `다음 CollaboTicket 일본 EC 실무 리포트의 카드용 description 1문장(110자 이내, 숫자 1개 포함, 한국어)만 출력:\n제목: ${title}\n본문:\n${body.slice(0, 900)}`,
        },
      ],
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || null
}

async function rewritePost({ meta, content, image, publishDate, relatedSlugs }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set")
  }

  const excerpt = String(content || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .slice(0, 1500)

  const prompt = buildArticlePrompt({
    meta,
    imageUrl: image,
    publishDate,
    relatedSlugs,
    existingExcerpt: excerpt,
  })

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
  if (!res.ok) {
    throw new Error(data.error?.message || `OpenAI error ${res.status}`)
  }

  let body = sanitizeGeneratedBody(extractResponseText(data))
  body = ensureMinimumFaq(body, meta)
  body = ensureInternalLinks(body, relatedSlugs)
  const issues = validateBody(body)
  if (issues.length > 0) {
    throw new Error(`Validation failed: ${issues.join("; ")}`)
  }

  const description = await generateDescription(body, meta.title)
  return { body, description }
}

function listPosts(filterSlug) {
  const allSlugs = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
      const parsed = matter(raw)
      const publishIndex = PUBLISH_ORDER.indexOf(slug)
      const imageIndex = publishIndex >= 0 ? publishIndex : allSlugs.indexOf(slug)
      return {
        slug,
        file,
        publishIndex: publishIndex >= 0 ? publishIndex : 999,
        meta: parsed.data,
        content: parsed.content,
        image: imageForIndex(imageIndex),
      }
    })

  const sorted = sortPostsByPublishOrder(files)

  return sorted
    .map((post, orderIndex) => ({
      ...post,
      publishDate: assignPublishDate(orderIndex),
      relatedSlugs: pickRelatedSlugs(post.slug, allSlugs),
    }))
    .filter((p) => !filterSlug || p.slug === filterSlug)
}

async function main() {
  const args = process.argv.slice(2)
  const all = args.includes("--all")
  const resume = args.includes("--resume")
  const testIdx = args.indexOf("--test")
  const testSlug = testIdx >= 0 ? args[testIdx + 1] : null
  const limitIdx = args.indexOf("--limit")
  const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : Infinity

  if (!all && !testSlug) {
    console.error("Usage: node scripts/rewrite-insights-openai.mjs --test <slug> | --all [--resume] [--limit N]")
    process.exit(1)
  }

  const progress = resume ? loadProgress() : { version: CONTENT_RULES_VERSION, completed: [] }
  if (progress.version !== CONTENT_RULES_VERSION) {
    progress.version = CONTENT_RULES_VERSION
    progress.completed = []
  }

  let posts = listPosts(testSlug)
  if (resume) {
    posts = posts.filter((p) => !progress.completed.includes(p.slug))
  }
  if (Number.isFinite(limit)) {
    posts = posts.slice(0, limit)
  }

  console.log(
    JSON.stringify(
      {
        rules: CONTENT_RULES_VERSION,
        model: MODEL,
        total: posts.length,
        dateRange:
          posts.length > 0
            ? { from: posts[0].publishDate, to: posts[posts.length - 1].publishDate }
            : null,
      },
      null,
      2,
    ),
  )

  let success = 0
  let failed = 0

  for (const post of posts) {
    console.log(`\n→ [${post.publishDate}] ${post.slug}`)
    try {
      const { body, description } = await rewritePost(post)

      const nextMeta = {
        ...post.meta,
        title: post.meta.title,
        description: description || post.meta.description,
        date: post.publishDate,
        image: post.image,
      }

      fs.writeFileSync(path.join(BLOG_DIR, post.file), matter.stringify(body, nextMeta), "utf8")

      progress.completed.push(post.slug)
      saveProgress(progress)

      console.log(`  ✓ ${post.slug} (${body.length} chars)`)
      success += 1
    } catch (error) {
      console.error(`  ✗ ${post.slug}:`, error.message)
      failed += 1
    }

    if (posts.indexOf(post) < posts.length - 1) {
      await sleep(DELAY_MS)
    }
  }

  console.log(JSON.stringify({ success, failed, completedTotal: progress.completed.length }, null, 2))
  if (failed > 0) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
