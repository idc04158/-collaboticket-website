"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const step2Options = ["매출", "인력 부족", "SNS 마케팅", "리뷰 부족", "운영 학습"] as const

export function TrustHighlightsSection() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [enteredJapan, setEnteredJapan] = useState<boolean | null>(null)
  const [concern, setConcern] = useState<(typeof step2Options)[number] | "">("")

  function reset() {
    setStep(1)
    setEnteredJapan(null)
    setConcern("")
  }

  return (
    <section className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-[#00B140]">Quick diagnostic</p>
        <h2 className="mt-3 text-balance text-center text-3xl font-bold tracking-tight md:text-4xl">
          지금 상황에 맞는 다음 스텝을 정리해보세요
        </h2>
        <p className="mt-4 text-center text-pretty text-muted-foreground">
          몇 가지 선택만으로도 상담 시 우선순위를 빠르게 맞출 수 있습니다.
        </p>

        <div className="mt-10 rounded-[2rem] border bg-background p-8 shadow-lg md:p-10">
          {step === 1 && (
            <div>
              <p className="text-lg font-semibold">1. 현재 일본 진출 중이신가요?</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  type="button"
                  size="lg"
                  className="rounded-xl bg-[#00B140] text-white"
                  onClick={() => {
                    setEnteredJapan(true)
                    setStep(2)
                  }}
                >
                  예
                </Button>
                <Button type="button" size="lg" variant="outline" className="rounded-xl" onClick={() => {
                  setEnteredJapan(false)
                  setStep(2)
                }}>
                  아니오
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-lg font-semibold">2. 현재 가장 큰 고민은 무엇인가요?</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {step2Options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setConcern(opt)
                      setStep(3)
                    }}
                    className="rounded-xl border bg-card px-4 py-3 text-left text-sm font-semibold transition hover:border-[#00B140] hover:bg-[#00B140]/5"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button type="button" className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={() => setStep(1)}>
                이전 단계
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                일본 진출 여부: <span className="font-semibold text-foreground">{enteredJapan ? "진행 중" : "준비/검토 단계"}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                주요 고민: <span className="font-semibold text-foreground">{concern}</span>
              </p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                선택하신 내용을 바탕으로 채널·운영 우선순위를 함께 짚어보겠습니다. 아래에서 30분 무료 상담을 예약해 주세요.
              </p>
              <Button asChild className="mt-8 rounded-xl bg-[#00B140] px-8 text-white">
                <Link href="/contact">상담 예약하기</Link>
              </Button>
              <div className="mt-4">
                <button type="button" className="text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={reset}>
                  다시 선택하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
