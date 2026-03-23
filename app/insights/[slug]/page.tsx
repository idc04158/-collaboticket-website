import type { Metadata } from "next"
import Link from "next/link"
import { marked } from "marked"
import { notFound } from "next/navigation"

import { MarketingShell } from "@/components/marketing-shell"
import { Badge } from "@/components/ui/badge"
import { getInsightBySlug, getInsightSlugs } from "@/lib/insights"

type PageProps = {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getInsightSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = getInsightBySlug(params.slug)
  if (!result) {
    return { title: "Not found | CollaboTicket" }
  }
  const { meta } = result
  return {
    title: `${meta.title} | CollaboTicket`,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
    },
  }
}

export default async function InsightDetailPage({ params }: PageProps) {
  const result = getInsightBySlug(params.slug)
  if (!result) notFound()

  const { meta, content } = result
  const html = await marked.parse(content)

  return (
    <MarketingShell>
      <article className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/insights"
            className="text-sm font-medium text-[#00B140] underline-offset-4 hover:underline"
          >
            ← 인사이트 목록
          </Link>

          <div className="mt-8 space-y-4">
            <Badge variant="secondary">{meta.category}</Badge>
            {meta.date && (
              <p className="text-sm text-muted-foreground">
                <time dateTime={meta.date}>{meta.date}</time>
              </p>
            )}
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{meta.title}</h1>
            {meta.description && (
              <p className="text-lg text-muted-foreground">{meta.description}</p>
            )}
          </div>

          {meta.image && (
            <img
              src={meta.image}
              alt={`${meta.title} 대표 이미지`}
              className="mt-10 w-full rounded-xl border object-cover"
            />
          )}

          <div
            className="mt-12 max-w-none space-y-4 text-base leading-relaxed [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:text-muted-foreground [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>
    </MarketingShell>
  )
}
