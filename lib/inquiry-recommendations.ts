import { INSIGHT_PUBLISH_ORDER } from "@/lib/insight-publish-order"
import type { InquiryInput } from "@/lib/inquiries"

const SERVICE_SLUGS: Record<string, string[]> = {
  "오픈마켓 운영대행": [
    "qoo10-launch-checklist-30days",
    "rakuten-amazon-launch-basics",
    "japan-ec-channel-entry-strategy",
  ],
  "SNS 마케팅/계정 운영": [
    "japan-sns-content-calendar",
    "line-official-account-funnel",
    "japan-ugc-conversion-playbook",
  ],
  "리뷰 체험단/커뮤니티 리뷰": [
    "japan-review-structure",
    "cosme-lips-review-operations",
    "amazon-japan-review-velocity",
  ],
  "인플루언서 마케팅": [
    "influencer-brief-template-jp",
    "influencer-matching-metrics",
    "case-study-experience-influencer-43",
  ],
  "물류/정산/법인 설립": [
    "fba-vs-3pl-japan",
    "cross-border-shipping-cost-model",
    "logistics-corporate-ecommerce",
  ],
  "일본 진출 전체 설계": [
    "japan-entry-consulting-agenda",
    "kbeauty-japan-entry-roadmap",
    "japan-ec-channel-entry-strategy",
  ],
}

const GOAL_SLUGS: Record<string, string[]> = {
  "일본 시장 진입 가능성 검토": ["japan-ecommerce-2025", "japan-entry-consulting-agenda", "japan-ec-kpi-dashboard"],
  "라쿠텐/Qoo10/Amazon 매출 확대": ["qoo10-megawari-prep-plan", "rakuten-super-sale-ops", "search-to-conversion-flow-japan"],
  "SNS 인지도와 브랜드 신뢰 확보": ["japan-sns-brand-trust", "japan-sns-content-calendar", "japan-ugc-conversion-playbook"],
  "리뷰 체험단/커뮤니티 리뷰 확보": ["japan-review-structure", "review-proof-report-format", "cosme-lips-review-operations"],
  "물류·정산·법인 등 운영 기반 구축": ["fba-vs-3pl-japan", "customs-risk-checklist-japan", "jp-customer-support-sop"],
  "전체 일본 판매 구조 설계": ["japan-ec-channel-entry-strategy", "kbeauty-japan-entry-roadmap", "japan-entry-consulting-agenda"],
}

const CATEGORY_SLUGS: Record<string, string[]> = {
  스킨: ["kbeauty-japan-entry-roadmap", "cosme-lips-review-operations"],
  뷰티: ["kbeauty-japan-entry-roadmap", "cosme-lips-review-operations"],
  화장품: ["kbeauty-japan-entry-roadmap", "product-localization-checklist-jp"],
  건강: ["japan-ecommerce-faq-50", "customs-risk-checklist-japan"],
  식품: ["customs-risk-checklist-japan", "cross-border-shipping-cost-model"],
  패션: ["product-localization-checklist-jp", "japan-ec-consumer-behavior-search-insight"],
}

const FALLBACK_SLUGS = [
  "japan-entry-consulting-agenda",
  "japan-ec-channel-entry-strategy",
  "qoo10-launch-checklist-30days",
] as const

const published = new Set(INSIGHT_PUBLISH_ORDER)

function pickPublished(slugs: string[]) {
  return slugs.filter((slug) => published.has(slug))
}

export function recommendInsightSlugsForInquiry(input: InquiryInput, limit = 3): string[] {
  const ordered: string[] = []

  for (const service of input.services) {
    ordered.push(...pickPublished(SERVICE_SLUGS[service] || []))
  }

  ordered.push(...pickPublished(GOAL_SLUGS[input.goal] || []))

  const category = input.category.toLowerCase()
  for (const [key, slugs] of Object.entries(CATEGORY_SLUGS)) {
    if (category.includes(key)) {
      ordered.push(...pickPublished(slugs))
    }
  }

  ordered.push(...pickPublished([...FALLBACK_SLUGS]))

  const unique: string[] = []
  for (const slug of ordered) {
    if (!unique.includes(slug)) unique.push(slug)
    if (unique.length >= limit) break
  }

  return unique
}
