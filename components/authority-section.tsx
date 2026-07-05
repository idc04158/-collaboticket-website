import Link from "next/link"
import { ArrowRight, BarChart3, ClipboardCheck, Route, Settings2 } from "lucide-react"

const steps = [
  { icon: ClipboardCheck, step: "01", title: "채널 진단", desc: "SNS·몰·리뷰·물류 현황을 데이터로 점검" },
  { icon: Route, step: "02", title: "우선순위 설계", desc: "ROI 기반 실행 순서와 예산 배분 설계" },
  { icon: Settings2, step: "03", title: "월 정찰제 운영", desc: "SNS, 오픈마켓, 리뷰, 물류를 통합 실행" },
  { icon: BarChart3, step: "04", title: "데이터 리포트", desc: "월간 성과 분석과 다음 액션 제안" },
]

export function AuthoritySection() {
  return (
    <section id="execution-flow" className="scroll-mt-24 border-y bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="section-label">실행 프로세스</p>
          <h2 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-4xl">
            일본 진출은 단일 캠페인이 아닙니다
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            CollaboTicket은 SNS, 오픈마켓, 리뷰, 물류를 하나의 판매 흐름으로 설계하고,
            데이터 기반 월간 리포트로 지속 개선합니다.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <item.icon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-brand">STEP {item.step}</span>
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              {idx < steps.length - 1 && (
                <div className="pointer-events-none absolute right-[-10px] top-1/2 hidden h-px w-5 -translate-y-1/2 bg-brand/30 xl:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/contact" className="btn-brand gap-2 px-10">
            실행 구조 상담받기
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
