import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Sparkles } from "lucide-react"

import { contentHasArticleComponents } from "@/components/article"
import { MarketingShell } from "@/components/marketing-shell"
import { InsightActionChecklist } from "@/components/insights/insight-action-checklist"
import { InsightArticleJsonLd } from "@/components/insights/insight-article-json-ld"
import { InsightBrandHero } from "@/components/insights/insight-brand-hero"
import { InsightDiagnosisCta } from "@/components/insights/insight-diagnosis-cta"
import { InsightEngagementTracker } from "@/components/insights/insight-engagement-tracker"
import { InsightGlossaryBody } from "@/components/insights/insight-glossary-body"
import { InsightMdxBody } from "@/components/insights/insight-mdx-body"
import { InsightMidCta } from "@/components/insights/insight-mid-cta"
import { InsightReferences } from "@/components/insights/insight-references"
import { InsightRelatedRail } from "@/components/insights/insight-related-rail"
import { articleCardClass, articleSpaceClass, articleTypeClass } from "@/lib/design-tokens"
import { extractInsightReferences } from "@/lib/extract-insight-references"
import {
  getAllEnrichedInsights,
  getEnrichedInsightBySlug,
  getInsightSlugs,
  getRelatedInsightsWithReasons,
  getTopicClusterLinks,
} from "@/lib/insights"
import { transformInsightCasesToComponent } from "@/lib/transform-insight-cases"
import { transformInsightFaqToAccordion } from "@/lib/transform-insight-faq"
import { transformInsightSectionHeadings } from "@/lib/insight-sections"
import { sanitizeInsightBody } from "@/lib/sanitize-insight-content"
import { extractInsightTocFromSource } from "@/lib/render-insight-mdx"
import { renderInsightMarkdown, splitSummaryBullets } from "@/lib/render-insight-markdown"
import { cn } from "@/lib/utils"

