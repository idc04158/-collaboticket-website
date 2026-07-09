#!/usr/bin/env node
/** List all Poomgo e-commerce articles with og metadata from listing HTML. */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LIST_URL = "https://poomgo.com/blog/e-commerce"

async function fetchArticleMeta(slug) {
  const url = `https://poomgo.com/blog/e-commerce/${slug}`
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
  const html = await r.text()
  const title =
    html.match(/property="og:title" content="([^"]+)"/)?.[1]?.replace(/\s*[｜|].*품고.*$/, "").trim() || slug
  const description = html.match(/property="og:description" content="([^"]+)"/)?.[1] || ""
  const date = html.match(/"publishedAt":"(\d{4}-\d{2}-\d{2})/)?.[1] || ""
  return { slug, title, description, date, url }
}

function extractSlugs(html) {
  return [...new Set([...html.matchAll(/\/blog\/e-commerce\/([a-z0-9-]+)/g)].map((m) => m[1]))].filter(
    (s) => !s.startsWith("page-"),
  )
}

function isJapanTopic(a) {
  const t = `${a.title} ${a.description} ${a.slug}`.toLowerCase()
  if (/미국|us-|global-seeding|kbeauty-us|fedex-global|jeju|네이버|cafe24/.test(t)) return false
  return /일본|japan|jp-|큐텐|qoo10|메가와리|megawari|라쿠텐|rakuten|아마존|amazon|틱톡|tiktok|관세|통관|k-뷰티.*진출|kbeauty.*jp|일본/.test(
    `${a.title} ${a.description}`,
  )
}

async function main() {
  const listHtml = await (await fetch(LIST_URL)).text()
  const slugs = extractSlugs(listHtml)
  console.log(`Fetching ${slugs.length} articles...`)

  const all = []
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i]
    try {
      const meta = await fetchArticleMeta(slug)
      all.push(meta)
      if ((i + 1) % 10 === 0) console.log(`${i + 1}/${slugs.length}`)
    } catch (e) {
      console.warn("skip", slug, e.message)
    }
    await new Promise((r) => setTimeout(r, 250))
  }

  const japan = all.filter(isJapanTopic)
  const out = path.join(__dirname, "poomgo-japan-articles.json")
  fs.writeFileSync(out, JSON.stringify({ all: all.length, japan: japan.length, articles: japan }, null, 2), "utf8")
  console.log(`Saved ${japan.length} Japan topics to ${out}`)
  japan.slice(0, 15).forEach((a, i) => console.log(`${i + 1}. [${a.date}] ${a.title}`))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
