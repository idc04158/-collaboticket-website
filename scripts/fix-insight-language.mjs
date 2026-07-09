#!/usr/bin/env node
/**
 * Normalize Korean insight copy and fix common JP/KR mixing in markdown sources.
 *
 * Usage:
 *   node scripts/fix-insight-language.mjs
 *   node scripts/fix-insight-language.mjs --slug yahoo-chou-paypay-festival-2026-july
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { normalizeInsightKorean } from "../lib/insight-language-rules.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1]
  ?? (process.argv.includes("--slug") ? process.argv[process.argv.indexOf("--slug") + 1] : null)

function fixFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)

  const nextData = { ...data }
  if (typeof nextData.title === "string") nextData.title = normalizeInsightKorean(nextData.title)
  if (typeof nextData.description === "string") nextData.description = normalizeInsightKorean(nextData.description)

  const nextContent = normalizeInsightKorean(content)
  const nextRaw = matter.stringify(nextContent, nextData)

  if (nextRaw === raw) return false
  fs.writeFileSync(filePath, nextRaw, "utf8")
  return true
}

const files = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => path.join(BLOG_DIR, f))
  .filter((f) => !slugArg || f.includes(slugArg))

let changed = 0
for (const file of files) {
  if (fixFile(file)) {
    changed++
    console.log("fixed:", path.basename(file))
  }
}

console.log(`Done. ${changed}/${files.length} files updated.`)
