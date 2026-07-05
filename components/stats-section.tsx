import { expandedStats } from "@/lib/aeo-content"

export function StatsSection() {
  return (
    <section className="relative border-y bg-white py-14 lg:py-16" aria-labelledby="stats-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 id="stats-heading" className="sr-only">
          콜라보티켓 운영 실적 요약
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {expandedStats.map((stat) => (
            <li key={stat.headline} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-bold leading-snug text-foreground">{stat.headline}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stat.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
