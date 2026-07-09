#!/usr/bin/env node
/**
 * Fix title/description years that run ahead of publish date.
 *
 * Usage:
 *   node scripts/fix-insight-title-years.mjs
 *   node scripts/fix-insight-title-years.mjs --slug japan-ecommerce-2025
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import {
  fixHubAnchorText,
  HUB_TITLE_LABELS,
  scanTitleYearAlignment,
  suggestDescription,
  suggestTitle,
} from "../lib/insight-title-year-rules.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1]
  ?? (process.argv.includes("--slug") ? process.argv[process.argv.indexOf("--slug") + 1] : null)

function fixFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  const slug = path.basename(filePath, ".md")

  const nextTitle = suggestTitle({ title: data.title ?? "", date: data.date, slug })
  const nextDescription = suggestDescription(data.description ?? "", data.date, nextTitle)

  let nextContent = content
  if (nextTitle !== data.title) {
    nextContent = nextContent.replaceAll(data.title, nextTitle)
  }

  nextContent = fixHubAnchorText(nextContent, slug)

  const nextData = { ...data, title: nextTitle }
  if (typeof data.description === "string") nextData.description = nextDescription

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
