#!/usr/bin/env node
/**
 * Cluster Amazon Japan news into CollaboTicket insight topics.
 * Dedupes against existing content/blog slugs and titles.
 *
 * Usage:
 *   node scripts/select-amazon-topics.mjs
 *   node scripts/select-amazon-topics.mjs --count 12
 *   node scripts/select-amazon-topics.mjs --count 2 --weekly
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, "..", "content", "blog")
const RAW_PATH = path.join(__dirname, "amazon-news-raw.json")
const MANIFEST_PATH = path.join(__dirname, "amazon-news-manifest.json")
const SEEN_PATH = path.join(__dirname, "amazon-news-seen-slugs.json")

const TOPIC_BUCKETS = [
  {
    id: "buy-box",
    keywords: ["buy box", "バイボックス", "ショッピングカート", "カート獲得", "featured offer"],
    slugBase: "amazon-japan-buy-box-defense",
    title: "Amazon Japan Buy Box를 뺏겼다면 가격보다 먼저 볼 3가지",
    category: "Open Market",
    tags: ["Amazon", "Buy Box", "운영"],
    angle: "Buy Box 점유율 방어를 위한 가격·재고·배송 SLA 삼각 운영. 프라임 세일 런북·FBA 입고 가이드 반복 금지.",
    metricFocus: "Buy Box 점유율",
    brandType: "생활용품",
  },
  {
    id: "sponsored-ads",
    keywords: ["sponsored", "スポンサー", "広告", "広告費", "ppc", "スポンサープロダクト"],
    slugBase: "amazon-japan-sponsored-ads-roi",
    title: "Amazon Japan 광고비는 쓰는데 매출이 안 오를 때 예산 배분 순서",
    category: "Open Market",
    tags: ["Amazon", "광고", "ROAS"],
    angle: "Sponsored Products/Brands/Display 예산 배분과 ACOS 방어. 범용 Meta Ads 예산론 금지.",
    metricFocus: "ACOS",
    brandType: "스킨케어",
  },
  {
    id: "prime-day",
    keywords: ["prime day", "プライムデー", "プライムセール", "prime sale", "タイムセール"],
    slugBase: "amazon-japan-prime-day-ops",
    title: "Amazon Japan 프라임데이 전에 재고·딜·광고를 맞추는 운영 순서",
    category: "Open Market",
    tags: ["Amazon", "Prime", "세일"],
    angle: "프라임데이·대형 딜의 준비-본편-후속 3구간. 2025 가을 Prime 글과 중복되는 재고 일반론 금지.",
    metricFocus: "딜 매출 비중",
    brandType: "가전소형",
  },
  {
    id: "fba-capacity",
    keywords: ["fba", "フルフィルメント", "納品", "在庫制限", "capacity", "納品制限"],
    slugBase: "amazon-japan-fba-capacity",
    title: "Amazon Japan FBA 입고가 막혔을 때 SKU 우선순위를 정하는 법",
    category: "Logistics",
    tags: ["Amazon", "FBA", "재고"],
    angle: "FBA 용량/입고 제한 시 SKU 우선순위·대체 3PL 분기. 기본 FBA 온보딩 단계 반복 금지.",
    metricFocus: "결품일수",
    brandType: "리빙",
  },
  {
    id: "review-trust",
    keywords: ["レビュー", "review", "評価", "星", "口コミ", "vine"],
    slugBase: "amazon-japan-review-trust-ops",
    title: "Amazon Japan 평점이 흔들릴 때 Vine보다 먼저 손볼 운영 포인트",
    category: "Review Strategy",
    tags: ["Amazon", "리뷰", "신뢰"],
    angle: "Vine/사진리뷰/평점 방어의 주간 리듬. review-velocity 글의 30/60/90 목표표 재사용 금지.",
    metricFocus: "평균 평점",
    brandType: "뷰티",
  },
  {
    id: "returns-a-to-z",
    keywords: ["返品", "return", "a-to-z", "保証請求", "クレーム"],
    slugBase: "amazon-japan-atoz-claim-defense",
    title: "Amazon Japan A-to-Z 클레임이 늘 때 반품 사유별로 막는 방법",
    category: "Logistics",
    tags: ["Amazon", "반품", "CS"],
    angle: "A-to-Z 클레임 사유별 CS·증빙 템플릿. 반품 운영 2026 글의 리뷰 리스크 프레임 반복 금지.",
    metricFocus: "A-to-Z 클레임률",
    brandType: "패션",
  },
  {
    id: "search-seo",
    keywords: ["検索", "seo", "キーワード", "ランキング", "検索順位", "カタログ"],
    slugBase: "amazon-japan-search-ranking",
    title: "Amazon Japan 검색 순위가 갑자기 떨어졌다면 가장 먼저 확인할 5가지",
    category: "Open Market",
    tags: ["Amazon", "검색", "SEO"],
    angle: "Amazon 검색 랭킹을 위한 타이틀/백엔드키워드/CVR 동기화. 라쿠텐 SEO 규칙 전용 표 금지.",
    metricFocus: "검색 전환율",
    brandType: "건강기능식품",
  },
  {
    id: "catalog-hijack",
    keywords: ["カタログ", "hijack", "出品者", "不正", "ブランド登録", "brand registry"],
    slugBase: "amazon-japan-catalog-hijack",
    title: "Amazon Japan 카탈로그가 뚫렸을 때 Brand Registry로 대응하는 순서",
    category: "Execution Guide",
    tags: ["Amazon", "Brand Registry", "카탈로그"],
    angle: "카탈로그 하이재킹·무단 판매자 대응과 Brand Registry 운영. 듀얼입점 체크리스트 반복 금지.",
    metricFocus: "무단 리스팅 제거 리드타임",
    brandType: "더마코스메틱",
  },
  {
    id: "fee-margin",
    keywords: ["手数料", "fee", "料金", "referral", "마진", "利益", "価格改定"],
    slugBase: "amazon-japan-fee-margin",
    title: "Amazon Japan에서 팔수록 손해 날 때 수수료·광고·FBA비를 같이 보는 법",
    category: "Open Market",
    tags: ["Amazon", "마진", "수수료"],
    angle: "추천수수료·FBA비·광고비를 한 시트에서 보는 마진 재설계. ACP/관세 가이드 수치 복붙 금지.",
    metricFocus: "공헌이익률",
    brandType: "헤어케어",
  },
  {
    id: "lightning-deal",
    keywords: ["タイムセール", "lightning", "deal", "クーポン", "割引"],
    slugBase: "amazon-japan-lightning-deal",
    title: "Amazon Japan 라이트닝딜 할인폭을 키우기 전에 막을 리뷰·재고 리스크",
    category: "Open Market",
    tags: ["Amazon", "딜", "쿠폰"],
    angle: "라이트닝딜/쿠폰의 할인폭·재고·리뷰 리스크 균형. 프라임데이 전체 런북과 분리.",
    metricFocus: "딜 전환율",
    brandType: "스낵·식품",
  },
  {
    id: "content-a-plus",
    keywords: ["a+", "ブランドストーリー", "商品ページ", "画像", "コンテンツ", "enhanced brand"],
    slugBase: "amazon-japan-aplus-content",
    title: "Amazon Japan A+는 예쁘게만 쓰는 게 아니다. 전환을 만드는 배치 순서",
    category: "Execution Guide",
    tags: ["Amazon", "A+", "PDP"],
    angle: "A+/Brand Story 모듈 배치와 PDP FAQ. 범용 PDP 12포인트 체크 전체 재나열 금지.",
    metricFocus: "PDP 체류 후 전환율",
    brandType: "뷰티툴",
  },
  {
    id: "crossborder",
    keywords: ["越境", "海外販売", "輸入", "関税", "グローバル", "cross.border", "해외"],
    slugBase: "amazon-japan-crossborder-ops",
    title: "Amazon Japan 역직구에서 지연 문의가 늘 때 배송약속·CS부터 고치는 법",
    category: "Logistics",
    tags: ["Amazon", "크로스보더", "배송"],
    angle: "역직구/크로스보더의 배송약속·통관·일본어 CS. 일반 물류 규제 리포트 복붙 금지.",
    metricFocus: "지연배송 문의율",
    brandType: "패션잡화",
  },
]

const FALLBACK_TOPICS = TOPIC_BUCKETS.map((b) => ({
  ...b,
  sourceTitles: [],
  sourcePublishers: [],
  sourceNote: "Operator topic seeded from Amazon Japan news themes (no single article copied).",
}))

function argValue(flag, fallback) {
  const idx = process.argv.indexOf(flag)
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return fallback
}

function slugify(base, dateYmd) {
  const y = dateYmd.slice(0, 4)
  const m = dateYmd.slice(5, 7)
  const months = {
    "01": "jan",
    "02": "feb",
    "03": "mar",
    "04": "apr",
    "05": "may",
    "06": "jun",
    "07": "jul",
    "08": "aug",
    "09": "sep",
    "10": "oct",
    "11": "nov",
    "12": "dec",
  }
  return `${base}-${y}-${months[m] || m}`
}

function loadExistingBlog() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
  const slugs = new Set()
  const titles = []
  for (const file of files) {
    const slug = file.replace(/\.md$/, "")
    slugs.add(slug)
    try {
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"))
      if (data.title) titles.push(String(data.title).toLowerCase())
    } catch {
      /* skip */
    }
  }
  return { slugs, titles }
}

