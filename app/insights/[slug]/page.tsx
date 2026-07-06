import type { Metadata } from "next"
import Link from "next/link"
import { marked } from "marked"
import { notFound } from "next/navigation"
import { Sparkles } from "lucide-react"

import { MarketingShell } from "@/components/marketing-shell"
import { InsightCard } from "@/components/insights/insight-card"
import { InsightArticleJsonLd } from "@/components/insights/insight-article-json-ld"
import { InsightDiagnosisCta } from "@/components/insights/insight-diagnosis-cta"
import { Badge } from "@/components/ui/badge"
import {
  getAllEnrichedInsights,
  getEnrichedInsightBySlug,
  getInsightSlugs,
  getInsightCategoryLabel,
  getRelatedInsights,
  getTopicClusterLinks,
} from "@/lib/insights"

type PageProps = {
  params: { slug: string }
}

type TocItem = {
  id: string
  level: number
  text: string
}

const preConsultationHeading = "상담 전에 준비하면 좋은 자료"
const diagnosisCtaHtml = `
<aside class="my-10 rounded-[1.75rem] border border-[#00B140]/20 bg-[#00B140]/5 p-6">
  <p class="text-sm font-semibold text-[#00B140]">무료 진단</p>
  <h2 class="mt-2 text-2xl font-bold tracking-tight text-foreground">우리 브랜드도 일본 시장에서 가능성이 있을까요?</h2>
  <p class="mt-3 text-sm leading-relaxed text-muted-foreground">현재 상품, 채널, 예산만 알려주시면 일본 진출 가능성과 우선 실행 과제를 무료로 정리해 드립니다.</p>
  <a href="/contact?topic=diagnosis" class="mt-5 inline-flex rounded-xl bg-[#00B140] px-6 py-3 text-sm font-bold text-white">무료 일본 진출 진단 받기</a>
</aside>
`

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function toAnchorId(text: string, index: number) {
  const normalized = text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")

  return normalized || `section-${index + 1}`
}

function prepareInsightContent(content: string, image?: string) {
  let body = content.replace(/<!-- expanded-blog-body-v2 -->\n?/g, "")
  body = body.replace(/^##\s+참고\s*출처[\s\S]*?(?=^##\s+|(?![\s\S]))/gm, "")
  body = body.replace(
    new RegExp(`^##\\s+${escapeRegExp(preConsultationHeading)}\\s*$`, "m"),
    `${diagnosisCtaHtml}\n## ${preConsultationHeading}`,
  )

  if (image) {
    const duplicateImagePattern = new RegExp(
      `\\n?!\\[[^\\]]*\\]\\(${escapeRegExp(image)}\\)\\n?`,
      "g",
    )
    body = body.replace(duplicateImagePattern, "\n")
  }

  const usedIds = new Map<string, number>()
  const toc: TocItem[] = []

  body = body.replace(/^(#{2,3})\s+(.+)$/gm, (full, hashes: string, rawText: string) => {
    const text = rawText.trim()
    const baseId = toAnchorId(text, toc.length)
    const count = usedIds.get(baseId) || 0
    usedIds.set(baseId, count + 1)
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`
    const level = hashes.length

    toc.push({ id, level, text })
    return `<h${level} id="${id}">${escapeHtml(text)}</h${level}>`
  })

  return { content: body, toc }
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
    openGraph: {
      title: result.title,
      description: result.aiSummary || result.description,
      images: result.image ? [{ url: result.image }] : undefined,
    },
  }
}

export default async function InsightDetailPage({ params }: PageProps) {
  const result = getEnrichedInsightBySlug(params.slug)
  if (!result) notFound()

  const { content, ...meta } = result
  const allEnriched = getAllEnrichedInsights()
  const prepared = prepareInsightContent(content, meta.image)
  const html = await marked.parse(prepared.content)
  const tocItems =
    prepared.toc.filter((item) => item.level === 2).length > 0
      ? prepared.toc.filter((item) => item.level === 2).slice(0, 6)
      : prepared.toc.slice(0, 6)
  const related = getRelatedInsights(meta, allEnriched, 3)
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

      <article className="bg-background py-12 lg:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <nav aria-label="인사이트 breadcrumb">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand underline-offset-4 hover:underline"
            >
              ← 일본 시장 인사이트
            </Link>
          </nav>

          <header className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{getInsightCategoryLabel(meta.category)}</Badge>
              <Badge variant="outline">{meta.difficulty}</Badge>
              {meta.platforms.map((platform) => (
                <Badge key={platform} variant="outline" className="text-[11px]">
                  {platform}
                </Badge>
              ))}
            </div>

            {meta.date && (
              <p className="text-sm text-muted-foreground">
                <time dateTime={meta.date}>업데이트 {meta.date}</time>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span>{meta.readingTimeMinutes}분 읽기</span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span>추천 대상: {meta.audience}</span>
              </p>
            )}

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">{meta.title}</h1>
            {meta.description && <p className="text-lg text-muted-foreground">{meta.description}</p>}
          </header>

          {meta.image && (
            <figure className="mt-10">
              <img
                src={meta.image}
                alt={`${meta.title} 대표 이미지`}
                className="w-full rounded-xl border object-cover"
              />
            </figure>
          )}

          <section
            aria-labelledby="ai-summary-title"
            className="mt-10 rounded-[1.75rem] border border-brand/20 bg-brand-light/40 p-6 sm:p-8"
          >
            <p
              id="ai-summary-title"
              className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-brand"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              AI 30초 요약
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">{meta.aiSummary}</p>
          </section>

          {tocItems.length > 0 && (
            <nav className="mt-8 rounded-2xl border bg-background p-6" aria-label="리포트 목차">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">목차</h2>
              <ol className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
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

          <section
            aria-label="리포트 본문"
            className="insight-body mt-12 max-w-none space-y-4 text-base leading-relaxed [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_img]:mt-6 [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_img]:object-cover [&_p]:text-muted-foreground [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {meta.checklist.length > 0 && (
            <aside
              aria-labelledby="checklist-title"
              className="mt-12 rounded-2xl border bg-card p-6 sm:p-8"
            >
              <h2 id="checklist-title" className="text-xl font-bold">
                실행 체크리스트
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">이 리포트를 실행할 때 확인할 실무 항목입니다.</p>
              <ul className="mt-5 space-y-3">
                {meta.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                    <span className="mt-0.5 font-bold text-brand" aria-hidden="true">
                      □
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {clusterLinks.length > 0 && (
            <nav aria-label="관련 토픽" className="mt-10 rounded-2xl border border-dashed p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">토픽 클러스터</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
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

          {related.length > 0 && (
            <section aria-labelledby="related-title" className="mt-16 border-t pt-10">
              <h2 id="related-title" className="text-2xl font-black tracking-tight">
                관련 글
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                같은 플랫폼·주제의 리포트를 이어서 확인하세요.
              </p>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {related.map((post) => (
                  <InsightCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}

          <InsightDiagnosisCta />
        </div>
      </article>
    </MarketingShell>
  )
}
