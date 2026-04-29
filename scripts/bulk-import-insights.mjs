#!/usr/bin/env node
/**
 * Bulk-import insights / case studies into content/blog/*.md
 *
 * Usage:
 *   node scripts/bulk-import-insights.mjs path/to/items.json
 *   node scripts/bulk-import-insights.mjs path/to/items.json --force
 *   type items.json | node scripts/bulk-import-insights.mjs
 *
 * JSON: array of objects (or single object):
 *   slug?        — URL path; auto from title if omitted (Latin). 한글만 제목이면 해시 기반 slug.
 *   title        — required
 *   description  — required (카드 요약)
 *   category     — e.g. "Insight", "Case Study", "실행사례"
 *   date         — "YYYY-MM-DD"
 *   image?       — optional public path e.g. /influencer/foo.webp
 *   body         — markdown 본문 (required)
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createHash } from "crypto"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")

function slugify(input) {
  const s = String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
  return s.slice(0, 96).replace(/^-|-$/g, "") || ""
}

function stableSlugFromTitle(title, index) {
  const fromTitle = slugify(title)
  if (fromTitle) return fromTitle
  const h = createHash("sha256").update(`${title}\0${index}`).digest("hex").slice(0, 14)
  return `insight-${h}`
}

function buildMarkdown({ title, description, category, date, image, body }) {
  const lines = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `category: ${JSON.stringify(category)}`,
    `date: ${JSON.stringify(date)}`,
  ]
  if (image) lines.push(`image: ${JSON.stringify(image)}`)
  lines.push("---", "", String(body).replace(/\r\n/g, "\n").trimEnd(), "")
  return lines.join("\n")
}

function parseJsonInput(raw) {
  const t = raw.trim()
  if (!t) throw new Error("Empty input")
  // NDJSON: one JSON object per line
  if (t.includes("\n") && !t.startsWith("[")) {
    return t
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        try {
          return JSON.parse(line)
        } catch (e) {
          throw new Error(`NDJSON line ${i + 1}: ${e.message}`)
        }
      })
  }
  const data = JSON.parse(t)
  return Array.isArray(data) ? data : [data]
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = []
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (c) => chunks.push(c))
    process.stdin.on("end", () => resolve(chunks.join("")))
    process.stdin.on("error", reject)
  })
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--force")
  const force = process.argv.includes("--force")
  let raw
  if (args[0]) {
    const filePath = path.resolve(args[0])
    raw = fs.readFileSync(filePath, "utf8")
  } else {
    raw = await readStdin()
  }

  const items = parseJsonInput(raw)
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true })
  }

  let written = 0
  let skipped = 0

  items.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Item ${index}: must be an object`)
    }
    const title = item.title
    const description = item.description
    const category = item.category ?? "Insight"
    const date = item.date ?? ""
    const image = item.image
    const body = item.body

    if (typeof title !== "string" || !title.trim()) {
      throw new Error(`Item ${index}: "title" is required`)
    }
    if (typeof description !== "string") {
      throw new Error(`Item ${index}: "description" is required`)
    }
    if (typeof body !== "string" || !body.trim()) {
      throw new Error(`Item ${index}: "body" (markdown) is required`)
    }

    let slug =
      typeof item.slug === "string" && item.slug.trim()
        ? slugify(item.slug) || item.slug.trim().replace(/\s+/g, "-")
        : stableSlugFromTitle(title, index)

    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      slug = stableSlugFromTitle(title, index)
    }

    const outPath = path.join(BLOG_DIR, `${slug}.md`)
    if (fs.existsSync(outPath) && !force) {
      console.warn(`skip (exists): ${slug}.md — use --force to overwrite`)
      skipped += 1
      return
    }

    const md = buildMarkdown({
      title: title.trim(),
      description,
      category,
      date,
      image: typeof image === "string" && image.trim() ? image.trim() : undefined,
      body,
    })
    fs.writeFileSync(outPath, md, "utf8")
    console.log(`write: ${outPath}`)
    written += 1
  })

  console.log(`Done. ${written} written, ${skipped} skipped.`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
