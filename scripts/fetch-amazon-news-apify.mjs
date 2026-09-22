#!/usr/bin/env node
/**
 * Fetch Amazon Japan news via Apify (cirkit/google-news-scraper).
 * Falls back to Google News RSS when APIFY_TOKEN is missing.
 *
 * Usage:
 *   node scripts/fetch-amazon-news-apify.mjs
 *   node scripts/fetch-amazon-news-apify.mjs --time-range 30d
 *   node scripts/fetch-amazon-news-apify.mjs --max 80
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_PATH = path.join(__dirname, "amazon-news-raw.json")

const ACTOR_ID = process.env.APIFY_AMAZON_NEWS_ACTOR || "cirkit/google-news-scraper"
const QUERIES = ["アマゾン", "Amazon Japan", "Amazon.co.jp"]
const LOCALE = { hl: "ja-JP", gl: "JP", ceid: "JP:ja" }

function argValue(flag, fallback) {
  const idx = process.argv.indexOf(flag)
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return fallback
}

function normalizeItem(raw, query = "") {
  const title = (raw.title || "").replace(/\s*-\s*[^-]+$/, "").trim()
  const publishedAt =
    raw.publishedAt ||
    raw.pubDate ||
    raw.date ||
    raw.published ||
    null
  const publisherName =
    raw.publisherName ||
    raw.source ||
    raw.publisher ||
    raw.sourceName ||
    ""
  const url =
    raw.publisherUrl ||
    raw.link ||
    raw.url ||
    raw.googleNewsUrl ||
    ""
  const snippet = (raw.snippetHtml || raw.snippet || raw.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  return {
    title,
    publisherName,
    publishedAt,
    url,
    snippet,
    query: raw.query || query,
    googleNewsUrl: raw.googleNewsUrl || "",
    articleId: raw.articleId || "",
  }
}

function dedupeArticles(items) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    if (!item.title) continue
    const key = item.title.toLowerCase().replace(/\s+/g, " ").slice(0, 120)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

async function fetchViaApify({ timeRange, maxResults }) {
  const { ApifyClient } = await import("apify-client")
  const client = new ApifyClient({ token: process.env.APIFY_TOKEN })

  const input = {
    queries: QUERIES,
    topics: [],
    geos: [],
    topicIds: [],
    includeTopStories: false,
    locales: [LOCALE],
    timeRange,
    resolvePublisherUrls: true,
    maxResultsPerTarget: Math.min(50, maxResults),
    maxResults,
    maxConcurrency: 5,
    decodeConcurrency: 3,
  }

  console.log(`Apify actor: ${ACTOR_ID}`)
  console.log(`queries: ${QUERIES.join(" | ")} timeRange=${timeRange} max=${maxResults}`)

  const run = await client.actor(ACTOR_ID).call(input)
  const { items } = await client.dataset(run.defaultDatasetId).listItems()
  return items.map((item) => normalizeItem(item))
}

function parseRssItems(xml, query) {
  const items = []
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || []
  for (const block of blocks) {
    const title = (block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
      block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ||
      "")
      .replace(/<!\[CDATA\[|\]\]>/g, "")
      .trim()
    const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "").trim()
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "").trim()
    const source = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || "").trim()
    const description = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
      block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
      "")
      .replace(/<!\[CDATA\[|\]\]>/g, "")
      .trim()

    let publishedAt = null
    if (pubDate) {
      const d = new Date(pubDate)
      if (!Number.isNaN(d.getTime())) publishedAt = d.toISOString()
    }

    items.push(
      normalizeItem(
        {
          title,
          link,
          googleNewsUrl: link,
          pubDate: publishedAt,
          source,
          description,
        },
        query,
      ),
    )
  }
  return items
}

async function fetchViaRss({ maxResults }) {
  console.log("APIFY_TOKEN missing — falling back to Google News RSS")
  const collected = []
  for (const query of QUERIES) {
    const url = new URL("https://news.google.com/rss/search")
    url.searchParams.set("q", query)
    url.searchParams.set("hl", "ja")
    url.searchParams.set("gl", "JP")
    url.searchParams.set("ceid", "JP:ja")

    const res = await fetch(url, {
      headers: { "User-Agent": "CollaboTicketInsightBot/1.0" },
    })
    if (!res.ok) {
      console.warn(`RSS fail: ${query} ${res.status}`)
      continue
    }
    const xml = await res.text()
    const items = parseRssItems(xml, query)
    console.log(`RSS ok: ${query} → ${items.length}`)
    collected.push(...items)
  }
  return collected.slice(0, maxResults)
}

async function main() {
  const timeRange = argValue("--time-range", process.env.AMAZON_NEWS_TIME_RANGE || "30d")
  const maxResults = Number(argValue("--max", process.env.AMAZON_NEWS_MAX || "80"))

  const articles = process.env.APIFY_TOKEN
    ? await fetchViaApify({ timeRange, maxResults })
    : await fetchViaRss({ maxResults })

  const unique = dedupeArticles(articles)
  const payload = {
    fetchedAt: new Date().toISOString(),
    source: process.env.APIFY_TOKEN ? `apify:${ACTOR_ID}` : "google-news-rss-fallback",
    queries: QUERIES,
    locale: LOCALE,
    timeRange,
    count: unique.length,
    articles: unique,
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), "utf8")
  console.log(`Wrote ${unique.length} articles → ${OUT_PATH}`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
