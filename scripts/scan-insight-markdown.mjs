#!/usr/bin/env node
/** Scan insight markdown for leaked heading markers and boilerplate artifacts. */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { scanMarkdownHygiene } from "../lib/insight-markdown-hygiene.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const strict = process.argv.includes("--strict")

let total = 0

for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
  const issues = scanMarkdownHygiene(content, file.replace(/\.md$/, ""))
  if (!issues.length) continue

  total += issues.length
  console.log(`\n${file} (${issues.length})`)
  for (const issue of issues.slice(0, 10)) {
    console.log(`  L${issue.line} [${issue.type}] ${issue.message}`)
    if (issue.snippet) console.log(`       ${issue.snippet}`)
  }
  if (issues.length > 10) console.log(`  ... +${issues.length - 10} more`)
}

if (total === 0) {
  console.log("No markdown hygiene issues found.")
} else {
  console.log(`\nTotal: ${total} issue(s). Run: npm run fix:insight-markdown`)
}

if (strict && total > 0) process.exit(1)
