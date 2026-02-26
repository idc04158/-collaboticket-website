import { Card, CardContent } from "@/components/ui/card"
import { Users, Megaphone, Instagram, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Users,
    title: "체험단 운영",
    subtitle: "STEP 01 · 신뢰 확보",
    description:
      "7,000명 리뷰어 풀 기반으로 일본형 장문 리뷰를 확보하고 초기 신뢰 구조를 형성합니다.",
    result: "리뷰 80건 이상 · 평균 평점 4.5+ 유지",
    cta: "체험단 자세히 보기",
  },
  {
    icon: Megaphone,
    title: "인플루언서 마케팅",
    subtitle: "STEP 02 · 확산 가속",
    description:
      "카테고리 맞춤 인플루언서를 매칭하여 노출과 전환을 동시에 설계합니다.",
    result: "노출 100만+ · 메가와리 매출 상승 사례",
    cta: "인플루언서 레퍼런스 보기",
  },
  {
    icon: Instagram,
    title: "SNS 운영대행",
    subtitle: "STEP 03 · 브랜드 축적",
    description:
      "공식 SNS 계정을 전략적으로 운영하여 검색 노출과 브랜드 신뢰도를 강화합니다.",
    result: "월간 도달 150K+ · 계정 신뢰도 상승",
    cta: "SNS 운영 전략 보기",
  },
  {
    icon: Building2,
    title: "법인 · 세무 · 물류 지원",
    subtitle: "STEP 04 · 구조 완성",
    description:
      "일본 법인 설립부터 세무 관리, 물류 연결까지 장기 운영 구조를 완성합니다.",
    result: "라쿠텐·아마존 판매 원활화 사례",
    cta: "법인·물류 케이스 보기",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Step-Based Solutions
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            각 단계에 맞춘 실행 솔루션
          </h2>
          <p className="mt-4 text-muted-foreground">
            일본 시장은 단일 캠페인으로 성과가 나지 않습니다.
            단계에 맞는 실행 전략이 필요합니다.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group border-border bg-card transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <CardContent className="flex flex-col gap-5 p-8">

                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#00B140]/10">
                    <service.icon className="size-5 text-[#00B140]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#00B140] font-semibold">
                      {service.subtitle}
                    </p>
                    <h3 className="text-lg font-semibold">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                <div className="text-sm font-medium text-foreground">
                  ✔ {service.result}
                </div>

                <Button
                  variant="outline"
                  className="mt-2 border-[#00B140] text-[#00B140] hover:bg-[#00B140] hover:text-white transition"
                >
                  {service.cta}
                </Button>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}