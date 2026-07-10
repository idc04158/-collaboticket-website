import fs from "fs"
import path from "path"
import { marked } from "marked"

import { fixMarkdownHygiene } from "../lib/insight-markdown-hygiene.mjs"
import { normalizeInsightKorean } from "../lib/insight-language-rules.mjs"
import { polishInsightCopy } from "../lib/insight-plaintext-polish.mjs"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

marked.setOptions({ gfm: true, breaks: true })

function sanitizeInsightBody(content) {
  let body = polishInsightCopy(fixMarkdownHygiene(normalizeInsightKorean(content)))
  body = body.replace(/^\s*\{"description"\s*:\s*"[\s\S]*?"\}\s*$/gm, "")
  body = body.replace(/^\s*\{"description"\s*:\s*"[^\n]*$/gm, "")
  body = body.replace(/^<aside[\s\S]*?<\/aside>\s*$/gm, "")
  body = body.replace(/^<script[\s\S]*?<\/script>\s*$/gm, "")
  body = body.replace(/^###\s*질문\?\s*/gm, "### ")
  body = body.replace(/^###\s*Q\d+[:.]\s*/gm, "### ")
  body = body.replace(/Mega\s*Warí/gi, "메가와리")
  body = body.replace(/Mega\s*Wari/gi, "메가와리")
  body = body.replace(/^##\s+관련 리포트\s*\n[\s\S]*?(?=^##\s+|\n*$)/gm, "")
  return body.trimEnd()
}

function stripSectionsForRender(body) {
  let next = body
  next = next.replace(/^##\s+AI 30초 요약\s*\n+[\s\S]*?(?=\n##\s+|\n!\[|\n*$)/m, "")
  next = next.replace(/^##\s+요약\s*\n+[\s\S]*?(?=\n##\s+|\n!\[|\n*$)/m, "")
  next = next.replace(/^##\s+실행 체크리스트\s*\n+[\s\S]*?(?=\n##\s+|\n*$)/m, "")
  next = next.replace(/^##\s+관련 리포트\s*\n+[\s\S]*?(?=\n##\s+|\n*$)/m, "")
  next = next.replace(/^##\s+참고\s*출처[\s\S]*?(?=^##\s+|(?![\s\S]))/gm, "")
  return next.trim()
}

function escapeNumericRangeTildes(text) {
  return text.replace(/(\d+(?:\.\d+)?)~(\d+(?:\.\d+)?)/g, "$1\\~$2")
}

function normalizeReadableMarkdown(body) {
  const lines = body.replace(/\r\n/g, "\n").split("\n")
  const result = []
  for (const line of lines) {
    const trimmed = line.trim()
    const isTableRow = trimmed.startsWith("|") && trimmed.endsWith("|")
    const prev = result[result.length - 1]
    const prevIsTableRow = prev !== undefined && prev.trim().startsWith("|") && prev.trim().endsWith("|")
    if (isTableRow && !prevIsTableRow && prev !== undefined && prev.trim() !== "") {
      result.push("")
    }
    result.push(line)
  }
  let next = result.join("\n")
  next = next.replace(/([^\n])\n(#{1,3}\s)/g, "$1\n\n$2")
  next = next.replace(/([^\n])\n(>\s)/g, "$1\n\n$2")
  return next
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { meta: {}, body: raw }
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return { meta: {}, body: raw }
  return { body: raw.slice(end + 4).replace(/^\n/, "") }
}

const slugs = new Set(
  fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")),
)

const linkRes = [
  /\[[^\]]*\]\((\/[^)\s#]+)(#[^)\s]+)?\)/g,
  /\[[^\]]*\]\((https?:\/\/[^)\s#]+)(#[^)\s]+)?\)/g,
]

const brokenTables = []
const brokenLinks = []

for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "")
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
  const { body: rawBody } = parseFrontmatter(raw)

  for (const re of linkRes) {
    for (const match of rawBody.matchAll(re)) {
      const href = match[1]
      if (href.startsWith("/insights/")) {
        const target = href.slice("/insights/".length)
        if (!slugs.has(target)) {
          brokenLinks.push({ slug, href, text: match[0].slice(0, 80) })
        }
      }
      if (/^https?:\/\/collaboticket\//i.test(href) || /^https?:\/\/collaboticket$/i.test(href)) {
        brokenLinks.push({ slug, href, text: "malformed-host" })
      }
    }
  }

  const hasTableMd = /^\|.+\|$/m.test(rawBody)
  if (!hasTableMd) continue

  const prepared = sanitizeInsightBody(rawBody)
  const body = normalizeReadableMarkdown(stripSectionsForRender(prepared))
  const html = await marked.parse(escapeNumericRangeTildes(body))

  if (!html.includes("<table") && /\|.+\|/.test(body)) {
    brokenTables.push({ slug, tableLines: body.split("\n").filter((l) => l.trim().startsWith("|")).length })
  }
}

console.log(`Broken links: ${brokenLinks.length}`)
for (const item of brokenLinks) {
  console.log(`  [${item.slug}] ${item.href}`)
}

console.log(`\nBroken tables after pipeline: ${brokenTables.length}`)
for (const item of brokenTables) {
  console.log(`  ${item.slug} (${item.tableLines} table lines)`)
}

process.exitCode = brokenLinks.length + brokenTables.length > 0 ? 1 : 0
