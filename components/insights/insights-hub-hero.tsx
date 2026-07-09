import type { InsightEnriched } from "@/lib/insight-hub"

type Props = {
  stats: {
    weeklyNewReports: number
    totalInsights: number
    platformCount: number
    lastUpdated: string
  }
}

export function InsightsHubHero({ stats }: Props) {
  const kpis = [
    { label: "이번주 신규 리포트", value: `${stats.weeklyNewReports}건` },
    { label: "누적 인사이트", value: `${stats.totalInsights}건` },
    { label: "분석 플랫폼", value: `${stats.platformCount}개` },
    { label: "최종 업데이트", value: stats.lastUpdated },
  ]

  return (
    <section aria-labelledby="insights-hub-title" className="relative overflow-hidden border-b bg-[var(--surface-dark)] text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.06]" />
      <div className="pointer-events-none absolute -right-24 top-0 size-80 rounded-full bg-brand/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="section-label text-brand">일본 시장 데이터 센터</p>
        <h1 id="insights-hub-title" className="type-display max-w-3xl mt-4">
          일본 시장 인사이트
        </h1>
        <p className="type-lead mt-5 max-w-2xl text-white/70 sm:text-lg">
          매주 일본 EC, SNS, 소비자 트렌드, 광고 데이터, 플랫폼 변화, 성공 사례를 분석하여 실행 가능한
          인사이트를 제공합니다.
        </p>

        <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm"
            >
              <dt className="text-xs font-medium text-white/55">{kpi.label}</dt>
              <dd className="mt-2 font-mono text-2xl font-bold text-white">{kpi.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
