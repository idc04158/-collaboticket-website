"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { saveSelfDiagnosis } from "@/lib/self-diagnosis"

const step2Options = [
  { label: "매출", desc: "현재 채널에서 매출 상승이 정체된 상태" },
  { label: "인력 부족", desc: "실행할 담당 인력이나 운영 리소스가 부족한 상태" },
  { label: "SNS 마케팅", desc: "콘텐츠/광고/인플루언서 운영 방향이 불명확한 상태" },
  { label: "리뷰 부족", desc: "구매 전환에 필요한 리뷰/후기 신뢰가 부족한 상태" },
  { label: "운영 학습", desc: "일본 이커머스 운영 방식 자체를 학습해야 하는 상태" },
] as const

const quickSolutions: Record<(typeof step2Options)[number]["label"], string[]> = {
  매출: ["핵심 채널 1~2개에 예산을 재배치합니다.", "상위 SKU 상세페이지/리뷰/가격 정책을 먼저 점검합니다."],
  "인력 부족": ["반복 업무를 표준화해 운영 시간을 줄입니다.", "외주/대행 가능한 업무부터 분리합니다."],
  "SNS 마케팅": ["채널별 콘텐츠 포맷과 운영 목표를 분리합니다.", "월간 콘텐츠 캘린더부터 고정합니다."],
  "리뷰 부족": ["구매 인증 기반 리뷰 수집 프로세스를 설계합니다.", "오픈마켓/커뮤니티 리뷰 우선순위를 정합니다."],
  "운영 학습": ["입점-운영-리포트의 기본 흐름을 먼저 익힙니다.", "초기 4주 실행 체크리스트를 세팅합니다."],
}

export function TrustHighlightsSection() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [enteredJapan, setEnteredJapan] = useState<boolean | null>(null)
  const [concern, setConcern] = useState<(typeof step2Options)[number]["label"] | "">("")
  const [preStage, setPreStage] = useState<"준비 단계" | "검토 단계" | "">("")
  const [preInterest, setPreInterest] = useState<"마케팅" | "물류" | "오픈마켓 입점" | "컨설팅" | "">("")

  function reset() {
    setStep(1)
    setEnteredJapan(null)
    setConcern("")
    setPreStage("")
    setPreInterest("")
  }

  useEffect(() => {
    if (step === 3 && enteredJapan !== null && concern) {
      saveSelfDiagnosis({ enteredJapan, concern })
    }
  }, [step, enteredJapan, concern])

  useEffect(() => {
    if (step === 4 && enteredJapan === false && preStage && preInterest) {
      saveSelfDiagnosis({ enteredJapan, preStage, preInterest })
    }
  }, [step, enteredJapan, preStage, preInterest])

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label">Quick Diagnostic</p>
          <h2 className="type-section-title type-section-title--center mt-4">
            우리 브랜드에 맞는 다음 스텝을 정리해보세요
          </h2>
          <p className="type-lead type-lead--center mt-4 text-muted-foreground">
            3분 셀프 진단으로 상담 아젠다를 미리 준비할 수 있습니다.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border bg-card p-8 shadow-lg md:p-10">
          {step === 1 && (
            <div>
              <p className="text-lg font-bold">1. 현재 일본 진출 중이신가요?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                이미 운영 중인지, 준비 단계인지에 따라 제안되는 채널 전략과 실행 순서가 달라집니다.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  className="btn-brand"
                  onClick={() => {
                    setEnteredJapan(true)
                    setStep(2)
                  }}
                >
                  예
                </button>
                <button
                  type="button"
                  className="btn-brand-outline"
                  onClick={() => {
                    setEnteredJapan(false)
                    setStep(4)
                  }}
                >
                  아니오
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-lg font-bold">2. 현재 가장 큰 고민은 무엇인가요?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                가장 시급한 한 가지를 선택해 주세요.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {step2Options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setConcern(opt.label)
                      setStep(3)
                    }}
                    className="rounded-xl border bg-background px-4 py-3 text-left text-sm transition hover:border-brand hover:bg-brand-light"
                  >
                    <p className="font-semibold">{opt.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
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
                일본 진출: <span className="font-semibold text-foreground">{enteredJapan ? "진행 중" : "준비/검토"}</span>
                {" · "}
                고민: <span className="font-semibold text-foreground">{concern}</span>
              </p>
              {concern && (
                <div className="mt-6 rounded-xl border bg-background p-5 text-left">
                  <p className="text-sm font-bold">추천 실행안</p>
                  <ul className="mt-3 space-y-2">
                    {quickSolutions[concern].map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href="/contact" className="btn-brand mt-8 inline-flex">
                상담 예약하기
              </Link>
              <div className="mt-4">
                <button type="button" className="text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={reset}>
                  다시 선택하기
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-lg font-bold">2. 현재 단계와 관심 영역을 선택해 주세요.</p>
              <div className="mt-6 rounded-xl border bg-background p-4">
                <p className="text-sm font-semibold">현재 단계</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(["준비 단계", "검토 단계"] as const).map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setPreStage(stage)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        preStage === stage ? "border-brand bg-brand-light" : "hover:border-brand"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border bg-background p-4">
                <p className="text-sm font-semibold">지금 가장 궁금한 것</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(["마케팅", "물류", "오픈마켓 입점", "컨설팅"] as const).map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => setPreInterest(interest)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        preInterest === interest ? "border-brand bg-brand-light" : "hover:border-brand"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {preStage && preInterest && (
                <div className="mt-6 rounded-xl border bg-background p-5 text-left">
                  <p className="text-sm font-bold">추천 제안</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                      {preStage === "준비 단계" ? "초기 진입 체크리스트를 먼저 구성합니다." : "실행 가능성/리스크를 빠르게 검토합니다."}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                      {preInterest === "오픈마켓 입점"
                        ? "Rakuten/Qoo10/Amazon Japan 입점 우선순위와 준비 자료를 정리합니다."
                        : preInterest === "컨설팅"
                          ? "일본 진출 전략 컨설팅으로 4주 실행 로드맵을 제안합니다."
                          : preInterest === "물류"
                            ? "판매 구조에 맞는 물류/통관 방식과 비용 구조를 비교 제안합니다."
                            : "마케팅 채널별 테스트 플랜과 초기 운영안을 제안합니다."}
                    </li>
                  </ul>
                  <Link href="/contact" className="btn-brand mt-5 inline-flex">
                    상담 예약하기
                  </Link>
                </div>
              )}

              <button type="button" className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={() => setStep(1)}>
                이전 단계
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
