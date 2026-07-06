import { MarketingShell } from "@/components/marketing-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function InsightsLoading() {
  return (
    <MarketingShell>
      <section className="border-b bg-[var(--surface-dark)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="mt-4 h-12 w-full max-w-xl bg-white/10" />
          <Skeleton className="mt-4 h-20 w-full max-w-2xl bg-white/10" />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 rounded-2xl bg-white/10" />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="mt-12 h-48 w-full rounded-2xl" />
        <Skeleton className="mt-12 h-56 w-full rounded-2xl" />

        <Skeleton className="mt-12 h-8 w-40" />
        <Skeleton className="mt-6 h-32 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-48 w-full rounded-2xl" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl border bg-card">
              <Skeleton className="aspect-[16/9] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MarketingShell>
  )
}
