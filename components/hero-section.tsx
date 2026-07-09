import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  heroBadges,
  heroH1,
  heroNewServiceLaunch,
  heroSubtitle,
  heroValueCards,
} from "@/lib/aeo-content"

type Props = {
  totalInsightCount: number
  weeklyNewCount: number
}

export function HeroSection({ totalInsightCount, weeklyNewCount }: Props) {
  return (
    <section className="relative overflow-hidden bg-[var(--surface-dark)] text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.05]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/3 size-96 rounded-full bg-brand/8 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12 xl:gap-16">
          <div className="animate-fade-up lg:max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold tracking-wide text-white/70">
              <Sparkles className="size-3.5 text-brand" aria-hidden="true" />
              Japan Commerce Intelligence &amp; Execution
            </p>

            <h1 className="mt-5 text-balance text-[2rem] font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {heroH1}
            </h1>

            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
              {heroSubtitle[0]}
              <br />
              {heroSubtitle[1]}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="btn-brand h-11 rounded-xl px-7 text-sm font-semibold">
                <Link href="/contact">
                  무료 상담 신청
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 rounded-xl border-white/20 bg-transparent px-7 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="#market-briefing">이번 주 인사이트</Link>
              </Button>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="핵심 역량">
              {heroBadges.map((badge) => (
                <li key={badge}>
                  <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70">
                    {badge}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up space-y-4 [animation-delay:120ms] lg:pt-2">
            <article className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/20 via-white/[0.06] to-transparent p-6 shadow-[0_20px_60px_rgba(0,177,64,0.12)]">
              <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-brand/20 blur-2xl" />

              <div className="relative">
                <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                  <span aria-hidden="true">🎉</span>
                  {heroNewServiceLaunch.badge}
                </p>

                <h2 className="mt-4 text-xl font-bold leading-snug">{heroNewServiceLaunch.title}</h2>

                <ul className="mt-4 space-y-2">
                  {heroNewServiceLaunch.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="size-4 shrink-0 text-brand" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild size="sm" className="mt-5 h-9 rounded-lg bg-white px-4 text-sm font-semibold text-[var(--surface-dark)] hover:bg-white/90">
                  <Link href={heroNewServiceLaunch.ctaHref}>
                    {heroNewServiceLaunch.ctaLabel}
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
              </div>
            </article>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <p className="text-xs font-medium text-white/50">시장 인사이트</p>
                <p className="mt-1 font-mono text-2xl font-bold">{totalInsightCount}+</p>
                <p className="mt-1 text-xs text-white/60">일본 EC·SNS 분석 리포트</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <p className="text-xs font-medium text-white/50">이번 주 업데이트</p>
                <p className="mt-1 font-mono text-2xl font-bold text-brand">{weeklyNewCount}</p>
                <p className="mt-1 text-xs text-white/60">신규 브리핑 리포트</p>
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-12 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {heroValueCards.map((card) => (
            <li key={card.id}>
              <article className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand/30 hover:bg-white/[0.05]">
                <span className="text-xl" aria-hidden="true">
                  {card.emoji}
                </span>
                <h3 className="mt-3 text-sm font-bold leading-snug">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/55">{card.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
