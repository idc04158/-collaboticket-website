import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { heroBadges, heroH1, heroSubtitle } from "@/lib/aeo-content"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-[var(--surface-dark)] text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.05]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 size-96 rounded-full bg-brand/8 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="animate-fade-up mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
          <h1 className="text-balance text-[2rem] font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {heroH1}
          </h1>

          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
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
              <Link href="/#operating-principles">운영 원칙 보기</Link>
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="핵심 강점">
            {heroBadges.map((badge) => (
              <li key={badge}>
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70">
                  {badge}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
