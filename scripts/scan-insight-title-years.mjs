#!/usr/bin/env node
/**
 * Scan title/description years vs publish date.
 *
 * Usage:
 *   node scripts/scan-insight-title-years.mjs
 *   node scripts/scan-insight-title-years.mjs --strict
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { scanTitleYearAlignment } from "../lib/insight-title-year-rules.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const strict = process.argv.includes("--strict")

let total = 0

for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "")
  const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"))
  const issues = scanTitleYearAlignment({
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date,
  })
  if (!issues.length) continue

  total += issues.length
  console.log(`\n${file}`)
  for (const issue of issues) {
    console.log(`  ${issue.field}: ${issue.foundYear} (publish ${issue.publishDate.slice(0, 4)})`)
    console.log(`    was: ${issue.snippet.slice(0, 90)}`)
    if (issue.suggested) console.log(`    → ${issue.suggested.slice(0, 90)}`)
  }
}

if (total === 0) {
  console.log("No title/publish year mismatches found.")
} else {
  console.log(`\nTotal: ${total} issue(s). Run: npm run fix:insight-title-years`)
}

if (strict && total > 0) process.exit(1)
