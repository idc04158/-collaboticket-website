"use client"

import Link from "next/link"
import { CheckCircle2, Hash, ShoppingBag, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"

const scopeItems = ["SNS 마케팅", "오픈마켓 운영 대행", "리뷰 체험단"]

const serviceCardItems = [
  { icon: Hash, title: "SNS 마케팅" },
  { icon: ShoppingBag, title: "오픈마켓 운영" },
  { icon: Star, title: "리뷰 체험단" },
  { icon: Truck, title: "물류" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#07150d] py-20 text-white sm:py-24 lg:py-36">
      <div className="pointer-events-none absolute left-[-10rem] top-[-10rem] size-[30rem] rounded-full bg-[#00B140]/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-14rem] right-[-10rem] size-[38rem] rounded-full bg-[#cfff4d]/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00B140] to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-8">
        <div>
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#cfff4d] shadow-lg backdrop-blur sm:text-sm">
            <span>🇯🇵</span>
            <span className="truncate">Japan ecommerce execution</span>
          </div>
          <h1 className="max-w-3xl text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
            일본 이커머스 실행 전문팀
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/78 sm:text-lg md:text-xl">
            진단부터 운영·리포트까지, 일본 채널에서 매출이 나오도록 실행에 집중합니다.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-white/82 sm:grid-cols-1 md:max-w-xl">
            {scopeItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-3 backdrop-blur"
              >
                <CheckCircle2 className="size-4 shrink-0 text-[#cfff4d]" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="w-full rounded-2xl bg-[#00B140] px-9 text-white shadow-[0_18px_45px_rgba(0,177,64,0.35)] transition hover:bg-[#0fc451] sm:w-auto"
            >
              <Link href="/contact">일본 진출 상담 신청</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-2xl border-white/25 bg-white/10 px-9 text-white hover:bg-white hover:text-[#07150d] sm:w-auto"
            >
              <Link href="/contact">서비스 보기</Link>
            </Button>
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="rounded-[2rem] border border-white/12 bg-white/[0.08] p-4 shadow-2xl backdrop-blur sm:p-5 md:rounded-[2.5rem] md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-semibold text-[#cfff4d]">Service map</p>
                <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">한눈에 보는 서비스</h2>
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {serviceCardItems.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.09] px-4 py-4 sm:px-5"
                >
                  <div className="rounded-xl bg-[#00B140] p-2.5 text-white">
                    <item.icon className="size-5" />
                  </div>
                  <span className="font-semibold text-white">{item.title}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-center text-xs text-white/55">법인 설립 지원 가능</p>
          </div>
        </div>
      </div>
    </section>
  )
}
