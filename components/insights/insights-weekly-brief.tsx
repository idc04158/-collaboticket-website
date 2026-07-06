import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type Props = {
  lines: string[]
}

export function InsightsWeeklyBrief({ lines }: Props) {
  return (
    <section aria-labelledby="weekly-brief-title" className="mt-12 rounded-2xl border bg-[var(--surface-elevated)] p-6 sm:p-8">
      <h2 id="weekly-brief-title" className="text-lg font-bold">
        이번주 3줄 요약
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        일본 EC·SNS·광고·리뷰 시장에서 주목할 변화를 빠르게 확인하세요.
      </p>

      <ul className="mt-5 space-y-3">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ul>

      <Button asChild variant="outline" className="mt-6 rounded-xl border-brand/30 font-semibold text-brand hover:bg-brand-light">
        <Link href="#insights-report-list">
          전체 분석 보기
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </Button>
    </section>
  )
}
