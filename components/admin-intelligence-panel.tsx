"use client"

import { useEffect, useState } from "react"

import type { IntelligenceEvent } from "@/lib/intelligence-events"

type Props = {
  inquiryId: string
}

export function AdminIntelligencePanel({ inquiryId }: Props) {
  const [events, setEvents] = useState<IntelligenceEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/intelligence?inquiryId=${encodeURIComponent(inquiryId)}`, {
          credentials: "include",
        })
        const data = (await response.json()) as { ok: boolean; events?: IntelligenceEvent[] }
        if (!cancelled && data.ok && data.events) {
          setEvents(data.events)
        }
      } catch {
        if (!cancelled) setEvents([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [inquiryId])

  return (
    <div className="mt-6 rounded-2xl border bg-[#f7f8f3] p-4">
      <p className="text-sm font-bold">방문·행동 로그</p>
      <p className="mt-1 text-xs text-muted-foreground">
        상담 신청 이후 추천 글 클릭, 읽기, 카카오 클릭 등이 여기에 기록됩니다.
      </p>
      {loading ? (
        <p className="mt-3 text-sm text-muted-foreground">불러오는 중…</p>
      ) : (
        <ul className="mt-3 max-h-56 space-y-2 overflow-y-auto text-xs">
          {events.map((event) => (
            <li key={`${event.at}-${event.event}-${event.slug || ""}`} className="rounded-lg bg-white px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#00B140]">{event.event}</span>
                {event.funnel && <span className="text-muted-foreground">· {event.funnel}</span>}
                <span className="text-muted-foreground">{new Date(event.at).toLocaleString("ko-KR")}</span>
              </div>
              {(event.slug || event.path) && (
                <p className="mt-1 text-muted-foreground">
                  {event.title || event.slug || event.path}
                </p>
              )}
            </li>
          ))}
          {events.length === 0 && <li className="text-muted-foreground">아직 기록된 행동이 없습니다.</li>}
        </ul>
      )}
    </div>
  )
}
