#!/usr/bin/env node
/**
 * Batch-fix insight quality issues from gap-seed templates:
 * float %, path-like link labels, translation openers, slug leaks.
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { applyInsightQualityHygiene } from "../lib/insight-quality-hygiene.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

const titleBySlug = new Map()
for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "")
  const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"))
  titleBySlug.set(slug, data.title || slug)
}

let changed = 0
for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const filePath = path.join(BLOG_DIR, file)
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  const nextContent = applyInsightQualityHygiene(content, titleBySlug)
  if (nextContent === content) continue

  fs.writeFileSync(filePath, matter.stringify(nextContent, data), "utf8")
  changed++
  console.log("fixed:", file)
}

console.log(`Done. ${changed} files updated.`)
