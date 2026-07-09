#!/usr/bin/env node
/**
 * Remove generic B/D case boilerplate from posts that aren't assigned those labels.
 * Keeps comparison posts (rakuten-vs-amazon) when both platforms are the topic.
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { ASSIGNED_CASE_LABELS, CANONICAL_HUBS, getAssignedCases } from "./insight-unique-angles.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

const CASE_PATTERNS = [
  { id: "B", re: /헤어케어\s*(?:브랜드\s*)?B(?:제품)?/g },
  { id: "D", re: /스킨케어\s*(?:브랜드\s*)?D(?:제품)?/g },
  { id: "A", re: /건강기능식품\s*브랜드\s*A/g },
  { id: "C", re: /(?:패션\s*브랜드\s*C|더마코스메틱\s*C)/g },
  { id: "F", re: /패션\s*브랜드\s*F/g },
  { id: "G", re: /건강기능식품\s*G|식품\s*G/g },
  { id: "H", re: /생활용품\s*H/g },
]

const BOTH_BD_EXCEPTIONS = new Set([
  CANONICAL_HUBS.kpiOps,
  "japan-ec-market-trends-2026",
  "rakuten-vs-amazon",
])

function assignedIds(slug) {
  const labels = getAssignedCases(slug)
  const ids = new Set()
  for (const label of labels) {
    for (const { id, re } of CASE_PATTERNS) {
      re.lastIndex = 0
      if (re.test(label)) ids.add(id)
    }
    if (/패션\s*F|브랜드\s*F/i.test(label)) ids.add("F")
    if (/건강기능식품\s*G|식품\s*G|F&B/i.test(label)) ids.add("G")
    if (/생활용품\s*H/i.test(label)) ids.add("H")
    if (/뷰티\s*브랜드\s*A|인플루언서\s*캠페인\s*A/i.test(label)) ids.add("A")
  }
  return ids
}

const CASE_CORES = {
  B: "헤어케어\\s*(?:브랜드\\s*)?B(?:제품)?",
  D: "스킨케어\\s*(?:브랜드\\s*)?D(?:제품)?",
  A: "건강기능식품\\s*브랜드\\s*A",
  C: "(?:패션\\s*브랜드\\s*C|더마코스메틱\\s*C)",
  F: "패션\\s*브랜드\\s*F",
  G: "건강기능식품\\s*G|식품\\s*G",
  H: "생활용품\\s*H",
}

function removeCaseBlock(body, caseId) {
  const core = CASE_CORES[caseId]
  if (!core) return body

  let next = body
  next = next.replace(
    new RegExp(`\\n###\\s*(?:사례\\s*\\d+:\\s*)?[^\\n]*${core}[^\\n]*\\n[\\s\\S]*?(?=\\n##\\s+|\\n###\\s*(?:사례\\s*\\d+:|${core})|$)`, "g"),
    "\n",
  )

  // Numbered: 1. **헤어케어...
  next = next.replace(
    new RegExp(`\\n\\d+\\.\\s*\\*\\*[^\\n]*${core}[^\\n]*\\*\\*[\\s\\S]*?(?=\\n\\d+\\.\\s*\\*\\*|\\n##\\s+|$)`, "g"),
    "\n",
  )

  // Summary bullets
  next = next.replace(new RegExp(`\\n✓[^\\n]*${core}[^\\n]*`, "g"), "")

  // Table rows
  next = next.replace(new RegExp(`\\n\\|[^\\n]*${core}[^\\n]*\\|[^\\n]*\\n`, "g"), "")

  // Standalone lines
  next = next.replace(new RegExp(`^[^\\n]*${core}[^\\n]*\\n`, "gm"), "")

  return next
}

function stripActionPlatformMatrix(body, slug) {
  if (slug === CANONICAL_HUBS.platformRoles) return body
  return body.replace(
    /\n\| 플랫폼\s*\|[^\n]*\|\n\|[-—|]+\|\n(?:\| Qoo10[^\n]*\n\| Rakuten[^\n]*\n\| Amazon[^\n]*\n(?:\| LINE[^\n]*\n)?)+/g,
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

function processBody(body, slug) {
  let next = body
  const allowed = assignedIds(slug)

  if (!BOTH_BD_EXCEPTIONS.has(slug)) {
    for (const { id } of CASE_PATTERNS) {
      if (!allowed.has(id)) next = removeCaseBlock(next, id)
    }
  }

  next = stripActionPlatformMatrix(next, slug)
  next = stripGenericPlatformUserTable(next, slug)
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
    console.log(`case-stripped: ${file}`)
  }
}

console.log(`Done. ${changed}/${files.length} files updated.`)
