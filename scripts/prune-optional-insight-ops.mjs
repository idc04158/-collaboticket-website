#!/usr/bin/env node
/**
 * Remove INSIGHT operational-data sections when off-topic for the article.
 * Keeps INSIGHT only on execution/case-study slugs with topic-relevant content.
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"

import { getAssignedCases } from "./insight-unique-angles.mjs"
import {
  AD_METRICS_TABLE_SLUGS,
  KPI_DASHBOARD_LINK,
  OPS_INSIGHT_SLUGS,
} from "./insight-ops-slugs.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

const GENERIC_BD_METRICS_TABLE =
  /\n\|[^\n]*브랜드[^\n]*\|[^\n]*플랫폼[^\n]*\|[^\n]*광고비[^\n]*\|[\s\S]*?\|[^\n]*ROAS[^\n]*\|\n(?:\|[^\n]+\|\n)+/g

const ORPHAN_TABLE_HEADER =
  /\n\n\| 브랜드\s*\| 플랫폼\s*\| 광고비\(만 엔\)[^\n]*\|\n(?=\n|운영 지표|## )/g

function extractInsightBlock(body) {
  const start = body.search(/^## INSIGHT:/m)
  if (start < 0) return null

  const rest = body.slice(start)
  const nextHeading = rest.search(/\n## /)
  if (nextHeading < 0) return rest.trimEnd()
  return rest.slice(0, nextHeading).trimEnd()
}

function removeInsightBlock(body) {
  const block = extractInsightBlock(body)
  if (!block) return body
  return body.replace(block, "").replace(ORPHAN_TABLE_HEADER, "\n").replace(/\n{3,}/g, "\n\n").trimEnd()
}

function isBrokenInsight(block) {
  const text = block.replace(/^## INSIGHT:[^\n]*\n?/, "").trim()
  if (!text) return true
  const rows = text.match(/^\|[^\n]+\|/gm) ?? []
  const dataRows = rows.filter((row) => !row.includes("---"))
  if (dataRows.length === 1 && dataRows[0].includes("브랜드") && dataRows[0].includes("플랫폼")) {
    return true
  }
  return false
}

function insightHasSubstance(block) {
  if (!block || isBrokenInsight(block)) return false
  const text = block.replace(/^## INSIGHT:[^\n]*\n?/, "").trim()
  if (text.length < 80) return false
  const hangulCount = (text.match(/[가-힣]/g) ?? []).length
  return hangulCount >= 20
}

function assignedAllowsCase(slug, caseLetter) {
  const labels = getAssignedCases(slug).join(" ")
  if (caseLetter === "B") return /헤어케어\s*B/i.test(labels)
  if (caseLetter === "D") return /스킨케어\s*D/i.test(labels)
  return true
}

function stripOffTopicMetrics(block, slug) {
  let next = block

  if (!AD_METRICS_TABLE_SLUGS.has(slug)) {
    next = next.replace(GENERIC_BD_METRICS_TABLE, "\n")
  } else if (!assignedAllowsCase(slug, "B") && !assignedAllowsCase(slug, "D")) {
    next = next.replace(GENERIC_BD_METRICS_TABLE, "\n")
  }

  return next.replace(/\n{3,}/g, "\n\n")
}

function ensureKpiLink(body) {
  if (body.includes("/insights/japan-ec-kpi-dashboard")) return body
  if (body.match(/^## 다음 단계\n/m)) {
    return body.replace(/^## 다음 단계\n/m, `## 다음 단계\n${KPI_DASHBOARD_LINK}\n\n`)
  }
  if (body.match(/^## ACTION:/m)) {
    return body.replace(/^## ACTION:/m, `${KPI_DASHBOARD_LINK}\n\n## ACTION:`)
  }
  return body
}

function finalizeBody(body, { stripOrphanTables = false } = {}) {
  let next = body
  if (stripOrphanTables) {
    next = next.replace(ORPHAN_TABLE_HEADER, "\n")
  }
  return next.replace(/\n{3,}/g, "\n\n").trimEnd()
}

function processBody(body, slug) {
  const insightBlock = extractInsightBlock(body)
  if (!insightBlock) return finalizeBody(body)

  if (!OPS_INSIGHT_SLUGS.has(slug)) {
    return finalizeBody(ensureKpiLink(removeInsightBlock(body)), { stripOrphanTables: true })
  }

  const cleanedInsight = stripOffTopicMetrics(insightBlock, slug)

  if (!insightHasSubstance(cleanedInsight)) {
    return finalizeBody(ensureKpiLink(removeInsightBlock(body)), { stripOrphanTables: true })
  }

  return finalizeBody(body.replace(insightBlock, cleanedInsight))
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
    console.log(`pruned: ${file}`)
  }
}

console.log(`Done. ${changed}/${files.length} files updated.`)
