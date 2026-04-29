import type { Metadata } from "next"
import Link from "next/link"
import { marked } from "marked"
import { notFound } from "next/navigation"

import { MarketingShell } from "@/components/marketing-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAllInsightSummaries, getInsightBySlug, getInsightSlugs } from "@/lib/insights"

type PageProps = {
  params: { slug: string }
}

type TocItem = {
  id: string
  level: number
  text: string
}

const preConsultationHeading = "상담 전에 준비하면 좋은 자료"
const consultationCtaHtml = `
<aside class="my-10 rounded-[1.75rem] border border-[#00B140]/20 bg-[#00B140]/5 p-6">
  <p class="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Consultation</p>
  <h2 class="mt-2 text-2xl font-bold tracking-tight text-foreground">자료를 모두 준비하기 전에 먼저 방향부터 잡아보세요</h2>
  <p class="mt-3 text-sm leading-relaxed text-muted-foreground">현재 판매 상태, 예산, 희망 채널이 정리되어 있지 않아도 괜찮습니다. CollaboTicket이 일본 진출 단계와 우선순위를 먼저 점검해드립니다.</p>
  <a href="/contact" class="mt-5 inline-flex rounded-xl bg-[#00B140] px-6 py-3 text-sm font-bold text-white">일본 진출 상담 신청</a>
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
    `${consultationCtaHtml}\n## ${preConsultationHeading}`,
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
  const prepared = prepareInsightContent(content, meta.image)
  const html = await marked.parse(prepared.content)
  const tocItems =
    prepared.toc.filter((item) => item.level === 2).length > 0
      ? prepared.toc.filter((item) => item.level === 2).slice(0, 5)
      : prepared.toc.slice(0, 5)
  const related = getAllInsightSummaries()
    .filter((post) => post.slug !== meta.slug)
    .sort((a, b) => {
      if (a.category === meta.category && b.category !== meta.category) return -1
      if (a.category !== meta.category && b.category === meta.category) return 1
      return b.date.localeCompare(a.date)
    })
    .slice(0, 3)

  return (
    <MarketingShell>
      <article className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6">
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

          <section className="mt-10 grid gap-4 rounded-[1.75rem] border bg-card p-6 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Quick Summary</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">이 글에서 바로 확인할 것</h2>
            </div>
            <ul className="grid gap-3 text-sm text-muted-foreground">
              <li className="rounded-2xl bg-background p-4">일본 시장에서 왜 이 주제가 구매 전환과 연결되는지</li>
              <li className="rounded-2xl bg-background p-4">우리 브랜드가 먼저 점검해야 할 운영 지표와 체크리스트</li>
              <li className="rounded-2xl bg-background p-4">상담 전 준비하면 좋은 자료와 다음 실행 우선순위</li>
            </ul>
          </section>

          {tocItems.length > 0 && (
            <nav className="mt-8 rounded-2xl border bg-background p-6" aria-label="인사이트 목차">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">목차</p>
              <ol className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-muted-foreground underline-offset-4 hover:text-[#00B140] hover:underline">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div
            className="insight-body mt-12 max-w-none space-y-4 text-base leading-relaxed [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_img]:mt-6 [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_img]:object-cover [&_p]:text-muted-foreground [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {related.length > 0 && (
            <section className="mt-16 border-t pt-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Related Insights</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">함께 보면 좋은 인사이트</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {related.map((post) => (
                  <Link key={post.slug} href={`/insights/${post.slug}`} className="group block h-full">
                    <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
                      <CardContent className="flex h-full flex-col gap-3 p-5">
                        <Badge variant="secondary" className="w-fit text-[11px]">
                          {post.category}
                        </Badge>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-[#00B140]">
                          {post.title}
                        </h3>
                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                          {post.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10 rounded-[2rem] border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Webinar</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">관련 웨비나에서 실행 흐름을 더 자세히 확인하세요</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              일본 SNS, EC, 리뷰, 물류, 인플루언서 운영을 주제로 한 웨비나에서 실제 실행 순서와 체크포인트를 정리해드립니다.
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-xl">
              <Link href="/webinar">웨비나 일정 보기</Link>
            </Button>
          </section>

          <section className="mt-8 rounded-[2rem] bg-[#00B140] p-8 text-white">
            <h2 className="text-2xl font-bold tracking-tight">우리 브랜드에 맞는 일본 진출 실행 구조가 필요하신가요?</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              검색 인사이트를 실제 매출 구조로 연결하려면 채널, 리뷰, SNS, 인플루언서, 물류를 함께 설계해야 합니다. 현재 상황을 남겨주시면 우선순위부터 정리해드립니다.
            </p>
            <Button asChild className="mt-6 rounded-xl bg-white px-8 text-[#00B140] hover:bg-white/90">
              <Link href="/contact">일본 진출 상담 신청</Link>
            </Button>
          </section>
        </div>
      </article>
    </MarketingShell>
  )
}
