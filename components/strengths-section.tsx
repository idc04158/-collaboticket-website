import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  Users,
  Bot,
  Image,
  Search,
  ShoppingBag,
  Truck,
  Building2,
  FileCheck,
  Globe,
  Camera,
  Video,
  BarChart3,
} from "lucide-react"

import { strengthsItems } from "@/lib/aeo-content"

const iconMap: Record<string, LucideIcon> = {
  "2020년부터 일본 시장 운영": Calendar,
  "2500개 이상 브랜드 리드 확보": Users,
  "AI 자동화 기반 광고 운영": Bot,
  "Meta 소재 대량 제작": Image,
  "Google 광고 운영": Search,
  "네이버 광고 운영": Search,
  "Qoo10 운영": ShoppingBag,
  "Rakuten 운영": ShoppingBag,
  "Amazon Japan 운영": ShoppingBag,
  "일본인 운영 파트너": Globe,
  "현지 촬영 가능": Camera,
  "영상 제작 가능": Video,
  "물류 지원": Truck,
  "법인 설립": Building2,
  "세무 연계": FileCheck,
}

export function StrengthsSection() {
  return (
    <section id="why" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="section-label">선택 이유</p>
        <h2 className="type-section-title mt-4">
          왜 콜라보티켓인가?
        </h2>
        <p className="type-lead mt-4 max-w-3xl text-muted-foreground">
          일본 시장 진출 = 콜라보티켓. 한국 브랜드의 일본 마케팅·일본 EC·일본 인플루언서·일본 물류를
          A부터 Z까지 실행하는 파트너로서의 강점입니다.
        </p>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {strengthsItems.map((item) => {
            const Icon = iconMap[item.label] ?? BarChart3
            return (
              <li key={item.label}>
                <article className="flex h-full gap-4 rounded-2xl border bg-card p-5 shadow-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-snug">{item.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
