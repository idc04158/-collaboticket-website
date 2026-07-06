#!/usr/bin/env node
/**
 * Rewrite insight markdown posts using OpenAI + web search.
 *
 * Usage:
 *   node scripts/rewrite-insights-openai.mjs --test qoo10-launch-checklist-30days
 *   node scripts/rewrite-insights-openai.mjs --all
 *   node scripts/rewrite-insights-openai.mjs --all --resume
 *   node scripts/rewrite-insights-openai.mjs --all --limit 5
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { imageForIndex, INSIGHT_IMAGES } from "./insight-images.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const PROGRESS_FILE = path.join(__dirname, ".rewrite-progress.json")

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"
const DELAY_MS = Number(process.env.REWRITE_DELAY_MS || 3000)

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

function buildSearchQuery(meta) {
  const tagHint = Array.isArray(meta.tags) ? meta.tags.slice(0, 2).join(" ") : ""
  return `${meta.title} Japan ecommerce ${meta.category} ${tagHint} 2025 2026 Korean brand market trends`
}

function buildPrompt(meta, imageUrl, existingContent) {
  const tags = Array.isArray(meta.tags) ? meta.tags.join(", ") : ""
  const excerpt = String(existingContent || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .slice(0, 1200)

  return `You are a senior Japan ecommerce strategist and editorial writer for CollaboTicket, a Korean B2B agency helping Korean brands enter the Japanese market.

Use web search to gather current facts about: ${buildSearchQuery(meta)}

Rewrite this insight article in Korean as high-quality long-form B2B content.

Article title: ${meta.title}
Category: ${meta.category}
Tags: ${tags}
Current description: ${meta.description || ""}

Existing draft excerpt (replace with much better content):
${excerpt}

Requirements:
1. Output ONLY markdown body text. No YAML frontmatter. No single # H1 title (page already has title).
2. Minimum 2,000 Korean characters of substantive content.
3. Start with ## 요약 (3-4 sentences with concrete value).
4. Immediately after summary, include exactly one image line:
   ![${meta.title}](${imageUrl})
5. Include 8-12 sections using ## headings. Suggested flow (adapt to topic):
   - 왜 이 주제가 중요한가
   - 일본 시장/플랫폼 맥락 (with real data from web search)
   - 한국 브랜드 관점의 핵심 인사이트
   - 실행 단계 or 프레임워크 (numbered lists OK)
   - 실무 체크리스트 (bullet list)
   - KPI와 측정 방법
   - 자주 하는 실수
   - 상담 전에 준비하면 좋은 자료
   - 결론
6. Include specific platform names where relevant (Qoo10, Rakuten, Amazon Japan, LINE, TikTok, etc.).
7. Cite realistic market context from web search; do not invent fake statistics—use ranges or qualitative facts if exact numbers unavailable.
8. Professional, actionable B2B tone. No filler templates. No HTML comments.
9. Do not mention OpenAI or that content was AI-generated.
10. Update-worthy description: also return on the LAST line as JSON: {"description":"150 chars max Korean card summary"}`
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
      temperature: 0.5,
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content: `다음 인사이트 글 제목과 본문 요약에 맞는 카드용 description 1문장(120자 이내, 한국어)만 출력:\n제목: ${title}\n본문 시작:\n${body.slice(0, 600)}`,
        },
      ],
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || null
}

async function rewritePost(meta, existingContent, imageUrl) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set")
  }

  const prompt = buildPrompt(meta, imageUrl, existingContent)

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      tools: [{ type: "web_search_preview" }],
      input: prompt,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error?.message || `OpenAI error ${res.status}`)
  }

  let body = extractResponseText(data)
  if (!body || body.length < 800) {
    throw new Error(`Generated body too short (${body.length} chars)`)
  }

  // Strip trailing JSON description if model included it
  const jsonMatch = body.match(/\n\{ "description": "[^"]+" \}\s*$/)
  let descriptionFromBody = null
  if (jsonMatch) {
    try {
      descriptionFromBody = JSON.parse(jsonMatch[0].trim()).description
    } catch {
      /* ignore */
    }
    body = body.slice(0, jsonMatch.index).trim()
  }

  // Remove accidental frontmatter fences
  body = body.replace(/^---[\s\S]*?---\n+/m, "").trim()

  const description = descriptionFromBody || (await generateDescription(body, meta.title))

  return { body, description }
}

function listPosts(filterSlug) {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()

  return files
    .map((file, index) => {
      const slug = file.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
      const parsed = matter(raw)
      return {
        slug,
        file,
        index,
        meta: parsed.data,
        content: parsed.content,
        image: imageForIndex(index),
      }
    })
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

  const progress = resume ? loadProgress() : { completed: [] }
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
        model: MODEL,
        total: posts.length,
        images: INSIGHT_IMAGES.length,
        resume,
      },
      null,
      2,
    ),
  )

  let success = 0
  let failed = 0

  for (const post of posts) {
    console.log(`\n→ Rewriting: ${post.slug}`)
    try {
      const { body, description } = await rewritePost(post.meta, post.content, post.image)

      const nextMeta = {
        ...post.meta,
        description: description || post.meta.description,
        image: post.image,
      }

      const output = matter.stringify(body, nextMeta)
      fs.writeFileSync(path.join(BLOG_DIR, post.file), output, "utf8")

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

  console.log(
    JSON.stringify({ success, failed, completedTotal: progress.completed.length }, null, 2),
  )

  if (failed > 0) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
