"use client"

import { useMemo, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { InsightCard } from "@/components/insights/insight-card"
import {
  filterInsights,
  INSIGHT_FILTER_GROUPS,
  type InsightEnriched,
} from "@/lib/insight-hub"

type Props = {
  posts: InsightEnriched[]
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-brand bg-brand text-white"
          : "border-border bg-background text-foreground hover:border-brand/50"
      }`}
    >
      {children}
    </button>
  )
}

function FilterGroup({
  title,
  value,
  onChange,
  options,
}: {
  title: string
  value: string
  onChange: (next: string) => void
  options: readonly string[]
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterChip active={value === "전체"} onClick={() => onChange("전체")}>
          전체
        </FilterChip>
        {options.map((option) => (
          <FilterChip key={option} active={value === option} onClick={() => onChange(option)}>
            {option}
          </FilterChip>
        ))}
      </div>
    </div>
  )
}

export function InsightsIndexClient({ posts }: Props) {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [platform, setPlatform] = useState(searchParams.get("platform") || "전체")
  const [topic, setTopic] = useState(searchParams.get("topic") || "전체")
  const [industry, setIndustry] = useState("전체")
  const [difficulty, setDifficulty] = useState("전체")

  const filtered = useMemo(
    () => filterInsights(posts, { query, platform, topic, industry, difficulty }),
    [posts, query, platform, topic, industry, difficulty],
  )

  return (
    <>
      <section aria-label="인사이트 검색" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <label htmlFor="insight-search" className="text-sm font-semibold text-foreground">
          리포트 검색
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          Qoo10, Rakuten, Meta, 리뷰, 인플루언서 등 키워드로 검색할 수 있습니다.
        </p>
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="insight-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: Qoo10, Rakuten, Meta, 리뷰, 인플루언서"
            className="h-11 rounded-xl pl-10"
          />
        </div>
      </section>

      <nav
        aria-label="인사이트 필터"
        className="mt-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
      >
        <div className="space-y-5">
          <FilterGroup title="플랫폼" value={platform} onChange={setPlatform} options={INSIGHT_FILTER_GROUPS.platforms} />
          <FilterGroup title="주제" value={topic} onChange={setTopic} options={INSIGHT_FILTER_GROUPS.topics} />
          <FilterGroup title="산업" value={industry} onChange={setIndustry} options={INSIGHT_FILTER_GROUPS.industries} />
          <FilterGroup
            title="난이도"
            value={difficulty}
            onChange={setDifficulty}
            options={INSIGHT_FILTER_GROUPS.difficulties}
          />
        </div>
      </nav>

      <p className="mt-6 text-sm text-muted-foreground">
        총 <span className="font-mono font-bold text-foreground">{filtered.length}</span>개 리포트
      </p>

      <div id="insights-report-list" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <InsightCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
          <p className="text-base font-semibold text-foreground">조건에 맞는 리포트가 없습니다.</p>
          <p className="mt-2 text-sm text-muted-foreground">검색어나 필터를 변경해 보세요.</p>
        </div>
      )}
    </>
  )
}
