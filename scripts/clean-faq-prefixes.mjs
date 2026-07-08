#!/usr/bin/env node
/**
 * Clean FAQ "질문?" prefixes and broken Mega Warí spelling across insights.
 */

import fs from "fs"
import path from "path"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

function cleanBody(content) {
  let next = content

  // ### 질문? 실제질문… → ### 실제질문…
  next = next.replace(/^###\s*질문\?\s*/gm, "### ")

  // Accidental accented Megawari spelling
  next = next.replace(/Mega\s*Warí/gi, "메가와리")
  next = next.replace(/Mega\s*Wari/gi, "메가와리")
  next = next.replace(/\bWarí\b/g, "와리")

  return next
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
let updated = 0

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file)
  const raw = fs.readFileSync(filePath, "utf8")
  const cleaned = cleanBody(raw)
  if (cleaned === raw) continue
  fs.writeFileSync(filePath, cleaned)
  updated++
  console.log("Cleaned", file)
}

console.log(`Done: ${updated} files`)
