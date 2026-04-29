import Link from "next/link"
import { ArrowRight, BarChart3, ClipboardCheck, Route, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  { icon: ClipboardCheck, step: "01", title: "채널 진단", desc: "SNS·몰·리뷰·물류 현황을 한 번에 점검" },
  { icon: Route, step: "02", title: "우선순위 설계", desc: "지금 먼저 해야 할 실행 순서를 정리" },
  { icon: Settings2, step: "03", title: "운영 대행", desc: "SNS, 오픈마켓, 리뷰, 물류를 함께 실행" },
  { icon: BarChart3, step: "04", title: "리포트 & 개선", desc: "성과 데이터를 보고 다음 액션 조정" },
]

export function AuthoritySection() {
  return (
    <section id="about" className="scroll-mt-24 bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Execution flow</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">일본 진출은 단일 캠페인이 아닙니다.</h2>
          <p className="mt-3 text-lg font-semibold text-foreground">전체 운영 구조 설계가 필요합니다.</p>
          <p className="mt-4 text-muted-foreground">
            CollaboTicket은 SNS, 오픈마켓, 리뷰, 물류를 따로 보지 않고 하나의 판매 흐름으로 설계합니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative rounded-2xl border bg-background p-8 shadow-md transition hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl bg-[#00B140]/10 p-2.5 text-[#00B140]">
                  <item.icon className="size-5" />
                </div>
                <div className="text-sm font-semibold text-[#00B140]">STEP {item.step}</div>
              </div>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              {idx < steps.length - 1 && (
                <div className="pointer-events-none absolute right-[-14px] top-1/2 hidden h-0.5 w-7 -translate-y-1/2 bg-[#00B140]/40 xl:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button asChild className="rounded-xl bg-[#00B140] px-10 text-white shadow-lg transition hover:bg-[#009C38]">
            <Link href="/contact">
              일본 진출 상담 신청
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
