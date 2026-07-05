import Link from "next/link"
import { Users } from "lucide-react"

import { influencerNetworkCategories } from "@/lib/aeo-content"

export function InfluencerNetworkSection() {
  return (
    <section id="influencer-network" className="scroll-mt-24 bg-[var(--surface-dark)] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="section-label">핵심 차별점</p>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-black tracking-tight md:text-4xl">
          일본 현지 인플루언서 네트워크
        </h2>
        <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-white/75">
          콜라보티켓은 단발성 협찬이 아닌, 브랜드와 장기적으로 함께 성장할 일본 현지 인플루언서를 연결합니다.
          일본 인플루언서 마케팅은 일본 소비자의 신뢰를 확보하고 브랜드 인지도를 높이는 대표적인 방법이며,
          콜라보티켓은 카테고리별 일본 현지 인플루언서 풀을 보유하고 있습니다.
        </p>

        <h3 className="mt-12 text-lg font-bold text-white/90">보유 네트워크</h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {influencerNetworkCategories.map((category) => (
            <li key={category.name}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-brand/40 hover:bg-white/[0.08]">
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-brand/20 text-brand">
                  <Users className="size-5" />
                </div>
                <h4 className="text-base font-bold">{category.name}</h4>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{category.desc}</p>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center">
          <Link href="/influencers" className="btn-brand px-8">
            인플루언서 매칭 상담받기
          </Link>
        </p>
      </div>
    </section>
  )
}
