import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, ArrowRight, Play } from "lucide-react"

export function WebinarsSection() {
  return (
    <section id="webinars" className="scroll-mt-24 bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Webinars
          </p>
          <h2 className="font-sans text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            웨비나
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/40" />
                <span className="relative inline-flex size-2 rounded-full bg-foreground" />
              </span>
              진행 예정 웨비나
            </h3>
            <Card className="border-border bg-card transition hover:shadow-md">
              <CardContent className="flex flex-col gap-5 p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  <time dateTime="2026-03-15">2026년 3월 15일 (목) 14:00 KST</time>
                </div>
                <h4 className="font-sans text-xl font-semibold text-foreground">
                  일본 이커머스 시장 진출을 위한 데이터 전략
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  일본 시장의 최신 이커머스 트렌드와 데이터 분석을 통해 한국 브랜드가 효과적으로 진출할 수 있는 전략적 프레임워크를 공유합니다.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-fit rounded-lg bg-[#00B140] px-8 font-medium text-white transition hover:bg-[#009C38]"
                >
                  <Link href="/contact">
                    사전 신청
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              종료된 웨비나
            </h3>
            <Card className="border-border bg-card transition hover:shadow-md">
              <CardContent className="flex flex-col gap-5 p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  <time dateTime="2026-01-20">2026년 1월 20일 (수) 14:00 KST</time>
                </div>
                <h4 className="font-sans text-xl font-semibold text-foreground">
                  K-뷰티 브랜드를 위한 일본 인플루언서 활용법
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  일본 뷰티 시장에서 인플루언서 마케팅을 효과적으로 활용하여 브랜드 인지도와 매출을 동시에 높인 실제 사례를 분석합니다.
                </p>
                <Button asChild variant="outline" size="lg" className="w-fit rounded-lg px-8 font-medium">
                  <Link href="/webinar">
                    <Play className="size-4" />
                    요약 보기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
