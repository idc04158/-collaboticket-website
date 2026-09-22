import type { ComponentType } from "react"

import { BeforeAfter } from "./BeforeAfter"
import { CaseStudies } from "./CaseStudies"
import { CauseEffect } from "./CauseEffect"
import { Checklist } from "./Checklist"
import { ComparisonTable } from "./ComparisonTable"
import { DecisionTree } from "./DecisionTree"
import { FAQCard } from "./FAQCard"
import { Framework } from "./Framework"
import { Funnel } from "./Funnel"
import { InfoCardGrid } from "./InfoCardGrid"
import { InsightBox } from "./InsightBox"
import { MetricCard } from "./MetricCard"
import { PriorityMatrix } from "./PriorityMatrix"
import { ProsCons } from "./ProsCons"
import { Quote } from "./Quote"
import { StepFlow } from "./StepFlow"
import { SummaryCard } from "./SummaryCard"
import { Timeline } from "./Timeline"
import { WarningBox } from "./WarningBox"

export {
  BeforeAfter,
  CaseStudies,
  CauseEffect,
  Checklist,
  ComparisonTable,
  DecisionTree,
  FAQCard,
  Framework,
  Funnel,
  InfoCardGrid,
  InsightBox,
  MetricCard,
  PriorityMatrix,
  ProsCons,
  Quote,
  StepFlow,
  SummaryCard,
  Timeline,
  WarningBox,
}

/** Component map for next-mdx-remote / MDX. */
export const articleMdxComponents = {
  InsightBox,
  WarningBox,
  CaseStudies,
  Checklist,
  StepFlow,
  DecisionTree,
  CauseEffect,
  Timeline,
  ComparisonTable,
  PriorityMatrix,
  ProsCons,
  BeforeAfter,
  MetricCard,
  InfoCardGrid,
  SummaryCard,
  Quote,
  Framework,
  Funnel,
  FAQCard,
} as const satisfies Record<string, ComponentType<any>>

export { ARTICLE_MDX_TAG_NAMES, contentHasArticleComponents } from "@/lib/article-mdx-tags"
