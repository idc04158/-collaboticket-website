import fs from "fs"
import path from "path"
import matter from "gray-matter"

import { baseImageId, pickDistinctBody, pickDistinctCover } from "./insight-image-pool.mjs"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const IMAGE_LINE_RE = /^!\[[^\]]*]\(([^)]+)\)\s*$/
const H2_RE = /^##\s+/
const TABLE_RE = /^\|.*\|\s*$/

function readBlogFiles() {
  if (!fs.existsSync(BLOG_DIR)) {
    throw new Error(`Blog directory not found: ${BLOG_DIR}`)
  }
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join(BLOG_DIR, name))
}

function parseDateValue(value) {
  const source = String(value || "").trim()
  if (!source) return Number.POSITIVE_INFINITY
  const millis = Date.parse(source)
  return Number.isFinite(millis) ? millis : Number.POSITIVE_INFINITY
}

function sortedByDate(filePaths) {
  const records = filePaths.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8")
    const parsed = matter(raw)
    const dateValue = parseDateValue(parsed.data?.date)
    return { filePath, parsed, dateValue }
  })

  records.sort((a, b) => {
    if (a.dateValue !== b.dateValue) return a.dateValue - b.dateValue
    return path.basename(a.filePath).localeCompare(path.basename(b.filePath), "en")
  })
  return records
}

function removeAllMarkdownImages(lines) {
  return lines.filter((line) => !IMAGE_LINE_RE.test(line.trim()))
}

function findSectionEnd(lines, startIdx) {
  for (let i = startIdx + 1; i < lines.length; i += 1) {
    if (H2_RE.test(lines[i])) return i
  }
  return lines.length
}

function findFirstIndex(lines, predicate, from = 0, to = lines.length) {
  for (let i = from; i < to; i += 1) {
    if (predicate(lines[i], i)) return i
  }
  return -1
}

function ensureHeroAfterSummary(lines, title, coverImage) {
  const aiIdx = findFirstIndex(lines, (line) => line.trim() === "## AI 30초 요약")
  if (aiIdx < 0) return lines

  const aiEnd = findSectionEnd(lines, aiIdx)
  let insertAt = aiIdx + 1
  for (let i = aiIdx + 1; i < aiEnd; i += 1) {
    if (lines[i].trim().startsWith("✓")) insertAt = i + 1
  }

  const heroLine = `![${title}](${coverImage})`
  const next = [...lines]
  next.splice(insertAt, 0, "", heroLine, "")
  return next
}

function findFirstTableRange(lines, from, to) {
  let end = -1
  for (let i = from; i < to; i += 1) {
    if (TABLE_RE.test(lines[i])) {
      end = i
      continue
    }
    if (end >= 0) break
  }
  return { end }
}

function ensureFactInlineImage(lines, title, bodyImage) {
  const factIdx = findFirstIndex(lines, (line) => line.trim().startsWith("## FACT:"))
  if (factIdx < 0) return lines

  const factEnd = findSectionEnd(lines, factIdx)
  const { end } = findFirstTableRange(lines, factIdx + 1, factEnd)
  const insertAt = end >= 0 ? end + 1 : Math.min(factIdx + 2, factEnd)
  const inlineLine = `![${title} 본문 이미지](${bodyImage})`

  const next = [...lines]
  next.splice(insertAt, 0, "", inlineLine, "")
  return next
}

function normalizeBodyImages(content, title, coverImage, bodyImage) {
  const baseLines = removeAllMarkdownImages(content.split("\n"))
  const withHero = ensureHeroAfterSummary(baseLines, title, coverImage)
  const withInline = ensureFactInlineImage(withHero, title, bodyImage)
  return withInline.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()
}

function rewriteAll() {
  const records = sortedByDate(readBlogFiles())
  const usedCovers = new Set()
  let updated = 0

  for (let i = 0; i < records.length; i += 1) {
    const { filePath, parsed } = records[i]
    const slug = path.basename(filePath, ".md")
    const title = String(parsed.data?.title || slug).trim()
    const coverImage = pickDistinctCover(i, slug, usedCovers)
    const bodyImage = pickDistinctBody(coverImage, slug, i)
    const nextContent = normalizeBodyImages(parsed.content || "", title, coverImage, bodyImage)

    const nextData = { ...parsed.data, image: coverImage }
    const nextRaw = matter.stringify(nextContent, nextData)
    const prevRaw = fs.readFileSync(filePath, "utf8")

    if (nextRaw !== prevRaw) {
      fs.writeFileSync(filePath, nextRaw, "utf8")
      updated += 1
    }
  }

  console.log(`Reassigned unique cover images. Updated ${updated} files.`)
}

rewriteAll()
