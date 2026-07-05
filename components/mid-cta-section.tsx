import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MidCtaSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-[var(--surface-dark)] px-8 py-14 text-center md:px-16">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.06]" />
          <div className="relative">
            <p className="section-label">무료 상담</p>
            <h3 className="mt-4 text-balance text-2xl font-black text-white md:text-3xl">
              실행 우선순위를 함께 정리해드립니다
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/65">
              채널 진단 후 바로 손대야 할 일부터 순서대로 제안드립니다. 30분 무료 온라인 상담.
            </p>
            <Link href="/contact" className="btn-brand mt-8 inline-flex gap-2 px-10">
              상담 예약하기
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
