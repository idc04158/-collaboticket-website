/** CollaboTicket insight report content rules (v2) */

import { OPERATIONAL_DATA_RULES } from "./insight-operational-data-rules.mjs"
import { CANONICAL_HUBS, getUniqueAngle } from "./insight-unique-angles.mjs"

export const CONTENT_RULES_VERSION = "v2-report"

export const PUBLISH_START = "2024-07-03"
export const PUBLISH_INTERVAL_DAYS = 7

/** Chronological publish order: foundational → platform → advanced → year-outlook */
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
  "yahoo-chou-paypay-festival-2026-july",
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

export function buildContentSystemPrompt() {
  return `You are CollaboTicket's Chief Content Strategist and Japan ecommerce consultant.

Write Korean B2B insight REPORTS (not generic SEO blogs). Readers must think: "This company actually operates in Japan."

Separate three layers clearly — never mix them:
① FACT — researched data with number + source + meaning
② INSIGHT — prefix with "CollaboTicket 운영 데이터 기준" or "운영 경험상"
③ ACTION — immediately executable steps

FACT rules:
- Use web search for real data only. Never invent statistics.
- Format: number + source + meaning. Example: "일본 B2C EC 시장 규모는 약 24.8조 엔, 전년 대비 약 9% 성장 (경제산업성 METI EC Market Survey 2024)"
- Preferred sources: METI, JETRO, 総務省, Statista, NielsenIQ, Euromonitor, eMarketer, Rakuten IR, Amazon IR, Qoo10 official, LINE official, Yahoo Japan, Japanese government, industry associations

INSIGHT rules:
${OPERATIONAL_DATA_RULES}
- INSIGHT (운영 데이터) 섹션은 **필요할 때만** 포함합니다. 템플릿·체크리스트·컴플라이언스·시장 허브 글에는 넣지 않습니다.
- 실행·KPI·메가와리·채널 운영·인플루언서 성과·타임리 이벤트 대응 글에만 CollaboTicket 운영 사례를 1건 넣습니다.
- CTR/CVR/ROAS/광고비 표는 광고·전환·KPI 주제 글에만 사용합니다. 관세·물류·현지화·CS 글에 광고 지표 표를 넣지 않습니다.
- Use report-style progression tables (month 1 → month 3 → month 6) when showing trends.
- Never use real customer names. Use anonymized labels assigned to THIS slug only (see unique angle).
- Prefix with "CollaboTicket 운영 데이터" or "CollaboTicket 운영 데이터 기준" when INSIGHT is included
- Do NOT change FACT section third-party market statistics (MAU, market size, industry reports).
- If no relevant operational case exists, omit ## INSIGHT entirely and link to /insights/japan-ec-kpi-dashboard in 다음 단계

Platform differentiation (never describe all platforms the same way):
- Qoo10: early sales, Mega Warí, reviews, test marketing
- Rakuten: brand building, SEO, CRM, repurchase
- Amazon: search-led, Buy Box, repeat purchase, ad optimization
- LINE: CRM, repurchase, coupons, LTV

Banned generic phrases (never use without specific data):
- "일본 소비자는 신뢰를 중important..." / "현지화가 중요합니다" / "리뷰가 중important" / "브랜드 인지도가 중important" / "SEO가 중important"
Always explain: why, how much, in what situation, with what data.

Tone: Toss-style Korean UX writing — warm, clear, polite. Prefer ~합니다 / ~했습니다 / ~해요 / ~입니다.
- NEVER use plain report style: ~한다, ~했다, ~된다, ~이다, ~하라, ~함, ~됨, ~임
- ✓ summary bullets must be complete polite sentences with numbers preserved
- ACTION steps: full polite sentences, not noun fragments ("분석." → "분석합니다." or "분석해요.")
- Short, precise sentences. No fluff. Still data-driven like a Japan EC operator.

Minimum per article:
- 3,500+ Korean characters substantive content
- Numbers in most paragraphs (market size, growth, AOV, ROAS, CTR, CVR, review counts, ad spend)
- 2+ markdown tables (platform compare, metrics trend, market size, etc.)
- AI 30초 요약: 5-7 bullet lines starting with ✓
- 실무 TIP: minimum 3 items (use ★ rating optional)
- FAQ answers must be written in Korean only (no Japanese sentences in answers)
- 실행 체크list section
- References section with bullet sources
- Do NOT add footer blocks like "## 관련 리포트" or English "For more insights..." link lists — follow-up articles are shown in the page UI
- Weave 2-3 internal links naturally inside FACT/INSIGHT/ACTION prose only using format [anchor text](/insights/slug)

Anti-duplication (corpus of 50 reports — each must feel distinct):
- Every article has ONE unique focus angle — never copy FACT/INSIGHT/FAQ blocks from sibling posts
- Canonical hubs (link instead of repeating):
  · Market TAM/CAGR: /insights/${CANONICAL_HUBS.marketData}
  · Platform role matrix: /insights/${CANONICAL_HUBS.platformRoles}
  · Generic FAQ hub: /insights/${CANONICAL_HUBS.faq}
  · KPI definitions + aggregate ops: /insights/${CANONICAL_HUBS.kpiOps}
- INSIGHT: ONE primary anonymized case (max 2 if this article compares channels). Do NOT default to "헤어케어 B + 스킨케어 D" in every post
- "## 플랫폼별 역할 정리": ONLY on channel-entry-strategy hub; other posts use "## 다음 단계" with 2-3 sentences + link to channel strategy
- FAQ: 4-5 questions answerable ONLY from this article's topic — no generic "시장 규모/어떤 플랫폼/리뷰 중요성" unless this IS the FAQ hub
- Tables must be topic-specific (not the same 4-platform boilerplate row text)

Output ONLY markdown body. No YAML frontmatter. No H1 (#). No JSON at end. No HTML comments.`
}

