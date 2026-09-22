/**
 * CollaboTicket Content Design System — tokens (SSOT).
 * CSS variables: app/globals.css (`--article-*`).
 */

export const articleSpace = {
  1: "var(--article-space-1)", // 8
  2: "var(--article-space-2)", // 16
  3: "var(--article-space-3)", // 24
  4: "var(--article-space-4)", // 32
  5: "var(--article-space-5)", // 40
  6: "var(--article-space-6)", // 48
  8: "var(--article-space-8)", // 64
  10: "var(--article-space-10)", // 80
} as const

export const articleSpaceClass = {
  gap1: "gap-[var(--article-space-1)]",
  gap2: "gap-[var(--article-space-2)]",
  gap3: "gap-[var(--article-space-3)]",
  stack1: "space-y-[var(--article-space-1)]",
  stack2: "space-y-[var(--article-space-2)]",
  stack3: "space-y-[var(--article-space-3)]",
  mt1: "mt-[var(--article-space-1)]",
  mt2: "mt-[var(--article-space-2)]",
  mt3: "mt-[var(--article-space-3)]",
  mbSection: "mb-[var(--article-space-8)]",
  myBlock: "my-[var(--article-block-my)]",
} as const

export const articleIconSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const

export type ArticleIconSize = keyof typeof articleIconSize

export const articleIconClass: Record<ArticleIconSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
}

export const articleTypeClass = {
  h2: "article-type-h2",
  h3: "article-type-h3",
  subtitle: "article-type-subtitle",
  body: "article-type-body",
  caption: "article-type-caption",
  label: "article-type-label",
  title: "article-type-title",
  faqQuestion: "article-type-faq-question",
} as const

/** Card Design System — 5 variants only */
export type ArticleCardVariant = "info" | "warning" | "success" | "action" | "cta"

export const articleCardClass = {
  block: "article-card",
  nested: "article-card-nested",
  info: "article-card article-card--info",
  warning: "article-card article-card--warning",
  success: "article-card article-card--success",
  action: "article-card article-card--action",
  cta: "article-card article-card--cta",
} as const

export const articleAccordionClass = {
  root: "article-accordion",
  item: "article-accordion-item",
  trigger: "article-accordion-trigger",
  content: "article-accordion-content",
  preview: "article-accordion-preview",
} as const

export const BRAND_COVER_PATH = "/brand/insight-cover.jpg"
