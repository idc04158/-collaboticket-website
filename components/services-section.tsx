import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Megaphone, Instagram, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  { icon: Users, title: "체험단 운영", description: "일본형 리뷰 확보와 평점 관리", href: "/contact" },
  { icon: Megaphone, title: "인플루언서 캠페인", description: "카테고리 맞춤 매칭과 확산 설계", href: "/influencers" },
  { icon: Instagram, title: "SNS 운영대행", description: "공식 계정 운영과 신뢰 자산 축적", href: "/contact" },
  { icon: Building2, title: "법인·물류 지원", description: "판매 구조 안정화와 장기 운영", href: "/contact" },
]

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Step-Based Solutions</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">필요한 실행 서비스를 바로 연결합니다</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title} className="group border-border bg-background transition duration-300 hover:scale-[1.02] hover:shadow-xl">
              <CardContent className="flex items-start gap-4 p-7">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#00B140]/10 text-[#00B140]">
                  <service.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                  <Button asChild variant="link" className="mt-2 h-auto p-0 text-[#00B140]">
                    <Link href={service.href}>자세히 보기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
