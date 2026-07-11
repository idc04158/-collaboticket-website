import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function InsightDiagnosisCta() {
  return (
    <aside
      aria-labelledby="diagnosis-cta-title"
      className="mt-12 rounded-[2rem] border border-brand/25 bg-brand-light/50 p-8 text-center sm:p-10"
    >
      <p className="text-sm font-semibold text-brand">무료 진단</p>
      <h2 id="diagnosis-cta-title" className="type-section-title type-section-title--center mt-3">
        우리 브랜드도 일본 시장에서 가능성이 있을까요?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        현재 상품, 채널, 예산만 알려주시면 일본 진출 가능성과 우선 실행 과제를 무료로 정리해 드립니다.
      </p>
      <Button asChild className="btn-brand mt-6 gap-2 px-8">
        <Link href="/contact?topic=diagnosis">
          무료 일본 진출 진단 받기
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </aside>
  )
}
