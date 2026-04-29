"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import type { InsightMeta } from "@/lib/insights"

type EditableInsight = InsightMeta & { content: string }

export function AdminInsightsClient() {
  const [authChecked, setAuthChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [insights, setInsights] = useState<InsightMeta[]>([])
  const [selected, setSelected] = useState<EditableInsight | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")

  const isNew = !selected?.slug
  const tagString = useMemo(() => selected?.tags.join(", ") || "", [selected?.tags])

  async function request(payload: Record<string, unknown>) {
    const res = await fetch("/api/admin/insights", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return { res, data }
  }

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/admin/auth", { credentials: "include" })
      const data = (await res.json()) as { ok: boolean }
      setLoggedIn(Boolean(data.ok))
      setAuthChecked(true)
      if (data.ok) {
        const { data: list } = await request({ action: "list" })
        if (list.ok) setInsights(list.insights as InsightMeta[])
      }
    })()
  }, [])

  async function openInsight(slug: string) {
    setLoading(true)
    setError("")
    const { data } = await request({ action: "get", slug })
    setLoading(false)
    if (!data.ok) {
      setError(data.message || "불러오기 실패")
      return
    }
    setSelected(data.insight as EditableInsight)
  }

  async function saveInsight() {
    if (!selected) return
    setLoading(true)
    setError("")
    const { data } = await request({
      action: "save",
      slug: selected.slug,
      title: selected.title,
      description: selected.description,
      category: selected.category,
      tags: selected.tags,
      date: selected.date,
      image: selected.image || "",
      content: selected.content,
    })
    setLoading(false)
    if (!data.ok) {
      setError(data.message || "저장 실패")
      return
    }
    setInsights(data.insights as InsightMeta[])
    const slug = data.slug as string
    setSaved(`저장 완료: ${slug}`)
    setTimeout(() => setSaved(""), 3000)
    await openInsight(slug)
  }

  if (!authChecked) return <main className="p-8 text-sm text-muted-foreground">세션 확인 중…</main>
  if (!loggedIn) {
    return (
      <main className="p-8">
        <p className="text-sm text-muted-foreground">CRM과 같은 관리자 비밀번호로 먼저 로그인해 주세요.</p>
        <Link href="/admin/crm" className="mt-3 inline-block text-sm font-semibold text-[#00B140]">
          CRM 로그인 페이지로 이동
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f8f3] p-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00B140]">Admin Insights</p>
            <h1 className="text-2xl font-black">인사이트 글 관리</h1>
          </div>
          <button
            type="button"
            onClick={() =>
              setSelected({
                slug: "",
                title: "",
                description: "",
                category: "Market Analysis",
                tags: [],
                date: new Date().toISOString().slice(0, 10),
                image: "",
                content: "## 요약\n\n",
              })
            }
            className="rounded-xl bg-[#00B140] px-4 py-2 text-sm font-bold text-white"
          >
            새 글 작성
          </button>
        </div>

        {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {saved && <p className="mb-3 rounded-lg border border-[#00B140]/20 bg-[#00B140]/10 p-3 text-sm">{saved}</p>}

        <div className="grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-bold">인사이트 목록 ({insights.length})</h2>
            <div className="max-h-[72vh] space-y-2 overflow-auto">
              {insights.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => void openInsight(item.slug)}
                  className="w-full rounded-xl border p-3 text-left hover:border-[#00B140]"
                >
                  <p className="line-clamp-1 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.category} · {item.date}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm">
            {!selected ? (
              <p className="text-sm text-muted-foreground">왼쪽에서 글을 선택하거나 새 글을 만드세요.</p>
            ) : (
              <div className="space-y-3">
                <input
                  className="w-full rounded-xl border p-3 text-sm"
                  placeholder="제목"
                  value={selected.title}
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                />
                <input
                  className="w-full rounded-xl border p-3 text-sm"
                  placeholder="설명"
                  value={selected.description}
                  onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="w-full rounded-xl border p-3 text-sm"
                    placeholder="카테고리"
                    value={selected.category}
                    onChange={(e) => setSelected({ ...selected, category: e.target.value })}
                  />
                  <input
                    type="date"
                    className="w-full rounded-xl border p-3 text-sm"
                    value={selected.date}
                    onChange={(e) => setSelected({ ...selected, date: e.target.value })}
                  />
                </div>
                <input
                  className="w-full rounded-xl border p-3 text-sm"
                  placeholder="태그 (쉼표로 구분)"
                  value={tagString}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      tags: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <input
                  className="w-full rounded-xl border p-3 text-sm"
                  placeholder="대표 이미지 URL"
                  value={selected.image || ""}
                  onChange={(e) => setSelected({ ...selected, image: e.target.value })}
                />
                {!isNew && (
                  <p className="text-xs text-muted-foreground">
                    slug: <code>{selected.slug}</code>
                  </p>
                )}
                <textarea
                  className="min-h-[420px] w-full rounded-xl border p-3 font-mono text-xs"
                  value={selected.content}
                  onChange={(e) => setSelected({ ...selected, content: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void saveInsight()}
                    className="rounded-xl bg-[#00B140] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {loading ? "저장 중..." : "저장"}
                  </button>
                  {selected.slug && (
                    <Link
                      href={`/insights/${selected.slug}`}
                      target="_blank"
                      className="rounded-xl border px-4 py-2 text-sm font-bold"
                    >
                      미리보기
                    </Link>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