function loadSeenSlugs() {
  try {
    return new Set(JSON.parse(fs.readFileSync(SEEN_PATH, "utf8")).slugs || [])
  } catch {
    return new Set()
  }
}

function saveSeenSlugs(slugs) {
  const prev = loadSeenSlugs()
  for (const s of slugs) prev.add(s)
  fs.writeFileSync(SEEN_PATH, JSON.stringify({ slugs: [...prev] }, null, 2), "utf8")
}

function scoreArticle(article, bucket) {
  const text = `${article.title} ${article.snippet}`.toLowerCase()
  let score = 0
  for (const kw of bucket.keywords) {
    if (text.includes(kw.toLowerCase())) score += 2
  }
  if (/amazon|アマゾン|amazon\.co\.jp/.test(text)) score += 1
  return score
}

function assignArticlesToBuckets(articles) {
  const assigned = TOPIC_BUCKETS.map((b) => ({
    ...b,
    articles: [],
    score: 0,
  }))

  for (const article of articles) {
    let best = null
    let bestScore = 0
    for (const bucket of assigned) {
      const s = scoreArticle(article, bucket)
      if (s > bestScore) {
        bestScore = s
        best = bucket
      }
    }
    if (best && bestScore > 0) {
      best.articles.push(article)
      best.score += bestScore
    }
  }
  return assigned
}

