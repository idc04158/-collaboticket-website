import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

const plans = [
  {
    name: "SNS 마케팅",
    tag: "월 정찰제",
    desc: "TikTok·Instagram·YouTube 인플루언서 및 콘텐츠 운영",
    features: ["콘텐츠 캘린더 운영", "인플루언서 섭외·관리", "광고/파트너십 캠페인", "월간 성과 리포트"],
  },
  {
    name: "오픈마켓 운영",
    tag: "월 정찰제",
    desc: "Rakuten·Qoo10·Amazon Japan 입점부터 운영까지",
    features: ["상품 등록·상세페이지", "가격·재고·프로모션 관리", "몰별 SEO 최적화", "매출·전환 데이터 리포트"],
    highlighted: true,
  },
  {
    name: "리뷰 캠페인",
    tag: "월 정찰제",
    desc: "오픈마켓·커뮤니티(@cosme, LIPS) 리뷰 확보",
    features: ["체험단 기획·운영", "구매 인증 리뷰 수집", "커뮤니티 리뷰 관리", "인증 리포트 제공"],
  },
  {
    name: "물류·통관",
    tag: "월 정찰제",
    desc: "FBA·크로스보더 배송·수입 통관 일괄 관리",
    features: ["FBA 입고·재고 관리", "국제 배송·통관 대행", "물류 비용 구조 분석", "배송 SLA 모니터링"],
  },
]

export function SubscriptionSection() {
  return (
    <section id="subscription" className="scroll-mt-24 bg-[var(--surface-elevated)] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">정찰제 운영</p>
          <h2 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-4xl">
            필요한 서비스만, 월 정찰제로 운영합니다
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            단발성 프로젝트가 아닌 지속적인 운영 파트너십입니다. 일본 SNS 마케팅, Qoo10·Rakuten·Amazon Japan 운영,
            일본 리뷰 마케팅, 일본 물류를 채널별 전담팀이 데이터 기반으로 매월 성과를 관리합니다.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                plan.highlighted ? "border-brand ring-1 ring-brand/20" : "border-border"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-[10px] font-bold text-white">
                  인기 서비스
                </span>
              )}
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <span className="subscription-badge">{plan.tag}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.desc}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            상표등록·법인설립 등 부가 서비스도 정찰제 또는 프로젝트 단위로 함께 설계할 수 있습니다.
          </p>
          <Link href="/contact" className="btn-brand gap-2 px-8">
            맞춤 운영 범위 상담받기
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
