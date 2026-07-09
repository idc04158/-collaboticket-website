/** Home weekly briefing selection + channel labels. @see scripts/insight-content-rules-registry.mjs — id: home-briefing-diversity */
import type { InsightEnriched } from "@/lib/insight-hub"
import { getInsightCategoryLabel } from "@/lib/insight-categories"

const BRIEFING_BUCKET_LABELS: Record<string, string> = {
  yahoo: "Yahoo",
  cosme: "@cosme",
  tiktok: "TikTok",
  rakuten: "Rakuten",
  amazon: "Amazon",
  line: "LINE",
  influencer: "인플루언서",
  logistics: "물류·통관",
  sns: "SNS",
  review: "리뷰",
  beauty: "K-Beauty",
  wellness: "건강기능식품",
  qoo10: "Qoo10",
  market: "시장 분석",
  strategy: "전략",
}

const BRIEFING_BUCKET_EMOJI: Record<string, string> = {
  yahoo: "🛍️",
  cosme: "💄",
  tiktok: "🎥",
  rakuten: "📈",
  amazon: "📦",
  line: "💬",
  influencer: "👥",
  logistics: "🚚",
  sns: "🎥",
  review: "⭐",
  beauty: "🧴",
  wellness: "💊",
  qoo10: "💄",
  market: "📊",
  strategy: "🎯",
}

function postText(post: InsightEnriched) {
  return [post.slug, post.title, post.description, post.tags.join(" "), post.category]
    .join(" ")
    .toLowerCase()
}

function postHeadline(post: InsightEnriched) {
  return `${post.slug} ${post.title}`.toLowerCase()
}

export function getBriefingBucket(post: InsightEnriched): string {
  const text = postText(post)
  const headline = postHeadline(post)

  if (post.platforms.includes("Yahoo") || /yahoo|paypay|야후|超paypay/.test(text)) return "yahoo"
  if (/cosme|@cosme|립스|lips/.test(text)) return "cosme"
  if (post.platforms.includes("TikTok") || /tiktok|틱톡/.test(text)) return "tiktok"
  if (post.industries.includes("화장품") || /k-beauty|kbeauty|뷰티|beauty|화장품/.test(text)) return "beauty"
  if (post.industries.includes("건강기능식품") || /건강|wellness|헬스/.test(text)) return "wellness"
  if (
    post.category === "Logistics" ||
    /물류|통관|관세|acp|fulfillment/.test(headline)
  ) {
    return "logistics"
  }
  if (post.topics.includes("SNS") || post.category === "SNS Marketing" || /\bsns\b|숏폼|ugc/.test(text)) {
    return "sns"
  }
  if (post.topics.includes("인플루언서") || /influencer|인플루언서/.test(text)) return "influencer"
  if (post.topics.includes("리뷰") || post.category === "Review Strategy" || /리뷰|review/.test(text)) {
    return "review"
  }
  if (post.platforms.includes("Rakuten") || /rakuten|라쿠텐|楽天/.test(text)) return "rakuten"
  if (post.platforms.includes("Amazon") || /amazon|아마존|fba/.test(text)) return "amazon"
  if (post.platforms.includes("LINE") || /\bline\b|라인/.test(text)) return "line"
  if (post.platforms.includes("Qoo10") || /qoo10|메가와리|megawari|큐텐/.test(text)) return "qoo10"
  if (post.topics.includes("시장분석") || post.category === "Market Analysis" || /시장|트렌드|keyword|키워드/.test(text)) {
    return "market"
  }
  if (post.category === "Strategy" || post.category === "Strategy Guide" || /전략|strategy/.test(text)) {
    return "strategy"
  }

  return `category:${post.category}`
}

export function getBriefingChannelLabel(post: InsightEnriched): string {
  const bucket = getBriefingBucket(post)
  if (bucket.startsWith("category:")) {
    return getInsightCategoryLabel(post.category)
  }
  return BRIEFING_BUCKET_LABELS[bucket] ?? getInsightCategoryLabel(post.category)
}

export function getBriefingEmoji(post: InsightEnriched): string {
  const bucket = getBriefingBucket(post)
  if (bucket.startsWith("category:")) return "🇯🇵"
  return BRIEFING_BUCKET_EMOJI[bucket] ?? "🇯🇵"
}

/** Pick latest posts while maximizing category/platform diversity for the home briefing list. */
export function selectDiverseBriefingPosts(posts: InsightEnriched[], limit = 5): InsightEnriched[] {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  const picked: InsightEnriched[] = []
  const usedBuckets = new Set<string>()

  for (const post of sorted) {
    if (picked.length >= limit) break
    const bucket = getBriefingBucket(post)
    if (usedBuckets.has(bucket)) continue
    picked.push(post)
    usedBuckets.add(bucket)
  }

  for (const post of sorted) {
    if (picked.length >= limit) break
    if (!picked.some((item) => item.slug === post.slug)) {
      picked.push(post)
    }
  }

  return picked.slice(0, limit)
}
