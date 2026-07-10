import type { InsightMeta } from "@/lib/insights"
import { getInsightCategoryLabel } from "@/lib/insight-categories"
import { getFollowUpInsights } from "@/lib/insight-reading-paths"
import { polishInsightCopy } from "@/lib/insight-plaintext-polish.mjs"

export type InsightDifficulty = "입문" | "실무" | "전문가"

export type InsightEnriched = InsightMeta & {
  readingTimeMinutes: number
  difficulty: InsightDifficulty
  platforms: string[]
  topics: string[]
  industries: string[]
  audience: string
  aiSummary: string
  checklist: string[]
}

export const INSIGHT_FILTER_GROUPS = {
  platforms: ["Qoo10", "Rakuten", "Amazon", "Yahoo", "Meta", "TikTok", "LINE"] as const,
  topics: ["시장분석", "전략", "리뷰", "광고", "SNS", "인플루언서", "물류"] as const,
  industries: ["화장품", "건강기능식품", "식품", "패션", "생활용품"] as const,
  difficulties: ["입문", "실무", "전문가"] as const,
}

const PLATFORM_KEYWORDS: Record<(typeof INSIGHT_FILTER_GROUPS.platforms)[number], string[]> = {
  Qoo10: ["qoo10", "큐텐", "메가와리", "megawari"],
  Rakuten: ["rakuten", "라쿠텐", "楽天"],
  Amazon: ["amazon", "아마존", "fba"],
  Yahoo: ["yahoo", "야후"],
  Meta: ["meta", "facebook", "instagram", "페이스북", "인스타"],
  TikTok: ["tiktok", "틱톡"],
  LINE: ["line", "라인"],
}

const TOPIC_KEYWORDS: Record<(typeof INSIGHT_FILTER_GROUPS.topics)[number], string[]> = {
  시장분석: ["시장", "트렌드", "데이터", "키워드", "소비자"],
  전략: ["전략", "로드맵", "프레임", "채널", "진출"],
  리뷰: ["리뷰", "신뢰", "cosme", "lips", "후기"],
  광고: ["광고", "cpc", "roas", "크리에이티브", "meta", "google"],
  SNS: ["sns", "소셜", "콘텐츠", "캘린더", "ugc"],
  인플루언서: ["인플루언서", "influencer", "협찬", "체험단"],
  물류: ["물류", "fba", "통관", "배송", "3pl", "fulfillment"],
}

const INDUSTRY_KEYWORDS: Record<(typeof INSIGHT_FILTER_GROUPS.industries)[number], string[]> = {
  화장품: ["뷰티", "beauty", "k-beauty", "화장품", "코스메", "스킨"],
  건강기능식품: ["건강", "헬스", "wellness", "영양"],
  식품: ["식품", "snack", "푸드", "food"],
  패션: ["패션", "fashion", "의류"],
  생활용품: ["생활", "lifestyle", "라이프스타일", "리빙"],
}

const AUDIENCE_BY_CATEGORY: Record<string, string> = {
  Insight: "일본 진출 검토 브랜드",
  "Market Analysis": "데이터 기반 의사결정이 필요한 팀",
  "Case Study": "실행 사례가 필요한 실무자",
  Strategy: "채널·예산 설계 담당자",
  "Strategy Guide": "전략 수립 담당자",
  "Execution Guide": "입점·운영 실무자",
  "SNS Marketing": "SNS·콘텐츠 담당자",
  "Review Strategy": "리뷰·전환율 개선 담당자",
  "Open Market": "오픈마켓 운영 담당자",
  Logistics: "물류·통관 담당자",
}

function normalizeText(meta: InsightMeta, content = "") {
  return [meta.title, meta.description, meta.category, meta.tags.join(" "), content]
    .join(" ")
    .toLowerCase()
}

function matchGroup<T extends string>(
  text: string,
  map: Record<T, string[]>,
  allowed: readonly T[],
): T[] {
  const matched = new Set<T>()
  for (const key of allowed) {
    if (map[key].some((kw) => text.includes(kw.toLowerCase()))) {
      matched.add(key)
    }
  }
  return [...matched]
}

export function inferDifficulty(meta: InsightMeta, content: string): InsightDifficulty {
  const text = normalizeText(meta, content)
  if (
    meta.category === "Execution Guide" ||
    text.includes("체크리스트") ||
    text.includes("입문") ||
    text.includes("30일")
  ) {
    return "입문"
  }
  if (
    meta.category === "Market Analysis" ||
    meta.category === "Case Study" ||
    text.includes("kpi") ||
    text.includes("프레임")
  ) {
    return "실무"
  }
  return "전문가"
}

export function estimateReadingTime(content: string, description: string) {
  const chars = (content + description).replace(/\s/g, "").length
  return Math.max(6, Math.min(22, Math.ceil(chars / 850)))
}

