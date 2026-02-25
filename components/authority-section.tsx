import { Database, Users, Presentation } from "lucide-react"

const reasons = [
  {
    icon: Database,
    title: "일본 시장 전문 데이터 기반 전략",
    description:
      "일본 소비자 행동 데이터와 시장 트렌드를 기반으로 맞춤형 진출 전략을 설계합니다. 감이 아닌 데이터로 의사결정을 지원합니다.",
  },
  {
    icon: Users,
    title: "인플루언서 네트워크 및 실행 경험",
    description:
      "일본 현지 인플루언서와의 직접 네트워크를 활용하여 브랜드 인지도 확대부터 전환까지 실행 가능한 캠페인을 운영합니다.",
  },
  {
    icon: Presentation,
    title: "웨비나 기반 B2B 리드 설계 경험",
    description:
      "전략 웨비나를 통해 잠재 고객을 유치하고 B2B 파이프라인을 구축한 검증된 경험으로 실질적인 비즈니스 성과를 만들어냅니다.",
  },
]

export function AuthoritySection() {
  return (
    <section id="about" className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {"Why CollaboTicket"}
          </p>
          <h2 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"왜 콜라보티켓인가?"}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary">
                <reason.icon className="size-5 text-foreground" />
              </div>
              <h3 className="font-sans text-lg font-semibold text-foreground">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
