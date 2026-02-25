import { Card, CardContent } from "@/components/ui/card"
import { Globe, Megaphone, Radio, BarChart3 } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "일본 진출 전략 수립",
    description:
      "시장 환경 분석부터 고객 세그먼트 정의, 채널 전략까지 데이터 기반의 체계적인 일본 시장 진출 로드맵을 수립합니다.",
  },
  {
    icon: Megaphone,
    title: "인플루언서 마케팅",
    description:
      "일본 현지 인플루언서와의 직접 네트워크를 활용한 브랜드 캠페인을 기획하고 실행합니다.",
  },
  {
    icon: Radio,
    title: "웨비나/세미나 기획",
    description:
      "타겟 오디언스를 대상으로 전략적 웨비나를 설계하여 리드 생성과 브랜드 신뢰도를 동시에 확보합니다.",
  },
  {
    icon: BarChart3,
    title: "시장 조사 및 데이터 분석",
    description:
      "일본 시장 데이터를 수집하고 분석하여 경쟁 환경, 소비자 트렌드, 성장 기회를 도출합니다.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {"Services"}
          </p>
          <h2 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"핵심 서비스"}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group border-border bg-card transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="flex flex-col gap-4 p-8">
                <div className="flex size-11 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-foreground/5">
                  <service.icon className="size-5 text-foreground" />
                </div>
                <h3 className="font-sans text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
