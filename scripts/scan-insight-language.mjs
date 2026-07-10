#!/usr/bin/env node
/**
 * Scan insight markdown for Korean/Japanese mixing and leaked ** markdown.
 *
 * Usage:
 *   node scripts/scan-insight-language.mjs
 *   node scripts/scan-insight-language.mjs --strict
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { polishInsightCopy } from "../lib/insight-plaintext-polish.mjs"
import { scanInsightLanguageMix } from "../lib/insight-language-rules.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const strict = process.argv.includes("--strict")

let totalIssues = 0

for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const filePath = path.join(BLOG_DIR, file)
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"))
  const slug = file.replace(/\.md$/, "")

  const issues = []

  for (const [field, value] of [
    ["title", data.title],
    ["description", data.description],
    ...(Array.isArray(data.tags) ? data.tags.map((tag, i) => [`tag[${i}]`, tag]) : []),
  ]) {
    if (typeof value !== "string" || !value) continue
    if (/\*\*/.test(value)) {
      issues.push({
        line: field,
        issue: "제목·설명·태그에 ** 마크다운이 그대로 노출됩니다",
        snippet: value.slice(0, 120),
      })
    }
    const langIssues = scanInsightLanguageMix(polishInsightCopy(value, { keepBold: true }), { slug })
    for (const issue of langIssues) {
      issues.push({ ...issue, line: field, snippet: value.slice(0, 120) })
    }
  }

  const normalized = polishInsightCopy(
    [data.title ?? "", data.description ?? "", content].join("\n"),
    { keepBold: true },
  )
  const bodyIssues = scanInsightLanguageMix(normalized, { slug })
  issues.push(...bodyIssues)

  const summaryMatch = content.match(/^##\s+AI 30초 요약\s*\n+([\s\S]*?)(?=\n##|\n!\[|\n*$)/m)
  if (summaryMatch && /\*\*/.test(summaryMatch[1])) {
    issues.push({
      line: "AI 30초 요약",
      issue: "요약에 ** 마크다운이 그대로 노출됩니다 (카드·목록에 AI 티)",
      snippet: summaryMatch[1].trim().slice(0, 120),
    })
  }

  if (issues.length === 0) continue

  totalIssues += issues.length
  console.log(`\n${file} (${issues.length} issue(s))`)
  for (const issue of issues.slice(0, 8)) {
    console.log(`  ${issue.line}: ${issue.issue}`)
    console.log(`       ${issue.snippet}`)
  }
  if (issues.length > 8) console.log(`  ... +${issues.length - 8} more`)
}

if (totalIssues === 0) {
  console.log("No Korean/Japanese mixing or ** leak issues found.")
} else {
  console.log(`\nTotal: ${totalIssues} issue(s). Run: npm run fix:insight-language`)
}

if (strict && totalIssues > 0) process.exit(1)
