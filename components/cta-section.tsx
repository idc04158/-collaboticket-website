import Link from "next/link"

export function CtaSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-gray-900 px-6 py-24 text-center lg:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-balance text-3xl font-bold text-white md:text-4xl">일본 실행, 상담으로 시작하세요</h2>
        <p className="mt-6 text-pretty text-lg text-gray-300">
          채널 진단과 우선순위 설계부터 운영 대행까지 필요한 범위만 제안드립니다.
        </p>

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-[#00B140] px-10 py-4 font-semibold text-white shadow-xl transition duration-300 hover:scale-[1.02] hover:bg-[#009C38] hover:shadow-2xl"
          >
            일본 진출 상담 신청
          </Link>

          <p className="mt-4 text-sm text-gray-400">제출 후 1영업일 이내에 연락드립니다.</p>
        </div>
      </div>
    </section>
  )
}
