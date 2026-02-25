import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const articles = [
  {
    category: "Market Analysis",
    title: "2025년 일본 이커머스 시장 트렌드 분석",
    excerpt:
      "일본 이커머스 시장의 최신 동향과 한국 브랜드가 주목해야 할 핵심 성장 기회를 데이터 기반으로 분석합니다.",
  },
  {
    category: "Case Study",
    title: "K-뷰티 브랜드의 일본 진출 성공 사례",
    excerpt:
      "데이터 기반 전략과 인플루언서 마케팅을 결합하여 일본 시장에서 성과를 거둔 K-뷰티 브랜드의 실제 사례를 살펴봅니다.",
  },
  {
    category: "Strategy",
    title: "일본 B2B 리드 제네레이션 전략 가이드",
    excerpt:
      "웨비나와 콘텐츠 마케팅을 활용한 일본 B2B 시장에서의 효과적인 리드 확보 전략을 단계별로 안내합니다.",
  },
]

export function InsightsSection() {
  return (
    <section id="insights" className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {"Insights"}
          </p>
          <h2 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"인사이트 자료"}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {"데이터, 사례, 실행 전략을 기반으로 한 분석 콘텐츠"}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.title}
              className="group flex flex-col gap-4 border-t border-border pt-6"
            >
              <Badge
                variant="secondary"
                className="w-fit rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
              >
                {article.category}
              </Badge>
              <h3 className="font-sans text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-muted-foreground">
                {article.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
              <a
                href="#"
                className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                {"자세히 보기"}
                <ArrowRight className="size-3.5" />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button variant="outline" size="lg" className="rounded-lg px-8 font-medium">
            {"모든 인사이트 보기"}
          </Button>
        </div>
      </div>
    </section>
  )
}
