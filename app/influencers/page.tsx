import type { Metadata } from "next"
import Link from "next/link"

import { MarketingShell } from "@/components/marketing-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "인플루언서 매칭 데모 | CollaboTicket",
  description:
    "카테고리·지표 기반으로 일본 인플루언서 후보를 빠르게 좁혀 보는 데모 흐름을 안내합니다. 실제 리스트는 상담 후 제공됩니다.",
}

export default function InfluencersPage() {
  return (
    <MarketingShell>
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Demo</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            인플루언서 매칭 데모
          </h1>
          <p className="mt-4 text-muted-foreground">
            메인 페이지의 매칭 UI는 샘플 데이터 기반 데모입니다. 브랜드에 맞는 실제 후보군과 지표는 상담을 통해 공유드립니다.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 sm:grid-cols-2">
          {[
            {
              title: "카테고리 & 톤 필터",
              body: "뷰티·식품 등 카테고리와 콘텐츠 톤을 맞춰 1차 후보를 축소합니다.",
            },
            {
              title: "참여율·도달",
              body: "팔로워 수만이 아닌 최근 캠페인 기준 참여 지표를 함께 봅니다.",
            },
            {
              title: "콘텐츠 샘플",
              body: "릴스·피드 샘플로 브랜드 무드와의 적합도를 빠르게 확인합니다.",
            },
            {
              title: "계약·2차 활용",
              body: "협업 조건과 라이선스·2차 활용 범위까지 한 번에 협의할 수 있습니다.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-border transition hover:shadow-md">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-xl px-6 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-[#00B140] px-10 text-white transition hover:bg-[#009C38]"
          >
            <Link href="/contact">맞춤 리스트 상담받기</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            홈 화면의 「우리 브랜드에 맞는 인플루언서 찾기」에서도 동일 흐름으로 이동할 수 있습니다.
          </p>
        </div>
      </section>
    </MarketingShell>
  )
}
