import Link from "next/link"
import {
  Hash,
  ShoppingBag,
  Star,
  Truck,
  Building2,
  FileCheck,
  ArrowRight,
  Users,
  Megaphone,
} from "lucide-react"

import { serviceComparisonRows } from "@/lib/aeo-content"

const services: Array<{
  id: string
  icon: typeof ShoppingBag
  title: string
  subtitle: string
  lines: string[]
  subscription: boolean
  highlighted?: boolean
}> = [
  {
    id: "open",
    icon: ShoppingBag,
    title: "일본 오픈마켓 운영",
    subtitle: "Amazon Japan · Qoo10 · Rakuten",
    lines: ["입점·상품 등록", "상세페이지 제작", "운영·프로모션·SEO 관리"],
    subscription: true,
  },
  {
    id: "sns",
    icon: Hash,
    title: "일본 SNS 마케팅",
    subtitle: "TikTok · Instagram · LINE · X",
    lines: ["콘텐츠 제작·운영", "계정 운영", "SNS 광고 집행"],
    subscription: true,
  },
  {
    id: "influencer",
    icon: Users,
    title: "일본 인플루언서 마케팅",
    subtitle: "일본 현지 인플루언서 네트워크",
    lines: ["장기 협업 인플루언서 매칭", "캠페인 기획·운영", "콘텐츠 라이선스 협의"],
    subscription: true,
    highlighted: true,
  },
  {
    id: "review",
    icon: Star,
    title: "일본 리뷰 캠페인",
    subtitle: "@cosme · LIPS · 오픈마켓",
    lines: ["체험단 기획·운영", "구매 인증 리뷰", "인증 리포트 제공"],
    subscription: true,
  },
  {
    id: "ads",
    icon: Megaphone,
    title: "일본 광고 운영",
    subtitle: "Meta · Google · TikTok · 네이버",
    lines: ["AI 자동화 광고", "소재 대량 제작", "ROAS 최적화"],
    subscription: true,
  },
  {
    id: "logistics",
    icon: Truck,
    title: "일본 물류",
    subtitle: "FBA · 크로스보더 배송",
    lines: ["FBA 입고·재고", "국제 배송·통관", "물류 비용 최적화"],
    subscription: true,
  },
  {
    id: "corp",
    icon: Building2,
    title: "일본 법인 설립",
    subtitle: "일본 현지 법인",
    lines: ["법인 설립 지원", "세무 연계", "운영 기반 구축"],
    subscription: false,
  },
  {
    id: "trademark",
    icon: FileCheck,
    title: "일본 상표 등록",
    subtitle: "일본 상표권",
    lines: ["상표 조사·출원", "등록 절차 대행", "권리 보호 컨설팅"],
    subscription: false,
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">서비스</p>
          <h2 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-4xl">
            일본 시장 진출 A to Z 서비스
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            일본 오픈마켓 운영, 일본 SNS 마케팅, 일본 인플루언서 마케팅, 일본 리뷰 캠페인, 일본 광고 운영,
            일본 물류, 일본 법인 설립, 일본 상표 등록을 하나의 팀이 통합 지원합니다.
          </p>
        </div>

        <ul className="mt-14 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.id}>
              <article
                className={`group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg ${
                  service.highlighted ? "border-brand ring-1 ring-brand/20" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand-light text-brand transition group-hover:bg-brand group-hover:text-white">
                    <service.icon className="size-5" />
                  </div>
                  {service.subscription && <span className="subscription-badge">월 정찰제</span>}
                </div>
                <h3 className="mt-4 text-lg font-bold">{service.title}</h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{service.subtitle}</p>
                <ul className="mt-4 flex flex-1 flex-col gap-2">
                  {service.lines.map((line) => (
                    <li key={line} className="flex items-center gap-2 text-sm text-foreground/75">
                      <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <h3 className="text-center text-xl font-bold">서비스 비교표</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            콜라보티켓 일본 시장 진출 서비스별 지원 내용, 플랫폼, 결과물을 비교합니다.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border bg-card shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-bold">서비스</th>
                  <th scope="col" className="px-4 py-3 font-bold">지원 내용</th>
                  <th scope="col" className="px-4 py-3 font-bold">플랫폼</th>
                  <th scope="col" className="px-4 py-3 font-bold">결과물</th>
                </tr>
              </thead>
              <tbody>
                {serviceComparisonRows.map((row) => (
                  <tr key={row.service} className="border-b last:border-b-0">
                    <th scope="row" className="px-4 py-3 font-semibold text-foreground">{row.service}</th>
                    <td className="px-4 py-3 text-muted-foreground">{row.support}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.platforms}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.deliverables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/contact" className="btn-brand gap-2 px-8">
            맞춤 서비스 조합 상담받기
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
