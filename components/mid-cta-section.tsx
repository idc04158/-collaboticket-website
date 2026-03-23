import Link from "next/link"

export function MidCtaSection() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="rounded-3xl border bg-card px-8 py-12 text-center shadow-lg md:px-16">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">지금 필요한 건 실행 가능한 일본 진출 구조입니다</h3>
          <p className="mt-4 text-muted-foreground">브랜드 상황에 맞춘 실행 플로우를 1:1로 진단해드립니다.</p>
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
