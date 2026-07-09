#!/usr/bin/env node
/** Remove footer "For more insights" / ## 관련 리포트 blocks from insight markdown sources. */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

const FOOTER_LINE =
  /^(?:For (?:more|further|additional)[^\n]*|Explore further[^\n]*|내부 링크[^\n]*)\s*$/gm

function cleanBody(body) {
  let next = body
  next = next.replace(/^##\s+관련 리포트\s*\n[\s\S]*?(?=^##\s+|\n*$)/gm, "")
  next = next.replace(FOOTER_LINE, "")
  return next.replace(/\n{3,}/g, "\n\n").trimEnd()
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
let changed = 0

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file)
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  const cleaned = cleanBody(content)
  if (cleaned !== content.trimEnd()) {
    fs.writeFileSync(filePath, matter.stringify(cleaned, data), "utf8")
    changed++
    console.log(`cleaned: ${file}`)
  }
}

console.log(`Done. ${changed}/${files.length} files updated.`)
