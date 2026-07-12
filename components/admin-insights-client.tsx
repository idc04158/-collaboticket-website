"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"

import type { InsightMeta } from "@/lib/insights"

type EditableInsight = InsightMeta & { content: string }

export function AdminInsightsClient() {
  const [authChecked, setAuthChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [insights, setInsights] = useState<InsightMeta[]>([])
  const [selected, setSelected] = useState<EditableInsight | null>(null)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")

  const isNew = !selected?.slug
  const tagString = useMemo(() => selected?.tags.join(", ") || "", [selected?.tags])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return insights
    return insights.filter((item) => {
      const hay = `${item.title} ${item.slug} ${item.category} ${item.tags.join(" ")}`.toLowerCase()
      return hay.includes(q)
    })
  }, [insights, query])

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

  const loadList = useCallback(async () => {
    const { data } = await request({ action: "list" })
    if (data.ok) setInsights(data.insights as InsightMeta[])
  }, [])

  const login = useCallback(
    async (id: string, pw: string) => {
      setLoading(true)
      setError("")
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, username: id, password: pw }),
      })
      const data = (await res.json()) as { ok: boolean; message?: string }
      setLoading(false)
      if (!data.ok) {
        setError(data.message || "로그인 실패")
        setLoggedIn(false)
        return false
      }
      setLoggedIn(true)
      await loadList()
      return true
    },
    [loadList],
  )

  useEffect(() => {
    ;(async () => {
      const params = new URLSearchParams(window.location.search)
      const idFromUrl = params.get("id") || params.get("user") || params.get("username")
      const pwFromUrl = params.get("pw") || params.get("password")

      if (idFromUrl && pwFromUrl) {
        const ok = await login(idFromUrl, pwFromUrl)
        setAuthChecked(true)
        if (ok) {
          window.history.replaceState({}, "", "/admin/insights")
        }
        return
      }

      const res = await fetch("/api/admin/auth", { credentials: "include" })
      const data = (await res.json()) as { ok: boolean }
      setLoggedIn(Boolean(data.ok))
      setAuthChecked(true)
      if (data.ok) await loadList()
    })()
  }, [loadList, login])

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" })
    setLoggedIn(false)
    setSelected(null)
    setInsights([])
  }

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
    setSaved("")
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
    setTimeout(() => setSaved(""), 4000)
    await openInsight(slug)
  }

  async function uploadCover(file: File) {
    if (!selected) return
    setUploading(true)
    setError("")
    const form = new FormData()
    form.append("file", file)
    form.append("purpose", "insight")
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body: form,
    })
    const data = (await res.json()) as { ok: boolean; url?: string; message?: string }
    setUploading(false)
    if (!data.ok || !data.url) {
      setError(data.message || "이미지 업로드 실패")
      return
    }
    setSelected({ ...selected, image: data.url })
    setSaved("커버 이미지 업로드 완료 — 저장을 눌러 반영하세요")
  }

  if (!authChecked) {
    return <main className="p-8 text-sm text-muted-foreground">세션 확인 중…</main>
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f3] p-6">
        <form
          className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            void login(username, password)
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#00B140]">Admin Insights</p>
          <h1 className="mt-2 text-xl font-black">블로그 글 관리</h1>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            외부 공개되지 않는 관리자 페이지입니다. URL로도 로그인할 수 있습니다.
            <br />
            <code className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[11px]">
              /admin/insights?id=admin&amp;pw=비밀번호
            </code>
          </p>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          <label className="mt-5 block text-xs font-semibold">
            아이디
            <input
              className="mt-1.5 w-full rounded-xl border p-3 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="mt-3 block text-xs font-semibold">
            비밀번호
            <input
              type="password"
              className="mt-1.5 w-full rounded-xl border p-3 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-[#00B140] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f8f3] p-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00B140]">Admin Insights</p>
            <h1 className="text-2xl font-black">블로그 글 관리</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              제목·본문·커버 이미지를 수정할 수 있습니다. 저장 후 미리보기로 확인하세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/crm" className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">
              CRM
            </Link>
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
                  content: "## FACT\n\n## INSIGHT: CollaboTicket 운영 데이터\n\n## ACTION\n\n## FAQ\n\n",
                })
              }
              className="rounded-xl bg-[#00B140] px-4 py-2 text-sm font-bold text-white"
            >
              새 글 작성
            </button>
            <button type="button" onClick={() => void logout()} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">
              로그아웃
            </button>
          </div>
        </div>

        {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {saved && <p className="mb-3 rounded-lg border border-[#00B140]/20 bg-[#00B140]/10 p-3 text-sm">{saved}</p>}

        <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold">인사이트 목록 ({filtered.length})</h2>
            </div>
            <input
              className="mb-3 w-full rounded-xl border p-2.5 text-sm"
              placeholder="제목·슬러그·태그 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="max-h-[72vh] space-y-2 overflow-auto">
              {filtered.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => void openInsight(item.slug)}
                  className={`w-full rounded-xl border p-3 text-left hover:border-[#00B140] ${
                    selected?.slug === item.slug ? "border-[#00B140] bg-[#00B140]/5" : ""
                  }`}
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
                  className="w-full rounded-xl border p-3 text-sm font-semibold"
                  placeholder="제목"
                  value={selected.title}
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                />
                <textarea
                  className="min-h-20 w-full rounded-xl border p-3 text-sm"
                  placeholder="설명 (SEO description)"
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

                <div className="rounded-xl border p-3">
                  <p className="text-xs font-bold text-muted-foreground">커버 이미지</p>
                  <input
                    className="mt-2 w-full rounded-xl border p-3 text-sm"
                    placeholder="이미지 URL (또는 아래에서 업로드)"
                    value={selected.image || ""}
                    onChange={(e) => setSelected({ ...selected, image: e.target.value })}
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold hover:border-[#00B140]">
                      {uploading ? "업로드 중..." : "이미지 파일 업로드"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) void uploadCover(file)
                          e.currentTarget.value = ""
                        }}
                      />
                    </label>
                    {selected.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selected.image}
                        alt="커버 미리보기"
                        className="h-16 w-28 rounded-lg border object-cover"
                      />
                    )}
                  </div>
                </div>

                {!isNew && (
                  <p className="text-xs text-muted-foreground">
                    slug: <code>{selected.slug}</code>
                  </p>
                )}

                <div>
                  <p className="mb-1.5 text-xs font-bold text-muted-foreground">본문 (Markdown)</p>
                  <textarea
                    className="min-h-[420px] w-full rounded-xl border p-3 font-mono text-xs leading-relaxed"
                    value={selected.content}
                    onChange={(e) => setSelected({ ...selected, content: e.target.value })}
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
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
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  참고: Vercel 등 서버리스 환경에서는 파일 저장이 재배포 전까지 유지되지 않을 수 있습니다.
                  로컬/영구 디스크 환경에서 저장한 뒤 git으로 배포하는 방식을 권장합니다.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
