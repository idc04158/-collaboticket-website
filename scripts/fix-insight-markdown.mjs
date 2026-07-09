#!/usr/bin/env node
/**
 * Fix leaked ### markers, broken FAQ lines, and generic FAQ boilerplate.
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { fixMarkdownHygiene } from "../lib/insight-markdown-hygiene.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1]
  ?? (process.argv.includes("--slug") ? process.argv[process.argv.indexOf("--slug") + 1] : null)

let changed = 0
const files = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .filter((f) => !slugArg || f.includes(slugArg))

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file)
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  const slug = file.replace(/\.md$/, "")
  const nextContent = fixMarkdownHygiene(content, slug)
  if (nextContent === content) continue

  fs.writeFileSync(filePath, matter.stringify(nextContent, data), "utf8")
  changed++
  console.log("fixed:", file)
}

console.log(`Done. ${changed}/${files.length} files updated.`)
