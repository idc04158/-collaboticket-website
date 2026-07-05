"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { serviceComparisonRows } from "@/lib/aeo-content"

export function ServiceComparisonAccordion() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-16">
      <h3 className="text-center text-xl font-bold">서비스 비교표</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        일본 시장 진출 서비스별 지원 범위와 결과물을 비교합니다.
      </p>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="service-comparison-table-panel"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-brand/35 hover:bg-brand-light/40"
        >
          {open ? "▼ 서비스 비교표 접기" : "▶ 서비스 비교표 펼쳐보기"}
        </button>
      </div>

      <div
        id="service-comparison-table-panel"
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-8 overflow-x-auto rounded-2xl border bg-card shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-bold">
                    서비스
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    지원 내용
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    플랫폼
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    결과물
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceComparisonRows.map((row) => (
                  <tr key={row.service} className="border-b last:border-b-0">
                    <th scope="row" className="px-4 py-3 font-semibold text-foreground">
                      {row.service}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{row.support}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.platforms}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.deliverables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
