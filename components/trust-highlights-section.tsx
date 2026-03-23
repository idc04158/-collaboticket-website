import { BadgeCheck, BarChart3, Users } from "lucide-react"

const trustItems = [
  {
    icon: Users,
    title: "7,000+ 리뷰어 풀",
    desc: "카테고리별 체험단을 빠르게 구성",
  },
  {
    icon: BadgeCheck,
    title: "평균 4.5+ 평점 유지",
    desc: "신뢰도 중심 리뷰 구조 운영",
  },
  {
    icon: BarChart3,
    title: "성과 리포트 제공",
    desc: "노출·전환·재구매 지표까지 추적",
  },
]

export function TrustHighlightsSection() {
  return (
    <section className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Proven Trust</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">7,000+ 리뷰어 기반 운영 시스템</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-background p-7 shadow-md transition hover:scale-[1.02] hover:shadow-xl">
              <div className="mb-4 inline-flex rounded-lg bg-[#00B140]/10 p-2.5 text-[#00B140]">
                <item.icon className="size-5" />
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
