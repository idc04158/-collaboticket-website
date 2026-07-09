import { INSIGHT_PUBLISH_ORDER } from "@/lib/insight-publish-order"

type InsightForPath = {
  slug: string
  category: string
  platforms: string[]
  topics: string[]
  tags: string[]
  date: string
}

type InsightGroup =
  | "market"
  | "qoo10"
  | "rakuten"
  | "amazon"
  | "review"
  | "sns"
  | "logistics"
  | "strategy"

const GROUP_KEYWORDS: Record<InsightGroup, string[]> = {
  qoo10: ["qoo10", "megawari", "큐텐"],
  rakuten: ["rakuten", "라쿠텐"],
  amazon: ["amazon", "fba", "아마존"],
  review: ["review", "리뷰", "cosme", "lips"],
  sns: ["sns", "influencer", "인플루언서", "ugc", "line", "tiktok", "콘텐츠"],
  logistics: ["logistics", "물류", "통관", "shipping", "3pl", "crm-followup", "customer-support"],
  strategy: ["entry", "roadmap", "localization", "launch-order", "channel-strategy", "consulting", "price-policy", "brand-trust"],
  market: ["market", "ec-", "ecommerce", "시장", "kpi", "keyword", "consumer-behavior", "faq"],
}

/** Topic chains ordered for natural reading → execution → consultation. */
const READING_CHAINS: Record<InsightGroup, readonly string[]> = {
  market: [
    "japan-ecommerce-2025",
    "japan-ec-consumer-behavior-search-insight",
    "japan-ec-market-trends-2026",
    "japan-ec-keyword-map-2026",
    "japan-ec-kpi-dashboard",
    "japan-ec-channel-entry-strategy",
    "kbeauty-japan-entry-roadmap",
    "japan-entry-consulting-agenda",
    "japan-ecommerce-faq-50",
  ],
  strategy: [
    "japan-ec-channel-entry-strategy",
    "japan-entry-consulting-agenda",
    "kbeauty-japan-entry-roadmap",
    "product-localization-checklist-jp",
    "ec-detail-page-localization",
    "qoo10-launch-checklist-30days",
    "case-study-experience-influencer-43",
    "japan-ecommerce-faq-50",
  ],
  qoo10: [
    "qoo10-launch-checklist-30days",
    "qoo10-megawari-prep-plan",
    "qoo10-megawari-live-commerce-strategy",
    "amazon-japan-review-velocity",
    "search-to-conversion-flow-japan",
    "case-study-experience-influencer-43",
    "japan-entry-consulting-agenda",
  ],
  rakuten: [
    "rakuten-amazon-launch-basics",
    "rakuten-vs-amazon",
    "rakuten-seo-title-structure",
    "rakuten-super-sale-ops",
    "search-to-conversion-flow-japan",
    "japan-ec-kpi-dashboard",
    "japan-entry-consulting-agenda",
  ],
  amazon: [
    "rakuten-amazon-launch-basics",
    "amazon-japan-fba-onboarding",
    "amazon-japan-review-velocity",
    "fba-vs-3pl-japan",
    "search-to-conversion-flow-japan",
    "case-study-experience-influencer-43",
    "japan-entry-consulting-agenda",
  ],
  review: [
    "japan-review-structure",
    "amazon-japan-review-velocity",
    "cosme-lips-review-operations",
    "cosme-logo-data-buzz-gap-2026-july",
    "review-proof-report-format",
    "qoo10-launch-checklist-30days",
    "case-study-experience-influencer-43",
    "japan-entry-consulting-agenda",
  ],
  sns: [
    "japan-sns-brand-trust",
    "japan-sns-content-calendar",
    "influencer-matching-metrics",
    "influencer-brief-template-jp",
    "japan-ugc-conversion-playbook",
    "line-official-account-funnel",
    "case-study-experience-influencer-43",
    "japan-entry-consulting-agenda",
  ],
  logistics: [
    "fba-vs-3pl-japan",
    "amazon-japan-fba-onboarding",
    "cross-border-shipping-cost-model",
    "customs-risk-checklist-japan",
    "logistics-corporate-ecommerce",
    "jp-customer-support-sop",
    "japan-entry-consulting-agenda",
  ],
}

const CONVERSION_SLUGS = [
  "japan-entry-consulting-agenda",
  "case-study-experience-influencer-43",
  "japan-ecommerce-faq-50",
  "qoo10-launch-checklist-30days",
  "japan-ec-channel-entry-strategy",
] as const

export function detectInsightGroup(slug: string): InsightGroup {
  const slugLower = slug.toLowerCase()
  const order: InsightGroup[] = ["qoo10", "rakuten", "amazon", "review", "sns", "logistics", "strategy", "market"]
  for (const group of order) {
    if (GROUP_KEYWORDS[group].some((kw) => slugLower.includes(kw))) {
      return group
    }
  }
  return "market"
}

function uniqueSlugs(slugs: string[]) {
  return [...new Set(slugs)]
}

function scoreFallbackCandidate(current: InsightForPath, candidate: InsightForPath) {
  let score = 0
  if (candidate.category === current.category) score += 2
  score += candidate.platforms.filter((p) => current.platforms.includes(p)).length * 3
  score += candidate.topics.filter((t) => current.topics.includes(t)).length * 2
  score += candidate.tags.filter((t) => current.tags.includes(t)).length

  const currentIdx = INSIGHT_PUBLISH_ORDER.indexOf(current.slug as (typeof INSIGHT_PUBLISH_ORDER)[number])
  const candidateIdx = INSIGHT_PUBLISH_ORDER.indexOf(candidate.slug as (typeof INSIGHT_PUBLISH_ORDER)[number])
  if (currentIdx >= 0 && candidateIdx > currentIdx && candidateIdx - currentIdx <= 10) {
    score += 4
  }

  if (candidate.category === "Execution Guide" || candidate.category === "Case Study") score += 3
  if ((CONVERSION_SLUGS as readonly string[]).includes(candidate.slug)) score += 2

  return score
}

export function getFollowUpSlugs(currentSlug: string, availableSlugs: Set<string>, limit = 3) {
  const group = detectInsightGroup(currentSlug)
  const chain = READING_CHAINS[group]
  const picks: string[] = []

  const chainIndex = chain.indexOf(currentSlug)
  if (chainIndex >= 0) {
    picks.push(...chain.slice(chainIndex + 1))
  } else {
    picks.push(...chain)
  }

  for (const slug of CONVERSION_SLUGS) {
    if (picks.length >= limit + 2) break
    picks.push(slug)
  }

  return uniqueSlugs(picks)
    .filter((slug) => slug !== currentSlug && availableSlugs.has(slug))
    .slice(0, limit)
}

export function getFollowUpInsights<T extends InsightForPath>(current: T, all: T[], limit = 3): T[] {
  const available = new Set(all.map((post) => post.slug))
  const orderedSlugs = getFollowUpSlugs(current.slug, available, limit)

  const bySlug = new Map(all.map((post) => [post.slug, post]))
  const picked = orderedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((post): post is T => Boolean(post))

  if (picked.length >= limit) {
    return picked.slice(0, limit)
  }

  const pickedSet = new Set([current.slug, ...picked.map((post) => post.slug)])
  const fallback = all
    .filter((post) => !pickedSet.has(post.slug))
    .map((post) => ({ post, score: scoreFallbackCandidate(current, post) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .map(({ post }) => post)

  return [...picked, ...fallback].slice(0, limit)
}
