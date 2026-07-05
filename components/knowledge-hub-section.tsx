import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { knowledgeGuides } from "@/lib/aeo-content"

export function KnowledgeHubSection() {
  return (
    <section id="guides" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="section-label">지식 허브</p>
        <h2 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-4xl">
          일본 시장 지식 허브
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          일본 마케팅, Qoo10·Rakuten·Amazon Japan 운영, 일본 인플루언서·리뷰 마케팅, 일본 물류, 법인 설립, 상표 등록에 대한
          실행 가이드를 인사이트 자료로 제공합니다.
        </p>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {knowledgeGuides.map((guide) => (
            <li key={guide.title}>
              <article className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md">
                <h3 className="text-lg font-bold">
                  <Link href={guide.href} className="hover:text-brand">
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
                <Link
                  href={guide.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand"
                >
                  가이드 읽기
                  <ArrowRight className="size-3.5" />
                </Link>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center">
          <Link href="/insights" className="btn-brand-outline gap-2 px-8">
            전체 인사이트 보기
            <ArrowRight className="size-4" />
          </Link>
        </p>
      </div>
    </section>
  )
}
