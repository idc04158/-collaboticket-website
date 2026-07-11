import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const TRUST_POINTS = [
  "채널·SKU·예산 기준 우선순위",
  "1영업일 내 회신",
  "영업 압박 없음",
] as const

/** Mid-article inquiry CTA — placed after INSIGHT / before ACTION. */
export function InsightMidCta() {
  return (
    <aside
      aria-labelledby="insight-mid-cta-title"
      className="my-12 overflow-hidden rounded-2xl border border-brand/25 bg-gradient-to-br from-brand-light/80 via-white to-brand-light/40 shadow-[0_8px_30px_var(--brand-glow)]"
    >
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">무료 진단</p>
          <h2
            id="insight-mid-cta-title"
            className="mt-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            이 글의 실행 항목, 우리 브랜드엔 뭐부터일까요?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            채널·SKU·예산만 알려주시면, 지금 읽은 내용을 기준으로 우선 손댈 과제를 무료로 정리해 드립니다.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                <CheckCircle2 className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <Link
            href="/contact?topic=insight-mid&source=insight-body"
            className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm whitespace-nowrap"
          >
            무료로 우선순위 받기
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Link>
          <p className="text-center text-[11px] text-muted-foreground sm:text-right">
            약 2분 · 상담 신청 폼
          </p>
        </div>
      </div>
    </aside>
  )
}
