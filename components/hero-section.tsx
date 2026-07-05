"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  heroDescription,
  supportedPlatforms,
  supportedIndustries,
  trustSignals,
} from "@/lib/aeo-content"

const dashboardMetrics = [
  { label: "월간 매출 추이", value: "+24.3%", trend: "up" as const },
  { label: "리뷰 전환율", value: "3.8%", trend: "up" as const },
  { label: "SNS 도달", value: "128K", trend: "up" as const },
  { label: "운영 채널", value: "4개", trend: "neutral" as const },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--surface-dark)] py-20 text-white sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.06]" />
      <div className="pointer-events-none absolute -left-40 top-20 size-[28rem] rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-[32rem] rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold backdrop-blur sm:text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              <span className="text-white/90">일본 시장 진출 A to Z 실행 파트너</span>
            </p>

            <h1 className="max-w-2xl text-balance text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              한국 브랜드의 일본 시장 진출,
              <br />
              A부터 Z까지 실행합니다
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
              {heroDescription}
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <p className="text-sm font-bold text-white/90">지원 플랫폼</p>
                <ul className="mt-2 space-y-1.5">
                  {supportedPlatforms.map((platform) => (
                    <li key={platform} className="flex items-center gap-2 text-sm text-white/75">
                      <span className="text-brand" aria-hidden="true">✓</span>
                      {platform}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold text-white/90">지원 산업</p>
                <ul className="mt-2 space-y-1.5">
                  {supportedIndustries.map((industry) => (
                    <li key={industry} className="flex items-center gap-2 text-sm text-white/75">
                      <span className="text-brand" aria-hidden="true">✓</span>
                      {industry}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {trustSignals.map((signal) => (
                <li key={signal}>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                    {signal}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-brand h-12 rounded-xl px-8 text-base">
                <Link href="/contact">
                  무료 상담 신청
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/20 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/#services">서비스 살펴보기</Link>
              </Button>
            </div>
          </div>

          <aside className="animate-fade-up relative min-w-0" style={{ animationDelay: "0.15s" }} aria-label="운영 현황 요약">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold text-white/50">데이터 기반 운영 대시보드</p>
                  <p className="text-sm font-bold">월간 성과 분석</p>
                </div>
                <span className="rounded-full bg-brand/15 px-2.5 py-1 text-[10px] font-bold text-brand">
                  실시간
                </span>
              </div>

              <ul className="grid grid-cols-2 gap-3">
                {dashboardMetrics.map((metric) => (
                  <li
                    key={metric.label}
                    className="rounded-xl border border-white/8 bg-white/[0.04] p-4"
                  >
                    <p className="text-[11px] text-white/50">{metric.label}</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-white">{metric.value}</p>
                    {metric.trend === "up" && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-brand">
                        <TrendingUp className="size-3" />
                        전월 대비
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.04] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-white/60">채널별 매출 비중</p>
                  <BarChart3 className="size-4 text-brand" />
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-white/10" role="img" aria-label="Rakuten 38%, Qoo10 28%, Amazon 22%, SNS 12%">
                  <div className="h-full w-[38%] bg-brand" />
                  <div className="h-full w-[28%] bg-brand/60" />
                  <div className="h-full w-[22%] bg-brand/35" />
                  <div className="h-full w-[12%] bg-brand/20" />
                </div>
                <ul className="mt-2 flex justify-between text-[10px] text-white/40">
                  <li>Rakuten</li>
                  <li>Qoo10</li>
                  <li>Amazon</li>
                  <li>SNS</li>
                </ul>
              </div>

              <p className="mt-4 text-center text-[11px] text-white/35">
                * 월간 리포트 · 성과 분석 · AI 자동화 광고 운영 데이터 제공
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
