"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"

import type { InsightMeta } from "@/lib/insights"

type EditableInsight = InsightMeta & { content: string }

type AiChatItem = {
  role: "user" | "assistant"
  content: string
  applied?: boolean
}

type CoverCandidate = {
  id: string
  url: string
  thumb: string
  photographer?: string
  source: "unsplash" | "pool"
}

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
  const [imageKeyword, setImageKeyword] = useState("")
  const [imageResults, setImageResults] = useState<CoverCandidate[]>([])
  const [imageSearching, setImageSearching] = useState(false)
  const [imageProvider, setImageProvider] = useState<"unsplash" | "pool" | "">("")
  const [aiInput, setAiInput] = useState("")
  const [aiBusy, setAiBusy] = useState(false)
  const [aiChat, setAiChat] = useState<AiChatItem[]>([])
  const [pendingAiContent, setPendingAiContent] = useState<string | null>(null)
  const [pendingAiSummary, setPendingAiSummary] = useState<string | null>(null)

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
    setAiChat([])
    setPendingAiContent(null)
    setPendingAiSummary(null)
    setImageResults([])
    setImageKeyword("")
  }

  async function searchCoverImages() {
    const q = imageKeyword.trim() || selected?.title || selected?.tags?.[0] || ""
    if (!q) {
      setError("이미지 검색 키워드를 입력해주세요.")
      return
    }
    setImageSearching(true)
    setError("")
    const res = await fetch(`/api/admin/insights/images?q=${encodeURIComponent(q)}`, {
      credentials: "include",
    })
    const data = (await res.json()) as {
      ok: boolean
      images?: CoverCandidate[]
      provider?: "unsplash" | "pool"
      message?: string
    }
    setImageSearching(false)
    if (!data.ok || !data.images) {
      setError(data.message || "이미지 검색 실패")
      return
    }
    setImageResults(data.images)
    setImageProvider(data.provider || "")
  }

  async function askAi() {
    if (!selected || !aiInput.trim()) return
    const instruction = aiInput.trim()
    const baseContent = pendingAiContent ?? selected.content
    setAiBusy(true)
    setError("")
    setAiChat((prev) => [...prev, { role: "user", content: instruction }])
    setAiInput("")

    const res = await fetch("/api/admin/insights/ai", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: selected.title,
        description: selected.description,
        content: baseContent,
        instruction,
        history: aiChat.slice(-6),
      }),
    })
    const data = (await res.json()) as {
      ok: boolean
      reply?: string
      summary?: string
      content?: string
      title?: string
      description?: string
      message?: string
    }
    setAiBusy(false)

    if (!data.ok || !data.reply) {
      setError(data.message || "AI 요청 실패")
      setAiChat((prev) => [...prev, { role: "assistant", content: data.message || "요청에 실패했습니다." }])
      return
    }

    setAiChat((prev) => [...prev, { role: "assistant", content: data.reply || "" }])

    if (data.content) {
      setPendingAiContent(data.content)
      setPendingAiSummary(data.summary?.trim() || data.reply.trim())
    }
    if (data.title || data.description) {
      setSelected((prev) =>
        prev
          ? {
              ...prev,
              title: data.title || prev.title,
              description: data.description || prev.description,
            }
          : prev,
      )
    }
  }

  function applyAiContent() {
    if (!selected || !pendingAiContent) return
    setSelected({ ...selected, content: pendingAiContent })
    setPendingAiContent(null)
    setPendingAiSummary(null)
    setSaved("AI 본문을 에디터에 반영했습니다. 저장을 눌러 확정하세요.")
    setTimeout(() => setSaved(""), 4000)
  }

  function discardAiContent() {
    setPendingAiContent(null)
    setPendingAiSummary(null)
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
                    placeholder="이미지 URL (검색·업로드로도 설정 가능)"
                    value={selected.image || ""}
                    onChange={(e) => setSelected({ ...selected, image: e.target.value })}
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <input
                      className="min-w-[12rem] flex-1 rounded-xl border p-2.5 text-sm"
                      placeholder="키워드 검색 (예: japan ecommerce beauty)"
                      value={imageKeyword}
                      onChange={(e) => setImageKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          void searchCoverImages()
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={imageSearching}
                      onClick={() => void searchCoverImages()}
                      className="rounded-xl border px-3 py-2 text-xs font-bold hover:border-[#00B140] disabled:opacity-50"
                    >
                      {imageSearching ? "검색 중..." : "푸티지 8개 검색"}
                    </button>
                    <label className="inline-flex cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold hover:border-[#00B140]">
                      {uploading ? "업로드 중..." : "파일 업로드"}
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
                  {imageResults.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-[11px] text-muted-foreground">
                        검색 결과 중 선택
                        {imageProvider ? ` · ${imageProvider === "unsplash" ? "Unsplash" : "내부 풀"}` : ""}
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {imageResults.map((item) => {
                          const active = selected.image === item.url
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setSelected({ ...selected, image: item.url })}
                              className={`overflow-hidden rounded-xl border text-left transition hover:border-[#00B140] ${
                                active ? "border-[#00B140] ring-2 ring-[#00B140]/30" : ""
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.thumb} alt="" className="aspect-video w-full object-cover" />
                              {item.photographer && (
                                <p className="truncate px-2 py-1 text-[10px] text-muted-foreground">
                                  {item.photographer}
                                </p>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {!isNew && (
                  <p className="text-xs text-muted-foreground">
                    slug: <code>{selected.slug}</code>
                  </p>
                )}

                <div>
                  <p className="mb-1.5 text-xs font-bold text-muted-foreground">본문 (Markdown)</p>
                  <textarea
                    className="min-h-[320px] w-full rounded-xl border p-3 font-mono text-xs leading-relaxed"
                    value={selected.content}
                    onChange={(e) => setSelected({ ...selected, content: e.target.value })}
                    spellCheck={false}
                  />
                </div>

                <div className="rounded-xl border border-[#00B140]/20 bg-[#00B140]/5 p-3">
                  <p className="text-xs font-bold text-[#00B140]">본문 AI 수정 (대화형)</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    예: 「ACTION을 더 실무적으로」「번역체 문장 다듬어줘」「FAQ 2개 추가」
                  </p>
                  <div className="mt-3 max-h-40 space-y-2 overflow-auto rounded-xl bg-white/80 p-3">
                    {aiChat.length === 0 && (
                      <p className="text-xs text-muted-foreground">아직 대화가 없습니다. 요청을 입력해 보세요.</p>
                    )}
                    {aiChat.map((msg, index) => (
                      <div
                        key={`${msg.role}-${index}`}
                        className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                          msg.role === "user" ? "bg-[#00B140]/10 text-foreground" : "bg-muted/60 text-foreground"
                        }`}
                      >
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          {msg.role === "user" ? "요청" : "AI"}
                        </p>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ))}
                  </div>

                  {pendingAiContent && (
                    <div className="mt-3 space-y-3 rounded-xl border border-[#00B140]/30 bg-white p-3">
                      <div>
                        <p className="text-xs font-bold text-foreground">수정 요약</p>
                        <div className="mt-1.5 whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2 text-xs leading-relaxed text-foreground">
                          {pendingAiSummary || "변경 사항이 반영된 초안입니다. 아래에서 전체를 확인하세요."}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-foreground">전체 초안 (확인용)</p>
                          <p className="text-[10px] text-muted-foreground">
                            {pendingAiContent.length.toLocaleString()}자 · 아직 본문에 반영되지 않음
                          </p>
                        </div>
                        <textarea
                          readOnly
                          className="max-h-[420px] min-h-[220px] w-full resize-y rounded-xl border bg-muted/20 p-3 font-mono text-xs leading-relaxed"
                          value={pendingAiContent}
                          spellCheck={false}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={applyAiContent}
                          className="rounded-lg bg-[#00B140] px-3 py-1.5 text-xs font-bold text-white"
                        >
                          본문에 적용
                        </button>
                        <button
                          type="button"
                          onClick={discardAiContent}
                          className="rounded-lg border px-3 py-1.5 text-xs font-bold"
                        >
                          초안 버리기
                        </button>
                        <p className="text-[11px] text-muted-foreground">
                          추가 수정이 필요하면 아래에 이어서 요청하세요.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex gap-2">
                    <input
                      className="flex-1 rounded-xl border bg-white p-2.5 text-sm"
                      placeholder={
                        pendingAiContent
                          ? "추가 수정 요청 (이 초안을 기준으로 이어집니다)"
                          : "본문 수정 요청을 입력하세요"
                      }
                      value={aiInput}
                      disabled={aiBusy}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          void askAi()
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={aiBusy || !aiInput.trim()}
                      onClick={() => void askAi()}
                      className="rounded-xl bg-[#00B140] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {aiBusy ? "생성 중..." : pendingAiContent ? "추가 수정" : "요청"}
                    </button>
                  </div>
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
