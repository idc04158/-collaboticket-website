"use client"

export function CtaSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section
      id="contact"
      className="bg-gray-900 py-24 px-6 text-center scroll-mt-24"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          실행 전략이 필요하신가요?
        </h2>

        <p className="mt-6 text-lg text-gray-300">
          웨비나 이후 구체적인 실행 설계가 필요하다면 상담을 신청하세요.
        </p>

        <div className="mt-10">
          <button
            onClick={onOpen}
            className="
              inline-flex
              items-center
              justify-center
              bg-[#00B140]
              hover:bg-[#009C38]
              text-white
              px-10
              py-4
              rounded-xl
              font-semibold
              transition-all
              duration-300
              hover:scale-[1.03]
              shadow-lg
              hover:shadow-2xl
            "
          >
            상담 신청하기
          </button>

          <p className="mt-4 text-sm text-gray-400">
            제출 후 1영업일 이내에 연락드립니다.
          </p>
        </div>
      </div>
    </section>
  )
}