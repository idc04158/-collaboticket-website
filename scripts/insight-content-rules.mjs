/** CollaboTicket insight report content rules — see insight-content-rules-registry.mjs */

import {
  buildAntiDuplicationPrompt,
  buildManagedRulePromptBlocks,
  CONTENT_RULES_VERSION,
  SANITIZE_OUTPUT_RULES_PROMPT,
} from "./insight-content-rules-registry.mjs"
import { getUniqueAngle } from "./insight-unique-angles.mjs"
import {
  buildRewriteArticlePrompt,
  getSharedSystemPrompt,
} from "../lib/ai/prompts/prompt-builder.mjs"

export { CONTENT_RULES_VERSION }

export const PUBLISH_START = "2024-07-03"
export const PUBLISH_INTERVAL_DAYS = 7

/** Chronological publish order: foundational → platform → advanced → year-outlook */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { GAP_INSIGHT_SLUGS } from "./seed-gap-insights-2025-2026.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function loadAmazonNewsSlugs() {
  try {
    const p = path.join(__dirname, "amazon-news-slugs.json")
    if (!fs.existsSync(p)) return []
    const data = JSON.parse(fs.readFileSync(p, "utf8"))
    return Array.isArray(data.slugs) ? data.slugs : []
  } catch {
    return []
  }
}

export const AMAZON_NEWS_SLUGS = loadAmazonNewsSlugs()

const YEAR_OUTLOOK_2026 = [
  "japan-ec-market-trends-2026",
  "japan-ec-keyword-map-2026",
  "japan-sns-marketing-case-patterns-2026",
  "ai-shopping-commerce-japan-2026",
]

const CORE_ORDER = [
  "japan-ecommerce-2025",
  "japan-ec-consumer-behavior-search-insight",
  "japan-ec-channel-entry-strategy",
  "japan-entry-consulting-agenda",
  "kbeauty-japan-entry-roadmap",
  "k-beauty-japan-seo-launch-playbook",
  "lifestyle-brand-japan-launch-order",
  "snack-brand-japan-channel-strategy",
  "japan-brand-trust-signals",
  "product-localization-checklist-jp",
  "ec-detail-page-localization",
  "japan-price-policy-framework",
  "rakuten-amazon-launch-basics",
  "rakuten-vs-amazon",
  "qoo10-launch-checklist-30days",
  "amazon-japan-fba-onboarding",
  "marketplace-content-reuse-system",
  "japan-ec-kpi-dashboard",
  "search-to-conversion-flow-japan",
  "rakuten-seo-title-structure",
  "rakuten-super-sale-ops",
  "qoo10-megawari-prep-plan",
  "qoo10-megawari-live-commerce-strategy",
  "amazon-japan-review-velocity",
  "japan-review-structure",
  "cosme-lips-review-operations",
  "review-proof-report-format",
  "japan-ec-ad-creative-patterns",
  "japan-sns-brand-trust",
  "japan-sns-content-calendar",
  "japan-ugc-conversion-playbook",
  "ugc-ec-conversion-japan",
  "line-official-account-funnel",
  "line-x-crm-fan-marketing-japan",
  "influencer-matching-metrics",
  "influencer-brief-template-jp",
  "influencer-performance-metrics-jp",
  "japan-influencer-marketing-case-framework",
  "case-study-experience-influencer-43",
  "fba-vs-3pl-japan",
  "cross-border-shipping-cost-model",
  "customs-risk-checklist-japan",
  "logistics-corporate-ecommerce",
  "jp-customer-support-sop",
  "crm-followup-template-japan",
]

export const PUBLISH_ORDER = [
  ...CORE_ORDER,
  ...YEAR_OUTLOOK_2026,
  "japan-ecommerce-faq-50",
  "japan-tiktok-shop-entry-ops",
  "japan-logistics-regulation-2026",
  "megawari-kpi-seven-metrics",
  "qoo10-megafor-cart-conversion",
  "megawari-closing-week-ops",
  "japan-effortless-consumer-2026",
  "japan-awareness-to-purchase-3step",
  "megawari-demand-forecast-playbook",
  "japan-customs-acp-margin-guide",
  "kbeauty-japan-ingredient-compliance",
  ...GAP_INSIGHT_SLUGS,
  "cosme-logo-data-buzz-gap-2026-july",
  "yahoo-chou-paypay-festival-2026-july",
  ...AMAZON_NEWS_SLUGS,
]

export const INTERNAL_LINK_TARGETS = PUBLISH_ORDER.map((slug) => ({
  slug,
  href: `/insights/${slug}`,
}))

export function assignPublishDate(index) {
  const start = new Date(PUBLISH_START)
  start.setDate(start.getDate() + index * PUBLISH_INTERVAL_DAYS)
  return start.toISOString().slice(0, 10)
}

