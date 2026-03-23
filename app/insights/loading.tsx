import { MarketingShell } from "@/components/marketing-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function InsightsLoading() {
  return (
    <MarketingShell>
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-4 h-10 w-56" />
          <Skeleton className="mt-4 h-4 w-full max-w-2xl" />

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border bg-card p-6">
                <Skeleton className="mb-4 aspect-[16/9] w-full rounded-lg" />
                <Skeleton className="mb-3 h-5 w-20" />
                <Skeleton className="mb-2 h-5 w-full" />
                <Skeleton className="mb-4 h-5 w-4/5" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