/** Mon/Thu dates for the last `weeks` weeks ending this week (Asia/Tokyo). */
function monThuBackfillDates(count = 12, now = new Date()) {
  const todayYmd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)

  const [y, m, d] = todayYmd.split("-").map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d))
  const day = utc.getUTCDay()
  const daysFromMonday = (day + 6) % 7
  const thisMonday = new Date(utc)
  thisMonday.setUTCDate(utc.getUTCDate() - daysFromMonday)

  const dates = []
  const weeksNeeded = Math.ceil(count / 2)
  for (let w = weeksNeeded - 1; w >= 0; w--) {
    const monday = new Date(thisMonday)
    monday.setUTCDate(thisMonday.getUTCDate() - w * 7)
    const thursday = new Date(monday)
    thursday.setUTCDate(monday.getUTCDate() + 3)
    dates.push(monday.toISOString().slice(0, 10))
    dates.push(thursday.toISOString().slice(0, 10))
  }
  return dates.slice(-count)
}

function titleTooSimilar(candidate, existingTitles) {
  const c = candidate.toLowerCase()
  const tokens = c.split(/[^a-z0-9가-힣ぁ-んァ-ン一-龯]+/).filter((t) => t.length > 2)
  return existingTitles.some((t) => {
    const overlap = tokens.filter((tok) => t.includes(tok)).length
    return overlap >= Math.min(4, tokens.length)
  })
}