type PageProps = {
  params: { slug: string }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function prepareInsightContent(
  content: string,
  image?: string,
  titleBySlug: Map<string, string> = new Map(),
) {
  let body = sanitizeInsightBody(
    content.replace(/<!-- expanded-blog-body-v2 -->\n?/g, ""),
    titleBySlug,
  )

  if (image) {
    const duplicateImagePattern = new RegExp(
      `\\n?!\\[[^\\]]*\\]\\(${escapeRegExp(image)}\\)\\n?`,
      "g",
    )
    body = body.replace(duplicateImagePattern, "\n")
  }

  body = transformInsightSectionHeadings(body)
  body = transformInsightCasesToComponent(body)
  const { body: withoutReferences, items: references } = extractInsightReferences(body)
  return {
    body: transformInsightFaqToAccordion(withoutReferences),
    references,
  }
}

export async function generateStaticParams() {
  return getInsightSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = getEnrichedInsightBySlug(params.slug)
  if (!result) {
    return { title: "Not found | CollaboTicket" }
  }
  return {
    title: `${result.title} | CollaboTicket`,
    description: result.aiSummary || result.description,
    alternates: {
      canonical: `/insights/${params.slug}`,
    },
    openGraph: {
      title: result.title,
      description: result.aiSummary || result.description,
      url: `/insights/${params.slug}`,
      images: result.image ? [{ url: result.image }] : undefined,
    },
  }
}

export default async function InsightDetailPage({ params }: PageProps) {
  const result = getEnrichedInsightBySlug(params.slug)
  if (!result) notFound()

  const { content, ...meta } = result
  const allEnriched = getAllEnrichedInsights()
  const titleBySlug = new Map(allEnriched.map((post) => [post.slug, post.title]))
  const { body: preparedBody, references } = prepareInsightContent(
    content,
    meta.image,
    titleBySlug,
  )
  const useArticleMdx = contentHasArticleComponents(preparedBody)
  const markdownResult = useArticleMdx
    ? null
    : await renderInsightMarkdown(preparedBody, meta.slug, titleBySlug)
  const toc = useArticleMdx
    ? extractInsightTocFromSource(preparedBody)
    : markdownResult!.toc
  const summaryBullets = splitSummaryBullets(meta.aiSummary)
  const tocItems =
    toc.filter((item) => item.level === 2).length > 0
      ? toc.filter((item) => item.level === 2).slice(0, 8)
      : toc.slice(0, 8)
  const related = getRelatedInsightsWithReasons(meta, allEnriched, 3)
  const clusterLinks = getTopicClusterLinks(meta)

  return (
    <MarketingShell>
      <InsightArticleJsonLd
        title={meta.title}
        description={meta.description}
        date={meta.date}
        slug={meta.slug}
        image={meta.image}
        aiSummary={meta.aiSummary}
      />

      <InsightEngagementTracker slug={meta.slug} title={meta.title} />

      <article className="bg-background pb-16 lg:pb-24">
        <InsightBrandHero
          title={meta.title}
          description={meta.description}
          category={meta.category}
          date={meta.date}
          readingTimeMinutes={meta.readingTimeMinutes}
          audience={meta.audience}
          platforms={meta.platforms}
          difficulty={meta.difficulty}
          image={meta.image}
          heroMode={meta.heroMode === "diagram" ? "diagram" : "brand"}
        />

        <div className="mx-auto max-w-4xl px-6 pt-[var(--article-space-6)]">
          <section
            aria-labelledby="ai-summary-title"
            className={cn(articleCardClass.action)}
          >
            <p
              id="ai-summary-title"
              className={cn(articleTypeClass.label, "article-icon-text text-brand")}
            >
              <Sparkles className="article-icon article-icon--sm size-4" aria-hidden="true" />
              AI 30초 요약
            </p>
            <ul className={cn("article-list", articleSpaceClass.mt2)}>
              {summaryBullets.map((line) => (
                <li key={line} className="article-list-item">
                  <span className="article-list-item__marker rounded-full bg-brand/15 text-[10px] font-bold text-brand">
                    ✓
                  </span>
                  <span className="article-list-item__title font-normal text-foreground/90">{line}</span>
                </li>
              ))}
            </ul>
          </section>

          {tocItems.length > 0 && (
            <nav
              className={cn(articleCardClass.info, "mt-[var(--article-space-2)]")}
              aria-label="리포트 목차"
            >
              <h2 className={cn(articleTypeClass.label)}>목차</h2>
              <ol className={cn("mt-[var(--article-space-2)] grid gap-2 text-sm sm:grid-cols-2")}>
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-muted-foreground underline-offset-4 hover:text-brand hover:underline"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="mt-[var(--article-space-3)]">
            {useArticleMdx ? (
              <InsightMdxBody
                source={preparedBody}
                midCta={<InsightMidCta slug={meta.slug} title={meta.title} />}
              />
            ) : (
              <InsightGlossaryBody
                html={markdownResult!.html}
                slug={meta.slug}
                midCta={<InsightMidCta slug={meta.slug} title={meta.title} />}
              />
            )}
          </div>

          {meta.checklist.length > 0 && (
            <div className="mt-[var(--article-space-3)]">
              <InsightActionChecklist slug={meta.slug} title={meta.title} items={meta.checklist} />
            </div>
          )}

          <InsightReferences items={references} />

          {clusterLinks.length > 0 && (
            <nav
              aria-label="관련 토픽"
              className={cn(articleCardClass.info, "mt-[var(--article-space-3)] border-dashed")}
            >
              <h2 className={cn(articleTypeClass.label)}>관련 토픽</h2>
              <ul className="mt-[var(--article-space-2)] flex flex-wrap gap-2">
                {clusterLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full border bg-background px-4 py-2 text-xs font-semibold transition hover:border-brand hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="mt-[var(--article-space-8)]">
            <InsightRelatedRail items={related} />
          </div>

          <InsightDiagnosisCta slug={meta.slug} title={meta.title} />
        </div>
      </article>
    </MarketingShell>
  )
}
