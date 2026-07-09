#!/usr/bin/env node
/** Extract Poomgo e-commerce article metadata from HTML (RSC payload). */

const LIST_URL = "https://poomgo.com/blog/e-commerce"

async function fetchHtml(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
  if (!r.ok) throw new Error(`${url} ${r.status}`)
  return r.text()
}

function extractSlugs(html) {
  return [...new Set([...html.matchAll(/\/blog\/e-commerce\/([a-z0-9-]+)/g)].map((m) => m[1]))].filter(
    (s) => !s.startsWith("page-"),
  )
}

function extractArticleFields(html) {
  const title =
    html.match(/property="og:title" content="([^"]+)"/)?.[1]?.replace(/ \| 품고$/, "") ||
    html.match(/<title>([^<|]+)/)?.[1]?.trim()

  const description = html.match(/property="og:description" content="([^"]+)"/)?.[1]

  const date =
    html.match(/"publishedAt":"(\d{4}-\d{2}-\d{2})/)?.[1] ||
    html.match(/"date":"(\d{4}-\d{2}-\d{2})/)?.[1]

  // Strapi blocks often embedded as escaped JSON strings
  const blocks = []
  for (const m of html.matchAll(/"type":"(paragraph|heading|list)"/g)) {
    blocks.push(m[1])
  }

  const textChunks = []
  for (const m of html.matchAll(/"text":"((?:\\.|[^"\\])*)"/g)) {
    const raw = m[1]
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    if (raw.length > 40 && /[가-힣]/.test(raw)) textChunks.push(raw)
  }

  const uniqueText = [...new Set(textChunks)]

  return { title, description, date, blockTypes: blocks.length, textChunks: uniqueText.slice(0, 30) }
}

async function main() {
  const slugArg = process.argv[2]
  if (slugArg && slugArg !== "--list") {
    const html = await fetchHtml(`https://poomgo.com/blog/e-commerce/${slugArg}`)
    console.log(JSON.stringify(extractArticleFields(html), null, 2))
    return
  }

  const listHtml = await fetchHtml(LIST_URL)
  const slugs = extractSlugs(listHtml)
  console.log(`Found ${slugs.length} slugs on listing page`)

  const articles = []
  for (const slug of slugs.slice(0, 15)) {
    await new Promise((r) => setTimeout(r, 400))
    try {
      const html = await fetchHtml(`https://poomgo.com/blog/e-commerce/${slug}`)
      const fields = extractArticleFields(html)
      articles.push({ slug, ...fields })
      console.log(`ok: ${slug} — ${fields.title?.slice(0, 50)}`)
    } catch (e) {
      console.log(`fail: ${slug}`, e.message)
    }
  }

  fs.writeFileSync(
    new URL("./poomgo-sample-articles.json", import.meta.url),
    JSON.stringify(articles, null, 2),
    "utf8",
  )
}

import fs from "fs"
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
