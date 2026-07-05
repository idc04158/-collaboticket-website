import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section id="contact" className="scroll-mt-24 relative overflow-hidden bg-brand py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-10" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-black text-white md:text-4xl">
          일본 실행, 상담으로 시작하세요
        </h2>
        <p className="mt-5 text-pretty text-lg text-white/85">
          채널 진단과 우선순위 설계부터 월 정찰제 운영까지 — 필요한 범위만 제안드립니다.
        </p>

        <Link
          href="/contact"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-brand shadow-xl transition hover:bg-white/95"
        >
          일본 진출 상담 신청
          <ArrowRight className="size-4" />
        </Link>

        <p className="mt-4 text-sm text-white/70">제출 후 1영업일 이내에 연락드립니다.</p>
      </div>
    </section>
  )
}
