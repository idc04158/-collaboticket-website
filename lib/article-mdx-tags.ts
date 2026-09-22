/** Keep in sync with components/article/index.ts exports. */
export const ARTICLE_MDX_TAG_NAMES = [
  "InsightBox",
  "WarningBox",
  "CaseStudies",
  "Checklist",
  "StepFlow",
  "DecisionTree",
  "CauseEffect",
  "Timeline",
  "ComparisonTable",
  "PriorityMatrix",
  "ProsCons",
  "BeforeAfter",
  "MetricCard",
  "InfoCardGrid",
  "SummaryCard",
  "Quote",
  "Framework",
  "Funnel",
  "FAQCard",
] as const

export type ArticleMdxTagName = (typeof ARTICLE_MDX_TAG_NAMES)[number]

const ARTICLE_TAG_PATTERN = new RegExp(
  `<(?:${ARTICLE_MDX_TAG_NAMES.join("|")})(?:\\s|>|/)`,
)

export function contentHasArticleComponents(source: string) {
  return ARTICLE_TAG_PATTERN.test(source)
}
