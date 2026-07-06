export const insightCategoryLabels: Record<string, string> = {
  Insight: "인사이트",
  "Market Analysis": "시장 분석",
  "Case Study": "사례 연구",
  Strategy: "전략",
  "Strategy Guide": "전략 가이드",
  "Execution Guide": "실행 가이드",
  "SNS Marketing": "SNS 마케팅",
  "Review Strategy": "리뷰 전략",
  "Open Market": "오픈마켓",
  Logistics: "물류",
}

export function getInsightCategoryLabel(category: string) {
  return insightCategoryLabels[category] ?? category
}
