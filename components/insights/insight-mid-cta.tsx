import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Compact mid-article CTA — placed after INSIGHT / before ACTION. */
export function InsightMidCta() {
  return (
    <aside
      aria-labelledby="insight-mid-cta-title"
      className="my-10 rounded-2xl border border-brand/20 bg-brand-light/35 px-5 py-6 sm:px-7 sm:py-7"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">실행이 막힐 때</p>
      <h2 id="insight-mid-cta-title" className="mt-2 text-lg font-bold tracking-tight text-foreground sm:text-xl">
        우리 브랜드 기준으로 우선순위를 정리해 드릴까요?
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        채널·SKU·예산만 알려주시면, 지금 글의 실행 항목 중 어디에 먼저 손을 대야 하는지 무료로 짚어 드립니다.
      </p>
      <Button asChild className="btn-brand mt-4 gap-2">
        <Link href="/contact?topic=insight-mid&source=insight-body">
          무료 진단 신청
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </aside>
  )
}