export function getPublishIndex(slug) {
  const idx = PUBLISH_ORDER.indexOf(slug)
  return idx >= 0 ? idx : PUBLISH_ORDER.length + slug.charCodeAt(0)
}

export function sortPostsByPublishOrder(posts) {
  return [...posts].sort((a, b) => getPublishIndex(a.slug) - getPublishIndex(b.slug))
}

export const CASE_BRANDS = [
  "헤어케어 브랜드 B제품",
  "스킨케어 브랜드 D제품",
  "더마코스메틱 브랜드 C라인",
  "패션 브랜드 F",
  "건강기능식품 브랜드 G",
  "생활용품 브랜드 H",
]

/** Hygiene / anti-duplication extras stacked on shared rewrite system prompt. */
function buildRewriteHygieneExtras() {
  const rules = buildManagedRulePromptBlocks()
  return [
    rules.language,
    rules.titleYear,
    rules.markdownHygiene,
    SANITIZE_OUTPUT_RULES_PROMPT,
    rules.learnedFromEdits,
    buildAntiDuplicationPrompt(),
    `### 추가 작성 품질
- FAQ·본문은 한국어만. 일본어 문장 답변 금지.
- 본문에 YAML frontmatter / H1 (#) / JSON / HTML 주석 출력 금지.
- 푸터 "## 관련 리포트"·영문 For more insights 링크 목록 금지 (페이지 UI가 처리).`,
  ].filter(Boolean)
}

/**
 * Shared Insight Engine system prompt + rewrite hygiene extras.
 * Brand philosophy/voice live in lib/ai/prompts/collaboticket-system-prompt.mjs only.
 */
export function buildContentSystemPrompt() {
  return getSharedSystemPrompt("rewrite", { extraBlocks: buildRewriteHygieneExtras() })
}

/** Full rewrite prompt via Prompt Builder (system + task). */
export function buildArticlePrompt({
  meta,
  publishDate,
  relatedSlugs,
  existingExcerpt,
  sourceBrief = "",
  uniqueAngle,
}) {
  return buildRewriteArticlePrompt({
    meta,
    publishDate,
    relatedSlugs,
    existingExcerpt,
    sourceBrief,
    uniqueAngle: uniqueAngle || getUniqueAngle(meta.slug || ""),
    extraBlocks: buildRewriteHygieneExtras(),
  })
}

export function pickRelatedSlugs(slug, allSlugs, count = 8) {
  const platformGroups = {
    qoo10: ["qoo10", "megawari", "큐텐"],
    rakuten: ["rakuten", "라쿠텐"],
    amazon: ["amazon", "fba", "아마존"],
    review: ["review", "리뷰", "cosme", "lips"],
    sns: ["sns", "influencer", "인플루언서", "ugc", "line", "tiktok"],
    logistics: ["logistics", "물류", "fba", "통관", "shipping"],
    market: ["market", "ec-", "ecommerce", "시장", "kpi", "keyword"],
  }

  const slugLower = slug.toLowerCase()
  let group = "market"
  for (const [key, keywords] of Object.entries(platformGroups)) {
    if (keywords.some((k) => slugLower.includes(k))) {
      group = key
      break
    }
  }

  const clusterMap = {
    qoo10: ["qoo10-megawari-prep-plan", "qoo10-megawari-live-commerce-strategy", "qoo10-launch-checklist-30days", "amazon-japan-review-velocity", "japan-review-structure"],
    rakuten: ["rakuten-seo-title-structure", "rakuten-super-sale-ops", "rakuten-vs-amazon", "rakuten-amazon-launch-basics", "search-to-conversion-flow-japan"],
    amazon: ["amazon-japan-fba-onboarding", "amazon-japan-review-velocity", "fba-vs-3pl-japan", "rakuten-vs-amazon", "search-to-conversion-flow-japan"],
    review: ["cosme-lips-review-operations", "review-proof-report-format", "amazon-japan-review-velocity", "japan-review-structure", "qoo10-launch-checklist-30days"],
    sns: ["line-official-account-funnel", "line-x-crm-fan-marketing-japan", "japan-sns-content-calendar", "influencer-brief-template-jp", "japan-ugc-conversion-playbook"],
    logistics: ["fba-vs-3pl-japan", "cross-border-shipping-cost-model", "customs-risk-checklist-japan", "logistics-corporate-ecommerce", "amazon-japan-fba-onboarding"],
    market: ["japan-ec-market-trends-2026", "japan-ecommerce-2025", "japan-ec-kpi-dashboard", "japan-ec-channel-entry-strategy", "kbeauty-japan-entry-roadmap"],
  }

  const preferred = (clusterMap[group] || clusterMap.market).filter((s) => s !== slug && allSlugs.includes(s))
  const rest = allSlugs.filter((s) => s !== slug && !preferred.includes(s))
  return [...preferred, ...rest].slice(0, count)
}