export function extractSummaryParagraph(content: string) {
  const aiSummaryMatch = content.match(/^##\s+AI 30초 요약\s*\n+([\s\S]*?)(?=\n##|\n!\[|\n*$)/m)
  if (aiSummaryMatch) {
    return polishInsightCopy(
      aiSummaryMatch[1]
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/^✓\s*/gm, "")
        .replace(/^-\s*/gm, "")
        .trim(),
    )
  }

  const summaryMatch = content.match(/^##\s+요약\s*\n+([\s\S]*?)(?=\n##|\n!\[|\n*$)/m)
  if (summaryMatch) {
    return polishInsightCopy(
      summaryMatch[1].replace(/!\[[^\]]*\]\([^)]+\)/g, "").replace(/\[[^\]]*\]\([^)]+\)/g, "").trim(),
    )
  }
  return ""
}

export function extractChecklist(content: string) {
  const sectionMatch = content.match(
    /^##\s+(?:실무 체크리스트|실행 전 체크리스트|실행 체크리스트|체크리스트)\s*\n+([\s\S]*?)(?=\n##|\n*$)/m,
  )
  if (!sectionMatch) return []

  return sectionMatch[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s+\[[ x]\]\s*/, "").replace(/^[-*]\s+/, "").trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .slice(0, 8)
}

export function enrichInsight(meta: InsightMeta, content = ""): InsightEnriched {
  const text = normalizeText(meta, content)
  const summary = extractSummaryParagraph(content)

  return {
    ...meta,
    readingTimeMinutes: estimateReadingTime(content, meta.description),
    difficulty: inferDifficulty(meta, content),
    platforms: matchGroup(text, PLATFORM_KEYWORDS, INSIGHT_FILTER_GROUPS.platforms),
    topics: matchGroup(text, TOPIC_KEYWORDS, INSIGHT_FILTER_GROUPS.topics),
    industries: matchGroup(text, INDUSTRY_KEYWORDS, INSIGHT_FILTER_GROUPS.industries),
    audience: AUDIENCE_BY_CATEGORY[meta.category] || "일본 진출 실무자",
    aiSummary: summary || meta.description,
    checklist: extractChecklist(content),
  }
}

export function getHubStats(posts: InsightMeta[]) {
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(now.getDate() - 7)

  const weeklyNew = posts.filter((post) => {
    if (!post.date) return false
    return new Date(post.date) >= weekAgo
  }).length

  const latestDate = posts[0]?.date || new Date().toISOString().slice(0, 10)

  return {
    weeklyNewReports: weeklyNew,
    totalInsights: posts.length,
    platformCount: INSIGHT_FILTER_GROUPS.platforms.length,
    lastUpdated: latestDate,
  }
}

export function getFeaturedReport(posts: InsightEnriched[]) {
  return posts[0] ?? null
}

export function getFeaturedReports(posts: InsightEnriched[], limit = 5) {
  return posts.slice(0, Math.max(1, limit))
}

export function getWeeklyBriefLines(posts: InsightEnriched[]) {
  const lines = posts.slice(0, 3).map((post) => {
    const platform = post.platforms[0] || getInsightCategoryLabel(post.category)
    const topic = post.topics[0] || "시장 트렌드"
    return `${platform} · ${topic} — ${post.title}`
  })

  while (lines.length < 3) {
    lines.push("일본 EC·SNS·리뷰 데이터가 매주 업데이트됩니다.")
  }

  return lines.slice(0, 3)
}

export type InsightFilters = {
  query: string
  platform: string
  topic: string
  industry: string
  difficulty: string
}

export function filterInsights(posts: InsightEnriched[], filters: InsightFilters) {
  const q = filters.query.trim().toLowerCase()

  return posts.filter((post) => {
    if (filters.platform !== "전체" && !post.platforms.includes(filters.platform)) return false
    if (filters.topic !== "전체" && !post.topics.includes(filters.topic)) return false
    if (filters.industry !== "전체" && !post.industries.includes(filters.industry)) return false
    if (filters.difficulty !== "전체" && post.difficulty !== filters.difficulty) return false

    if (!q) return true

    const haystack = [
      post.title,
      post.description,
      post.aiSummary,
      post.category,
      getInsightCategoryLabel(post.category),
      ...post.tags,
      ...post.platforms,
      ...post.topics,
      ...post.industries,
    ]
      .join(" ")
      .toLowerCase()

    return haystack.includes(q)
  })
}

export function getRelatedInsights(current: InsightEnriched, all: InsightEnriched[], limit = 5) {
  return getFollowUpInsights(current, all, limit)
}

export function getTopicClusterLinks(current: InsightEnriched) {
  const links: Array<{ label: string; href: string }> = []

  for (const platform of current.platforms.slice(0, 2)) {
    links.push({ label: `${platform} 인사이트`, href: `/insights?platform=${encodeURIComponent(platform)}` })
  }
  for (const topic of current.topics.slice(0, 2)) {
    links.push({ label: `${topic} 가이드`, href: `/insights?topic=${encodeURIComponent(topic)}` })
  }

  if (links.length === 0) {
    links.push({ label: "일본 시장 분석", href: "/insights?topic=시장분석" })
    links.push({ label: "오픈마켓 운영", href: "/insights?platform=Qoo10" })
  }

  return links.slice(0, 5)
}
