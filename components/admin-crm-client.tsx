"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { ActivityEntry } from "@/lib/crm-activity"
import type { CrmSettings, EmailTemplate, EmailTemplateCategory } from "@/lib/crm-settings"
import type { CrmTodo, ImportCustomerRow, Inquiry } from "@/lib/inquiries"

type InquiriesOk = { ok: true; inquiries: Inquiry[] }
type GenericOk = { ok: true; message?: string }
type Err = { ok: false; message: string }
type ApiResponse = InquiriesOk | GenericOk | Err

const templateCategoryLabels: Record<EmailTemplateCategory, string> = {
  "first-contact": "First contact",
  "follow-up": "Follow-up",
  proposal: "Proposal",
  reminder: "Reminder",
}

export function AdminCrmClient() {
  const [authChecked, setAuthChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState("")
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [settings, setSettings] = useState<CrmSettings | null>(null)
  const [selectedId, setSelectedId] = useState("")
  const [activeView, setActiveView] = useState<"customers" | "todos" | "settings" | "activity">("customers")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mailSubject, setMailSubject] = useState("일본 판매 운영 상담 관련 안내드립니다")
  const [mailSummary, setMailSummary] = useState("상담 접수 확인 및 다음 단계 안내")
  const [mailMessage, setMailMessage] = useState(
    "문의 주신 내용을 확인했습니다. 현재 상황을 기준으로 일본 판매 운영 우선순위를 정리해드리겠습니다.",
  )
  const [emailSavedFlash, setEmailSavedFlash] = useState(false)
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([])
  const [tplName, setTplName] = useState("")
  const [tplCategory, setTplCategory] = useState<EmailTemplateCategory>("first-contact")
  const [tplSubject, setTplSubject] = useState("")
  const [tplBody, setTplBody] = useState("")
  const [editingTplId, setEditingTplId] = useState<string | undefined>(undefined)

  const selectedInquiry = inquiries.find((inquiry) => inquiry.id === selectedId) || inquiries[0]

  const todos = useMemo(() => {
    return inquiries
      .flatMap((inquiry) =>
        inquiry.todos.map((todo) => ({
          ...todo,
          inquiryId: inquiry.id,
          company: inquiry.company,
          name: inquiry.name,
        })),
      )
      .filter((todo) => !todo.done)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [inquiries])

  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      high: inquiries.filter((inquiry) => inquiry.priority === "high").length,
      openTodos: todos.length,
      overdue: todos.filter((todo) => todo.dueDate < new Date().toISOString().slice(0, 10)).length,
    }
  }, [inquiries, todos])

  const signature = settings?.emailSignature?.trim() || ""

  const mailBodyForExternal = useMemo(() => {
    if (!signature) return mailMessage
    return `${mailMessage.replace(/\s+$/, "")}\n\n--\n${signature}`
  }, [mailMessage, signature])

  const apiInquiries = useCallback(async (payload: Record<string, unknown>) => {
    const response = await fetch("/api/admin/inquiries", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    return { response, data: (await response.json()) as ApiResponse }
  }, [])

  const refreshInquiries = useCallback(async () => {
    const { response, data } = await apiInquiries({ action: "list" })
    if (!response.ok || !data.ok || !("inquiries" in data)) {
      setError(!data.ok ? data.message : "조회에 실패했습니다.")
      return
    }
    setInquiries(data.inquiries)
    setSelectedId((current) => current || data.inquiries[0]?.id || "")
    setError("")
  }, [apiInquiries])

  const refreshSettings = useCallback(async () => {
    const { response, data } = await apiInquiries({ action: "get-settings" })
    if (response.ok && data.ok && "settings" in data) {
      setSettings(data.settings)
    }
  }, [apiInquiries])

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/admin/auth", { credentials: "include" })
      const data = (await res.json()) as { ok: boolean }
      setLoggedIn(Boolean(data.ok))
      setAuthChecked(true)
      if (data.ok) {
        await refreshInquiries()
        await refreshSettings()
      }
    })()
  }, [refreshInquiries, refreshSettings])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    const data = (await res.json()) as { ok: boolean; message?: string }
    setLoading(false)
    if (!res.ok || !data.ok) {
      setError(data.message || "로그인에 실패했습니다.")
      return
    }
    setLoggedIn(true)
    setPassword("")
    await refreshInquiries()
    await refreshSettings()
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" })
    setLoggedIn(false)
    setInquiries([])
    setSettings(null)
  }

  async function requestCrm(payload: Record<string, unknown>) {
    setLoading(true)
    setError("")
    const { response, data } = await apiInquiries(payload)
    setLoading(false)
    if (!response.ok || !data.ok) {
      setError(data.ok ? "요청에 실패했습니다." : data.message)
      return data
    }
    if ("inquiries" in data) {
      setInquiries(data.inquiries)
      setSelectedId((current) => current || data.inquiries[0]?.id || "")
    }
    if ("settings" in data) setSettings(data.settings)
    return data
  }

  async function seedDemoData() {
    await requestCrm({ action: "seed" })
  }

  async function updateSelected(updates: Partial<Inquiry>) {
    if (!selectedInquiry) return
    await requestCrm({ action: "update", id: selectedInquiry.id, updates })
  }

  async function markTodoDone(todo: CrmTodo) {
    const inquiry = inquiries.find((item) => item.todos.some((entry) => entry.id === todo.id))
    if (!inquiry) return
    await requestCrm({
      action: "update",
      id: inquiry.id,
      updates: {
        todos: inquiry.todos.map((entry) => (entry.id === todo.id ? { ...entry, done: true } : entry)),
      },
    })
  }

  async function sendMailLog(channel: "manual" | "gmail" | "resend") {
    if (!selectedInquiry) return
    const result = await requestCrm({
      action: "send-email",
      id: selectedInquiry.id,
      subject: mailSubject,
      summary: mailSummary,
      message: mailMessage,
      channel,
    })
    if (result && "ok" in result && result.ok) {
      setEmailSavedFlash(true)
      window.setTimeout(() => setEmailSavedFlash(false), 4000)
    }
    return result
  }

  function gmailComposeUrl(inquiry: Inquiry) {
    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: inquiry.email,
      su: mailSubject,
      body: mailBodyForExternal,
    })
    return `https://mail.google.com/mail/?${params.toString()}`
  }

  async function openGmailAndLog() {
    if (!selectedInquiry) return
    await sendMailLog("gmail")
    window.open(gmailComposeUrl(selectedInquiry), "_blank", "noopener,noreferrer")
  }

  async function runAiDraft() {
    if (!selectedInquiry) return
    setLoading(true)
    setError("")
    const { response, data } = await apiInquiries({ action: "ai-email-draft", id: selectedInquiry.id })
    setLoading(false)
    if (!response.ok || !data.ok || !("draft" in data)) {
      setError(data.ok === false ? data.message : "AI 초안 생성에 실패했습니다.")
      return
    }
    const draft = data.draft as { subject: string; body: string }
    setMailSubject(draft.subject)
    setMailMessage(draft.body)
  }

  async function saveSignature(next: string) {
    await requestCrm({ action: "save-settings", emailSignature: next })
  }

  async function saveTemplate() {
    if (!tplName.trim() || !tplSubject.trim() || !tplBody.trim()) {
      setError("템플릿 이름, 제목, 본문을 입력해주세요.")
      return
    }
    await requestCrm({
      action: "save-template",
      id: editingTplId,
      name: tplName.trim(),
      category: tplCategory,
      subject: tplSubject.trim(),
      body: tplBody,
    })
    setTplName("")
    setTplSubject("")
    setTplBody("")
    setEditingTplId(undefined)
  }

  function loadTemplate(t: EmailTemplate) {
    setTplName(t.name)
    setTplCategory(t.category)
    setTplSubject(t.subject)
    setTplBody(t.body)
    setEditingTplId(t.id)
    setMailSubject(t.subject)
    setMailMessage(t.body)
  }

  async function deleteTemplate(id: string) {
    await requestCrm({ action: "delete-template", id })
  }

  async function loadActivity() {
    const { response, data } = await apiInquiries({ action: "activity-log" })
    if (response.ok && data.ok && "log" in data) {
      setActivityLog(data.log as ActivityEntry[])
    }
  }

  useEffect(() => {
    if (loggedIn && activeView === "activity") void loadActivity()
  }, [loggedIn, activeView])

  async function exportExcel() {
    const res = await fetch("/api/admin/export", { credentials: "include" })
    if (!res.ok) {
      setError("엑셀보내기에 실패했습니다.")
      return
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `collaboticket-crm-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImportCustomers(file: File | null) {
    if (!file) return
    setLoading(true)
    setError("")
    try {
      const XLSX = await import("xlsx")
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: "array" })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" })
      const rows: ImportCustomerRow[] = json.map((row) => {
        const lower = Object.fromEntries(Object.entries(row).map(([k, v]) => [String(k).toLowerCase().trim(), v]))
        const pick = (...keys: string[]) => {
          for (const k of keys) {
            const v = lower[k]
            if (v !== undefined && v !== null && String(v).trim()) return String(v).trim()
          }
          return ""
        }
        return {
          name: pick("name", "이름", "담당자"),
          company: pick("company", "회사", "회사명", "브랜드"),
          email: pick("email", "이메일", "mail"),
          phone: pick("phone", "연락처", "tel", "전화"),
          memo: pick("memo", "메모", "비고", "note"),
        }
      }).filter((r) => r.email && r.name)

      if (!rows.length) {
        setError("가져올 유효한 행이 없습니다. 이름·이메일 컬럼을 확인해주세요.")
        setLoading(false)
        return
      }

      const { response, data } = await apiInquiries({ action: "import-customers", rows })
      setLoading(false)
      if (!response.ok || !data.ok) {
        setError(!data.ok ? data.message : "가져오기 실패")
        return
      }
      await refreshInquiries()
    } catch {
      setLoading(false)
      setError("파일을 읽는 중 오류가 발생했습니다.")
    }
  }

  async function onBusinessCard(file: File | null, ocr: boolean) {
    if (!file || !selectedInquiry) return
    setLoading(true)
    setError("")
    const fd = new FormData()
    fd.set("file", file)
    fd.set("inquiryId", selectedInquiry.id)
    if (ocr) fd.set("ocr", "true")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" })
    const data = (await res.json()) as { ok: boolean; message?: string; ocr?: Record<string, string> }
    setLoading(false)
    if (!res.ok || !data.ok) {
      setError(data.message || "업로드 실패")
      return
    }
    await refreshInquiries()
    if (data.ocr) {
      const note = [`명함 OCR`, ...Object.entries(data.ocr).map(([k, v]) => `${k}: ${v}`)].join("\n")
      await requestCrm({
        action: "update",
        id: selectedInquiry.id,
        updates: { memo: [selectedInquiry.memo, note].filter(Boolean).join("\n\n") },
      })
    }
  }

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f3] text-sm text-muted-foreground">
        세션 확인 중…
      </main>
    )
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f7f8f3] px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-xl font-black">CollaboTicket CRM</h1>
          <p className="mt-2 text-sm text-muted-foreground">관리자 로그인 후 7일간 세션이 유지됩니다.</p>
          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="rounded-xl border p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#00B140]/30"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#00B140] py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {loading ? "확인 중…" : "로그인"}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f8f3] pb-24">
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#00B140]">CollaboTicket CRM</p>
            <h1 className="text-2xl font-black tracking-tight">문의 고객 관리자</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/insights" className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">
              인사이트 관리
            </Link>
            <button
              type="button"
              onClick={() => exportExcel()}
              className="rounded-xl border bg-white px-4 py-2 text-sm font-bold"
            >
              Export to Excel
            </button>
            <label className="cursor-pointer rounded-xl border bg-white px-4 py-2 text-sm font-bold">
              고객 가져오기 (CSV/XLSX)
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  void onImportCustomers(e.target.files?.[0] || null)
                  e.target.value = ""
                }}
              />
            </label>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {emailSavedFlash && (
          <div className="mb-4 rounded-xl border border-[#00B140]/30 bg-[#00B140]/10 px-4 py-2 text-sm font-semibold text-[#07150d]">
            발송 기록 저장됨
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="전체 고객" value={`${stats.total}`} />
          <StatCard label="우선 상담" value={`${stats.high}`} />
          <StatCard label="열린 TODO" value={`${stats.openTodos}`} />
          <StatCard label="기한 지남" value={`${stats.overdue}`} danger={stats.overdue > 0} />
        </section>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["customers", "todos", "settings", "activity"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setActiveView(v)}
              className={`rounded-full px-5 py-2 text-sm font-bold ${activeView === v ? "bg-[#07150d] text-white" : "bg-white"}`}
            >
              {v === "customers" ? "고객 관리" : v === "todos" ? "오늘 TODO" : v === "settings" ? "설정·템플릿" : "활동 로그"}
            </button>
          ))}
          <button
            type="button"
            onClick={seedDemoData}
            disabled={loading}
            className="rounded-full border bg-white px-5 py-2 text-sm font-bold disabled:opacity-50"
          >
            가상 데이터 넣기
          </button>
        </div>

        {activeView === "activity" && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">활동 로그</h2>
            <ul className="mt-4 max-h-[480px] space-y-2 overflow-y-auto text-sm">
              {activityLog.map((row) => (
                <li key={row.id} className="rounded-lg border p-3">
                  <span className="text-xs text-muted-foreground">{new Date(row.at).toLocaleString("ko-KR")}</span>
                  <p className="font-semibold">
                    {row.actor} · {row.action}
                  </p>
                  {row.detail && <p className="text-muted-foreground">{row.detail}</p>}
                </li>
              ))}
              {activityLog.length === 0 && <li className="text-muted-foreground">기록이 없습니다.</li>}
            </ul>
          </section>
        )}

        {activeView === "settings" && settings && (
          <section className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">이메일 서명</h2>
              <p className="mt-1 text-sm text-muted-foreground">발송 시 본문 하단에 자동으로 붙습니다. 줄바꿈이 그대로 반영됩니다.</p>
              <textarea
                className="mt-4 min-h-32 w-full rounded-xl border p-3 text-sm whitespace-pre-wrap"
                value={settings.emailSignature}
                onChange={(e) => setSettings({ ...settings, emailSignature: e.target.value })}
              />
              <button
                type="button"
                onClick={() => void saveSignature(settings.emailSignature)}
                className="mt-3 rounded-xl bg-[#00B140] px-4 py-2 text-sm font-bold text-white"
              >
                서명 저장
              </button>

              <h3 className="mt-8 font-black">미리보기 (발송 본문)</h3>
              <div className="mt-2 rounded-xl border bg-[#f7f8f3] p-4 text-sm whitespace-pre-wrap text-muted-foreground">
                {mailMessage}
                {signature ? `\n\n--\n${signature}` : ""}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">이메일 템플릿</h2>
              <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
                {settings.templates.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2 rounded-xl border p-3 text-sm">
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{templateCategoryLabels[t.category]}</p>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" className="rounded-lg bg-[#07150d] px-2 py-1 text-xs text-white" onClick={() => loadTemplate(t)}>
                        불러오기
                      </button>
                      <button type="button" className="rounded-lg border px-2 py-1 text-xs" onClick={() => void deleteTemplate(t.id)}>
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
                {settings.templates.length === 0 && <p className="text-sm text-muted-foreground">저장된 템플릿이 없습니다.</p>}
              </div>

              <div className="mt-6 grid gap-3 border-t pt-6">
                <input
                  className="rounded-xl border p-2 text-sm"
                  placeholder="템플릿 이름"
                  value={tplName}
                  onChange={(e) => setTplName(e.target.value)}
                />
                <select
                  className="rounded-xl border p-2 text-sm"
                  value={tplCategory}
                  onChange={(e) => setTplCategory(e.target.value as EmailTemplateCategory)}
                >
                  {(Object.keys(templateCategoryLabels) as EmailTemplateCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {templateCategoryLabels[c]}
                    </option>
                  ))}
                </select>
                <input
                  className="rounded-xl border p-2 text-sm"
                  placeholder="제목"
                  value={tplSubject}
                  onChange={(e) => setTplSubject(e.target.value)}
                />
                <textarea
                  className="min-h-28 rounded-xl border p-2 text-sm whitespace-pre-wrap"
                  placeholder="본문 (줄바꿈 유지)"
                  value={tplBody}
                  onChange={(e) => setTplBody(e.target.value)}
                />
                <button type="button" onClick={() => void saveTemplate()} className="rounded-xl bg-[#00B140] py-2 text-sm font-bold text-white">
                  템플릿 저장
                </button>
                {editingTplId && <p className="text-xs text-muted-foreground">편집 중 ID: {editingTplId}</p>}
              </div>
            </div>
          </section>
        )}

        {activeView === "todos" && (
          <section className="mt-6 grid gap-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#00B140]">
                    {todo.company} / {todo.name}
                  </p>
                  <h2 className="mt-1 text-lg font-bold">{todo.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    기한 {todo.dueDate} · {todo.type}
                  </p>
                  {todo.memo && <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{todo.memo}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => markTodoDone(todo)}
                  className="rounded-xl bg-[#00B140] px-4 py-2 text-sm font-bold text-white"
                >
                  완료
                </button>
              </div>
            ))}
            {todos.length === 0 && <EmptyState text="열린 TODO가 없습니다." />}
          </section>
        )}

        {activeView === "customers" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="grid gap-3">
              {inquiries.map((inquiry) => (
                <button
                  key={inquiry.id}
                  type="button"
                  onClick={() => setSelectedId(inquiry.id)}
                  className={`rounded-2xl p-5 text-left shadow-sm transition ${selectedInquiry?.id === inquiry.id ? "bg-[#07150d] text-white" : "bg-white hover:-translate-y-0.5"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#00B140]">
                        {inquiry.priority} · {inquiry.priorityManual ? "수동" : "자동"}
                      </p>
                      <h2 className="mt-2 text-lg font-black">{inquiry.company}</h2>
                      <p className={`mt-1 text-sm ${selectedInquiry?.id === inquiry.id ? "text-white/65" : "text-muted-foreground"}`}>
                        {inquiry.name} · {inquiry.category}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#00B140]/10 px-3 py-1 text-xs font-bold text-[#00B140]">{inquiry.status}</span>
                  </div>
                  <p className={`mt-3 line-clamp-2 text-sm ${selectedInquiry?.id === inquiry.id ? "text-white/70" : "text-muted-foreground"}`}>
                    다음: {inquiry.nextFollowUpSummary || "팔로업 미정"}
                  </p>
                </button>
              ))}
              {inquiries.length === 0 && <EmptyState text="문의 데이터가 없습니다." />}
            </div>

            {selectedInquiry && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#00B140]">
                      {new Date(selectedInquiry.createdAt).toLocaleString("ko-KR")}
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {selectedInquiry.company} / {selectedInquiry.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedInquiry.email} · {selectedInquiry.phone}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => updateSelected({ status: e.target.value as Inquiry["status"] })}
                      className="rounded-xl border p-2 text-sm"
                    >
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="qualified">qualified</option>
                      <option value="proposal">proposal</option>
                      <option value="won">won</option>
                      <option value="hold">hold</option>
                    </select>
                    <select
                      value={selectedInquiry.priority}
                      onChange={(e) => updateSelected({ priority: e.target.value as Inquiry["priority"], priorityManual: true })}
                      className="rounded-xl border p-2 text-sm"
                    >
                      <option value="high">high</option>
                      <option value="medium">medium</option>
                      <option value="low">low</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                  <CrmRow label="제품/카테고리" value={selectedInquiry.category} />
                  <CrmRow label="필요 서비스" value={selectedInquiry.services.join(", ")} />
                  <CrmRow label="현재 판매 상태" value={selectedInquiry.salesStatus} />
                  <CrmRow label="최근 월 매출 규모" value={selectedInquiry.monthlyRevenue || "-"} />
                  <CrmRow label="일본 운영 가능 예산" value={selectedInquiry.budget || "-"} />
                  <CrmRow label="희망 시작 시점" value={selectedInquiry.startTiming || "-"} />
                  <CrmRow label="판매 채널" value={selectedInquiry.channels || "-"} />
                  <CrmRow label="주요 목표" value={selectedInquiry.goal} />
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-bold">명함 이미지</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <label className="cursor-pointer rounded-xl border bg-[#f7f8f3] px-4 py-2 text-xs font-bold">
                      업로드
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => void onBusinessCard(e.target.files?.[0] || null, false)}
                      />
                    </label>
                    <label className="cursor-pointer rounded-xl border bg-[#f7f8f3] px-4 py-2 text-xs font-bold">
                      업로드 + OCR
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => void onBusinessCard(e.target.files?.[0] || null, true)}
                      />
                    </label>
                    {selectedInquiry.businessCardFile && (
                      <a
                        className="rounded-xl bg-[#07150d] px-4 py-2 text-xs font-bold text-white"
                        href={`/api/admin/upload?f=${encodeURIComponent(selectedInquiry.businessCardFile)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        명함 보기
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block rounded-2xl bg-[#f7f8f3] p-4">
                    <span className="text-sm font-bold">다음 메일/팔로업 날짜</span>
                    <input
                      type="date"
                      value={selectedInquiry.nextFollowUpAt || ""}
                      onChange={(e) => updateSelected({ nextFollowUpAt: e.target.value })}
                      className="mt-2 w-full rounded-xl border bg-white p-3 text-sm"
                    />
                  </label>
                  <label className="block rounded-2xl bg-[#f7f8f3] p-4">
                    <span className="text-sm font-bold">다음에 보낼 내용</span>
                    <input
                      value={selectedInquiry.nextFollowUpSummary || ""}
                      onChange={(e) => updateSelected({ nextFollowUpSummary: e.target.value })}
                      className="mt-2 w-full rounded-xl border bg-white p-3 text-sm"
                    />
                  </label>
                </div>

                <div className="mt-5 rounded-2xl border p-5">
                  <h3 className="text-lg font-black">메일 발송</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Resend는 실제 발송 시 서명이 자동 첨부됩니다. Gmail은 작성창을 연 뒤에도 동일 본문이 열립니다. 모든 발송은 CRM에 자동
                    저장됩니다.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => runAiDraft()}
                      disabled={loading}
                      className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                    >
                      AI 메일 초안
                    </button>
                  </div>
                  <input
                    value={mailSubject}
                    onChange={(e) => setMailSubject(e.target.value)}
                    className="mt-4 w-full rounded-xl border p-3 text-sm"
                    placeholder="제목"
                  />
                  <input
                    value={mailSummary}
                    onChange={(e) => setMailSummary(e.target.value)}
                    className="mt-3 w-full rounded-xl border p-3 text-sm"
                    placeholder="요약 (이력용)"
                  />
                  <textarea
                    value={mailMessage}
                    onChange={(e) => setMailMessage(e.target.value)}
                    className="mt-3 min-h-36 w-full rounded-xl border p-3 text-sm whitespace-pre-wrap"
                    placeholder="본문 — 줄바꿈·문단 간격이 그대로 저장됩니다."
                  />
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => void openGmailAndLog()}
                      className="rounded-xl bg-[#07150d] px-4 py-3 text-center text-sm font-bold text-white"
                    >
                      Gmail 작성 + 기록 저장
                    </button>
                    <button
                      type="button"
                      onClick={() => void sendMailLog("resend")}
                      className="rounded-xl bg-[#00B140] px-4 py-3 text-sm font-bold text-white"
                    >
                      Resend로 발송 + 기록
                    </button>
                    <button
                      type="button"
                      onClick={() => void sendMailLog("manual")}
                      className="rounded-xl border px-4 py-3 text-sm font-bold"
                    >
                      수동 발송 기록만
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    마지막 발송: {selectedInquiry.lastEmailAt ? new Date(selectedInquiry.lastEmailAt).toLocaleString("ko-KR") : "없음"}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#f7f8f3] p-5">
                    <h3 className="font-black">내 TODO</h3>
                    <div className="mt-3 grid gap-2">
                      {selectedInquiry.todos
                        .filter((todo) => !todo.done)
                        .map((todo) => (
                          <div key={todo.id} className="rounded-xl bg-white p-3 text-sm">
                            <p className="font-bold">{todo.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {todo.dueDate} · {todo.type}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#f7f8f3] p-5">
                    <h3 className="font-black">메일 이력</h3>
                    <div className="mt-3 grid gap-2">
                      {selectedInquiry.emailLogs.map((log) => (
                        <details key={log.id} className="rounded-xl bg-white p-3 text-sm">
                          <summary className="cursor-pointer font-bold">{log.subject}</summary>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(log.sentAt).toLocaleString("ko-KR")} · {log.channel}
                          </p>
                          <p className="mt-2 text-muted-foreground">{log.summary}</p>
                          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded border bg-muted/30 p-2 text-xs">{log.body}</pre>
                        </details>
                      ))}
                      {selectedInquiry.emailLogs.length === 0 && <p className="text-sm text-muted-foreground">메일 이력이 없습니다.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

function StatCard({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-black ${danger ? "text-red-600" : "text-[#07150d]"}`}>{value}</p>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl bg-white p-10 text-center text-sm text-muted-foreground shadow-sm">{text}</div>
}

function CrmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium whitespace-pre-wrap">{value}</p>
    </div>
  )
}
