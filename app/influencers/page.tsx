import type { Metadata } from "next"
import Link from "next/link"
import { Users, Eye, TrendingUp, Filter } from "lucide-react"

import { MarketingShell } from "@/components/marketing-shell"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "인플루언서 매칭 데모 | CollaboTicket",
  description:
    "카테고리·지표 기반으로 일본 인플루언서 후보를 빠르게 좁혀 보는 데모 흐름을 안내합니다. 실제 리스트는 상담 후 제공됩니다.",
  alternates: {
    canonical: "/influencers",
  },
}

const features = [
  {
    icon: Filter,
    title: "카테고리 & 톤 필터",
    body: "뷰티·식품 등 카테고리와 콘텐츠 톤을 맞춰 1차 후보를 축소합니다.",
  },
  {
    icon: Eye,
    title: "참여율·도달",
    body: "팔로워 수만이 아닌 최근 캠페인 기준 참여 지표를 함께 봅니다.",
  },
  {
    icon: Users,
    title: "콘텐츠 샘플",
    body: "릴스·피드 샘플로 브랜드 무드와의 적합도를 빠르게 확인합니다.",
  },
  {
    icon: TrendingUp,
    title: "계약·2차 활용",
    body: "협업 조건과 라이선스·2차 활용 범위까지 한 번에 협의할 수 있습니다.",
  },
]

export default function InfluencersPage() {
  return (
    <MarketingShell>
      <PageHero
        label="Influencer Data Lab"
        title="인플루언서 매칭 데모"
        description="2,400+ 일본 인플루언서 DB를 기반으로 카테고리·참여율·콘텐츠 적합도로 후보를 선별합니다. 실제 리스트는 상담을 통해 공유드립니다."
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <item.icon className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/contact" className="btn-brand px-10">
              맞춤 리스트 상담받기
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              홈 화면의 인플루언서 섹션에서도 동일한 매칭 흐름을 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
