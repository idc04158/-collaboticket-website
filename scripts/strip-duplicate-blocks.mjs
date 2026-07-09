#!/usr/bin/env node
/**
 * Mechanical dedup: strip boilerplate blocks from all insight markdown files.
 * Run after dedup-insights or standalone.
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { CANONICAL_HUBS } from "./insight-unique-angles.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

const NEXT_STEP_BLOCK = `## 다음 단계
Qoo10·Rakuten·Amazon·LINE 역할과 진입 순서는 [일본 EC 채널 진입 전략](/insights/${CANONICAL_HUBS.platformRoles})에서 확인하세요. 시장 규모·거시 지표는 [2025년 일본 이커머스 시장 트렌드](/insights/${CANONICAL_HUBS.marketData})를 참고하세요.

`

const GENERIC_FAQ_PATTERNS = [
  /^###\s+일본\s*(EC|이커머스|전자상거래)\s*시장\s*(규모|크기)/,
  /^###\s+.*어떤\s*플랫폼/,
  /^###\s+.*가장\s*(효과|적합)/,
  /^###\s+.*리뷰.*(중요|왜)/,
  /^###\s+.*물류\s*(파트너|업체)/,
  /^###\s+.*현지화.*(주의|필요)/,
]

function stripPlatformTable(body, slug) {
  if (slug === CANONICAL_HUBS.platformRoles) return body

  let next = body.replace(/^##\s+플랫폼별\s*역할\s*정리\s*\n[\s\S]*?(?=^##\s+|\n*$)/gm, "")
  if (!/^##\s+다음\s*단계/m.test(next) && /##\s+ACTION/m.test(next)) {
    next = next.replace(/(^##\s+ACTION[\s\S]*?)(?=^##\s+)/m, `$1\n${NEXT_STEP_BLOCK}`)
  }
  return next
}

function trimGenericFaqs(body, slug) {
  if (slug === CANONICAL_HUBS.faq) return body

  const faqStart = body.search(/^##\s+FAQ/m)
  if (faqStart < 0) return body

  const before = body.slice(0, faqStart)
  const afterStart = body.slice(faqStart)
  const refSplit = afterStart.search(/^##\s+References/m)
  const faqSection = refSplit >= 0 ? afterStart.slice(0, refSplit) : afterStart
  const refs = refSplit >= 0 ? afterStart.slice(refSplit) : ""

  const parts = faqSection.split(/^###\s+/m)
  const header = parts[0]
  const questions = parts.slice(1).map((block) => `### ${block}`)

  const kept = questions.filter((q) => {
    const firstLine = q.split("\n")[0] || ""
    return !GENERIC_FAQ_PATTERNS.some((re) => re.test(firstLine))
  })

  const trimmed = kept.slice(0, 5)
  if (trimmed.length === 0) return body

  const faqNote =
    trimmed.length < questions.length
      ? `\n> 일반적인 일본 EC 질문은 [일본 이커머스 FAQ 50](/insights/${CANONICAL_HUBS.faq})에서 확인하세요.\n\n`
      : ""

  return `${before}${header.trim()}\n${faqNote}${trimmed.join("\n\n")}\n\n${refs}`.replace(/\n{3,}/g, "\n\n")
}

function collapseDuplicateMarketParagraph(body, slug) {
  if (slug === CANONICAL_HUBS.marketData || slug === CANONICAL_HUBS.faq) return body

  return body.replace(
    /일본의?\s*(전자상거래|EC)\s*시장\s*규모는\s*[^.\n]+(?:20|30)조\s*엔[^.\n]*\.\s*\n/g,
    "",
  )
}

function stripOrphanPlatformRows(body) {
  return body
    .replace(
      /\n\|[-—|]+\|\s*\n(?:\| Qoo10[^\n]*\n\| Rakuten[^\n]*\n\| Amazon[^\n]*\n(?:\| LINE[^\n]*\n)?)+/g,
      "\n",
    )
    .replace(
      /\n\|[-—|]+\|\n(?:\| Qoo10[^\n]*\n\| Rakuten[^\n]*\n\| Amazon[^\n]*\n\| LINE[^\n]*\n)+/g,
      "\n",
    )
}

function stripGenericPlatformUserTable(body, slug) {
  if (slug === CANONICAL_HUBS.platformRoles || slug === CANONICAL_HUBS.marketData) return body
  return body.replace(
    /\n\| 플랫폼\s*\|[^\n]*(?:사용자|월간)[^\n]*\|\n\|[-—|]+\|\n(?:\|[^\n]+\|\s*\n){2,6}/g,
    "\n",
  )
}

function stripActionPlatformMatrix(body, slug) {
  if (slug === CANONICAL_HUBS.platformRoles) return body
  return body.replace(
    /\n\| 플랫폼\s*\|[^\n]*\|\n\|[-—|]+\|\n(?:\| Qoo10[^\n]*\n\| Rakuten[^\n]*\n\| Amazon[^\n]*\n(?:\| LINE[^\n]*\n)?)+/g,
    "\n",
  )
}

const HUB_PLATFORM_ROLES = `## 플랫폼별 역할 정리

| 플랫폼 | 1차 역할 | 적합 카테고리 | 권장 진입 시점 | 핵심 KPI |
|--------|----------|---------------|----------------|----------|
| Qoo10 | 초기 테스트·프로모션 | K-뷰티·K-패션 | 0~3개월 | 리뷰 수, CVR |
| Rakuten | 브랜드 빌딩·CRM | 생활·건강·패션 | 3~6개월 | 재구매율, 체류 시간 |
| Amazon Japan | 검색·물류 스케일 | 생활·전자·표준 SKU | 4~9개월 | Buy Box, ROAS |
| LINE | 재구매·CRM | 전 카테고리 | 2~6개월 | 친구 추가, 쿠폰 전환 |

시장 규모·점유율 등 거시 지표는 [2025년 일본 이커머스 시장 트렌드](/insights/${CANONICAL_HUBS.marketData})에서 확인하세요.

`

function ensureHubPlatformRoles(body, slug) {
  if (slug !== CANONICAL_HUBS.platformRoles) return body
  if (/^##\s+플랫폼별\s*역할/m.test(body)) return body
  if (/^##\s+INSIGHT/m.test(body)) {
    return body.replace(/^##\s+INSIGHT/m, `${HUB_PLATFORM_ROLES}## INSIGHT`)
  }
  return body
}

function processBody(body, slug) {
  let next = body
  next = stripPlatformTable(next, slug)
  next = stripOrphanPlatformRows(next)
  next = stripGenericPlatformUserTable(next, slug)
  next = stripActionPlatformMatrix(next, slug)
  next = ensureHubPlatformRoles(next, slug)
  next = trimGenericFaqs(next, slug)
  next = collapseDuplicateMarketParagraph(next, slug)
  return next.replace(/\n{3,}/g, "\n\n").trimEnd()
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
let changed = 0

for (const file of files) {
  const slug = file.replace(/\.md$/, "")
  const filePath = path.join(BLOG_DIR, file)
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  const cleaned = processBody(content.trim(), slug)
  if (cleaned !== content.trim()) {
    fs.writeFileSync(filePath, matter.stringify(cleaned, data), "utf8")
    changed++
    console.log(`stripped: ${file}`)
  }
}

console.log(`Done. ${changed}/${files.length} files updated.`)