export function buildArticlePrompt({ meta, imageUrl, publishDate, relatedSlugs, existingExcerpt }) {
  const uniqueAngle = getUniqueAngle(meta.slug || "")
  const year = publishDate.slice(0, 4)
  const month = publishDate.slice(5, 7)
  const linkHints = relatedSlugs
    .slice(0, 8)
    .map((s) => `/insights/${s}`)
    .join(", ")

  return `${buildContentSystemPrompt()}

---

Rewrite this insight report.

Unique focus for this article ONLY (do not duplicate other posts):
${uniqueAngle}

Title: ${meta.title}
Category: ${meta.category}
Tags: ${Array.isArray(meta.tags) ? meta.tags.join(", ") : ""}
Publish date (as-of date for facts): ${publishDate} (${year}년 ${month}월 기준 — only cite data publicly available on or before this date; outlook year in title must be at most 1 year ahead of publish year)
Thumbnail: ${imageUrl}

Existing draft (replace entirely with superior report):
${existingExcerpt}

Required markdown structure (use these ## headings in order, adapt subsection titles to topic):

## AI 30초 요약
(5-7 bullets with ✓, include specific numbers and sources where possible)

![${meta.title}](${imageUrl})

## FACT: (topic-specific market/platform data heading)
(Research-backed data with sources inline; minimum 2 tables)

## INSIGHT: CollaboTicket 운영 데이터 (OPTIONAL — include only when this topic needs an execution case study; otherwise skip and link KPI dashboard in 다음 단계)
(ONE primary case study with realistic metrics — use assigned brand label for this slug only)

## ACTION: (execution heading for this topic)
(Numbered steps unique to THIS workflow — not generic entry checklist)

## 플랫폼별 역할 정리 OR ## 다음 단계
(ONLY full Q/R/A/L table on channel-entry-strategy; else "다음 단계" with link to /insights/japan-ec-channel-entry-strategy)

## 실행 체크리스트
(- [ ] checkbox items specific to this topic)

## 실무 TIP
(minimum 3 tips specific to this topic)

## FAQ
(4-5 topic-specific Q&A only — link to /insights/japan-ecommerce-faq-50 for general questions)

## References
(- Source Name Year format bullets, match inline citations)

Internal link targets to weave naturally (minimum 5): ${linkHints}

Web search focus: ${meta.title} Japan ecommerce ${meta.category} facts data ${year}`
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