function buildManifestItems({ count, weekly }) {
  const raw = fs.existsSync(RAW_PATH)
    ? JSON.parse(fs.readFileSync(RAW_PATH, "utf8"))
    : { articles: [] }
  const articles = raw.articles || []
  const { slugs: existingSlugs, titles: existingTitles } = loadExistingBlog()
  const seen = loadSeenSlugs()
  const dates = weekly
    ? monThuBackfillDates(2).slice(-2)
    : monThuBackfillDates(count)

  const scored = assignArticlesToBuckets(articles)
    .map((b) => ({
      ...b,
      sourceTitles: b.articles.slice(0, 3).map((a) => a.title),
      sourcePublishers: [...new Set(b.articles.slice(0, 5).map((a) => a.publisherName).filter(Boolean))],
      sourceNote:
        b.articles.length > 0
          ? `News seed cluster (${b.articles.length} hits). Rewrite fully; do not copy sentences.`
          : "Operator topic seeded from Amazon Japan news themes (no single article copied).",
    }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))

  // Prefer high-score buckets, then fill with remaining buckets / fallbacks
  const pool = scored.length ? scored : FALLBACK_TOPICS
  const selected = []
  for (const bucket of pool) {
    if (selected.length >= count) break
    const date = dates[selected.length] || dates[dates.length - 1]
    const slug = slugify(bucket.slugBase, date)
    if (existingSlugs.has(slug) || seen.has(slug)) continue
    if (titleTooSimilar(bucket.title, existingTitles)) continue
    // Skip if slugBase already covered by an existing amazon post with same focus words
    const focus = bucket.slugBase.replace("amazon-japan-", "")
    const already = [...existingSlugs].some(
      (s) => s.includes(focus) && s.startsWith("amazon-japan-") && !s.includes("prime-sale-fall"),
    )
    // Allow related but distinct topics; only hard-skip exact base duplicates in this batch
    if (selected.some((s) => s.slugBase === bucket.slugBase)) continue
    if (already && /fba-onboarding|review-velocity|returns-ops|prime-sale-fall/.test(focus)) continue

    selected.push({
      slug,
      slugBase: bucket.slugBase,
      title: bucket.title,
      category: bucket.category,
      tags: bucket.tags,
      angle: bucket.angle,
      metricFocus: bucket.metricFocus,
      brandType: bucket.brandType,
      date,
      sourceTitles: bucket.sourceTitles || [],
      sourcePublishers: bucket.sourcePublishers || [],
      sourceNote: bucket.sourceNote,
      newsScore: bucket.score || 0,
    })
  }

  // Fill remaining from fallbacks with unique dates
  for (const bucket of FALLBACK_TOPICS) {
    if (selected.length >= count) break
    if (selected.some((s) => s.slugBase === bucket.slugBase)) continue
    const date = dates[selected.length] || dates[dates.length - 1]
    const slug = slugify(bucket.slugBase, date)
    if (existingSlugs.has(slug) || seen.has(slug)) continue
    selected.push({
      slug,
      slugBase: bucket.slugBase,
      title: bucket.title,
      category: bucket.category,
      tags: bucket.tags,
      angle: bucket.angle,
      metricFocus: bucket.metricFocus,
      brandType: bucket.brandType,
      date,
      sourceTitles: [],
      sourcePublishers: [],
      sourceNote: bucket.sourceNote,
      newsScore: 0,
    })
  }

  return selected.slice(0, count)
}

async function main() {
  const count = Number(argValue("--count", process.argv.includes("--weekly") ? "2" : "12"))
  const weekly = process.argv.includes("--weekly")
  const items = buildManifestItems({ count, weekly })

  if (items.length < count) {
    console.warn(`Warning: only selected ${items.length}/${count} topics`)
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    mode: weekly ? "weekly" : "backfill",
    count: items.length,
    items,
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8")

  const slugsPath = path.join(__dirname, "amazon-news-slugs.json")
  let existingSlugsList = []
  try {
    existingSlugsList = JSON.parse(fs.readFileSync(slugsPath, "utf8")).slugs || []
  } catch {
    existingSlugsList = []
  }
  const mergedSlugs = [...new Set([...existingSlugsList, ...items.map((i) => i.slug)])]
  fs.writeFileSync(slugsPath, JSON.stringify({ slugs: mergedSlugs }, null, 2), "utf8")

  console.log(`Wrote ${items.length} topics → ${MANIFEST_PATH}`)
  console.log(`Updated slug registry → ${slugsPath} (${mergedSlugs.length} total)`)
  for (const item of items) {
    console.log(`  ${item.date}  ${item.slug}  (score=${item.newsScore})`)
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  main().catch((err) => {
    console.error(err.message || err)
    process.exit(1)
  })
}

export { buildManifestItems, MANIFEST_PATH, SEEN_PATH, saveSeenSlugs, monThuBackfillDates }
