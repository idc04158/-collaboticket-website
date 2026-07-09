#!/usr/bin/env node
/**
 * Scan insight markdown for Korean/Japanese language mixing.
 *
 * Usage:
 *   node scripts/scan-insight-language.mjs
 *   node scripts/scan-insight-language.mjs --strict   # exit 1 if any issue
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { normalizeInsightKorean, scanInsightLanguageMix } from "../lib/insight-language-rules.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const strict = process.argv.includes("--strict")

let totalIssues = 0

for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const filePath = path.join(BLOG_DIR, file)
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"))
  const text = [
    data.title ?? "",
    data.description ?? "",
    content,
  ].join("\n")

  const normalized = normalizeInsightKorean(text)
  const issues = scanInsightLanguageMix(normalized, { slug: file.replace(/\.md$/, "") })
  if (issues.length === 0) continue

  totalIssues += issues.length
  console.log(`\n${file} (${issues.length} lines)`)
  for (const issue of issues.slice(0, 8)) {
    console.log(`  L${issue.line}: ${issue.issue}`)
    console.log(`       ${issue.snippet}`)
  }
  if (issues.length > 8) console.log(`  ... +${issues.length - 8} more`)
}

if (totalIssues === 0) {
  console.log("No Korean/Japanese mixing issues found.")
} else {
  console.log(`\nTotal: ${totalIssues} line(s) with mixed language.`)
}

if (strict && totalIssues > 0) process.exit(1)
