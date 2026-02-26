import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const articles = [
  {
    category: "Market Analysis",
    title: "2025년 일본 이커머스 시장 트렌드 분석",
    excerpt:
      "일본 소비자 의사결정 구조와 카테고리별 성장 데이터를 기반으로 한국 브랜드의 기회 요인을 분석합니다.",
  },
  {
    category: "Case Study",
    title: "체험단 + 인플루언서 결합으로 매출 43% 상승 사례",
    excerpt:
      "리뷰 신뢰 구조 형성 이후 인플루언서 확산을 통해 메가와리 매출이 상승한 실제 실행 사례를 공개합니다.",
  },
  {
    category: "Strategy Guide",
    title: "일본 공식 SNS 운영이 매출에 미치는 영향",
    excerpt:
      "공식 계정 운영이 검색 노출과 브랜드 신뢰도에 어떤 영향을 미치는지 데이터로 설명합니다.",
  },
]

export function InsightsSection() {
  return (
    <section id="insights" className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mb-16 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Data & Case Hub
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            데이터 인사이트 & 실행 사례
          </h2>
          <p className="mt-4 text-muted-foreground">
            분석과 실제 성과를 기반으로 일본 시장을 설명합니다.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.title}
              className="group flex flex-col gap-4 border rounded-xl p-6 bg-background hover:shadow-md transition"
            >
              <Badge className="w-fit text-xs">
                {article.category}
              </Badge>

              <h3 className="text-lg font-semibold leading-snug group-hover:text-[#00B140] transition">
                {article.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>

              <a
                href="#"
                className="mt-auto inline-flex items-center gap-1 text-sm font-medium"
              >
                자세히 보기
                <ArrowRight className="size-3.5" />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-lg px-8 font-medium border-[#00B140] text-[#00B140] hover:bg-[#00B140] hover:text-white"
          >
            모든 인사이트 보기
          </Button>
        </div>

      </div>
    </section>
  )
}