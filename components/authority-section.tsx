import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthoritySection() {
  return (
    <section className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Execution Flow
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            일본 시장은 ‘단계별 신뢰 축적 구조’로 움직입니다
          </h2>
          <p className="mt-4 text-muted-foreground">
            단일 캠페인이 아니라, 연결된 실행 구조로 접근해야
            일본 시장에서 성과가 지속됩니다.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "STEP 01",
              title: "체험단 운영",
              desc: "100명 모집 → 리뷰 80건 이상 확보 → 평균 평점 4.5 이상 유지",
            },
            {
              step: "STEP 02",
              title: "인플루언서 확산",
              desc: "카테고리 맞춤 5~8명 협업 → 평균 조회수 40K 이상 확보",
            },
            {
              step: "STEP 03",
              title: "SNS 운영",
              desc: "월간 도달 150K 이상 → 브랜드 신뢰도 상승",
            },
            {
              step: "STEP 04",
              title: "법인 · 물류 · 세무",
              desc: "일본 법인 설립 → 세무·물류 인프라 구축 → 장기 운영 구조 완성",
            },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="text-sm font-semibold text-[#00B140]">
                {item.step}
              </div>
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button className="bg-[#00B140] hover:bg-[#009C38] text-white px-10 rounded-lg shadow-md">
            현재 단계 진단받기
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}