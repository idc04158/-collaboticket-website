import Link from "next/link"

export function MidCtaSection() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="rounded-3xl border bg-card px-8 py-12 text-center shadow-lg md:px-16">
          <h3 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
            실행 우선순위를 함께 정리해드립니다
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            채널 진단 후 바로 손대야 할 일부터 순서대로 제안드립니다.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#00B140] px-10 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#009C38] hover:shadow-2xl"
          >
            일본 진출 상담 신청
          </Link>
        </div>
      </div>
    </section>
  )
}
