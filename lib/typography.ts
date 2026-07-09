import { cn } from "@/lib/utils"

/**
 * CollaboTicket global typography utilities.
 * @see app/globals.css (.type-*)
 * @see .cursor/rules/typography.mdc
 */
export const typeClass = {
  hero: "type-hero",
  display: "type-display",
  sectionTitle: "type-section-title",
  cardTitle: "type-card-title",
  articleTitle: "type-article-title",
  lead: "type-lead",
  body: "type-body",
  faqQuestion: "type-faq-question",
  label: "section-label",
} as const

export function typeHero(className?: string) {
  return cn(typeClass.hero, className)
}

export function typeDisplay(className?: string) {
  return cn(typeClass.display, className)
}

export function typeSectionTitle(className?: string) {
  return cn(typeClass.sectionTitle, className)
}

export function typeCardTitle(className?: string) {
  return cn(typeClass.cardTitle, className)
}

export function typeArticleTitle(className?: string) {
  return cn(typeClass.articleTitle, className)
}

export function typeLead(className?: string) {
  return cn(typeClass.lead, className)
}

export function typeBody(className?: string) {
  return cn(typeClass.body, className)
}

export function typeFaqQuestion(className?: string) {
  return cn(typeClass.faqQuestion, className)
}
