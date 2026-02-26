"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

type ServiceKey = "experience" | "influencer" | "sns" | "infra"

export function HeroSection({ onOpen }: { onOpen: () => void }) {
  const [active, setActive] = useState<ServiceKey>("experience")

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="grid items-start gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              일본 진출,
              성공하는 구조는 데이터로 설계됩니다.
            </h1>

            <p className="text-muted-foreground max-w-xl">
              체험단, 인플루언서, SNS 운영, 법인 설립.
              어떤 고민으로 들어오셨든 결국 필요한 건
              전체 실행 구조입니다.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "experience", label: "체험단" },
                { key: "influencer", label: "인플루언서" },
                { key: "sns", label: "SNS 운영" },
                { key: "infra", label: "법인 · 물류" },
              ].map((item) => (
                <motion.button
                  key={item.key}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setActive(item.key as ServiceKey)}
                  className={`rounded-xl border p-4 font-semibold transition
                    ${active === item.key
                      ? "border-[#00B140] bg-[#00B140]/5"
                      : "hover:shadow-md"}
                  `}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="rounded-2xl border bg-card p-6 min-h-[420px]">

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >

                {/* 체험단 */}
                {active === "experience" && (
                  <>
                    <h3 className="text-lg font-semibold">
                      7,000명의 리뷰어가 우리 제품을 기다립니다
                    </h3>

                    <div className="text-sm text-muted-foreground">
                      ✔ 체험단 진행 후 매출 28% 증가 사례  
                      ✔ 평균 평점 4.6 유지  
                      ✔ 일본형 상세 리포트 제공
                    </div>

                    <div className="rounded-xl overflow-hidden border">
                      <Image
                        src="/images/sample-report.png"
                        alt="체험단 리포트 샘플"
                        width={800}
                        height={500}
                        className="w-full h-auto"
                      />
                    </div>

                    <Button
                      onClick={onOpen}
                      className="bg-[#00B140] text-white"
                    >
                      체험단 진행 문의하기
                    </Button>
                  </>
                )}

                {/* 인플루언서 */}
                {active === "influencer" && (
                  <>
                    <h3 className="text-lg font-semibold">
                      노출 120만회 · 메가와리 매출 43% 증가
                    </h3>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        "/images/reel-1.jpg",
                        "/images/reel-2.jpg",
                        "/images/reel-3.jpg",
                      ].map((src, i) => (
                        <div key={i} className="aspect-[9/16] relative rounded-md overflow-hidden">
                          <Image
                            src={src}
                            alt={`릴스 예시 ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      ✔ 2차 활용까지 한 번에 협의  
                      ✔ 전환 구조 기반 캠페인 설계
                    </div>

                    <Button
                      onClick={onOpen}
                      className="bg-[#00B140] text-white"
                    >
                      우리 브랜드에 맞는 인플루언서 찾기
                    </Button>
                  </>
                )}

                {/* SNS */}
                {active === "sns" && (
                  <>
                    <h3 className="text-lg font-semibold">
                      공식 SNS 운영이 필요한 이유
                    </h3>

                    <div className="rounded-xl overflow-hidden border">
                      <Image
                        src="/images/sns-growth-graph.png"
                        alt="SNS 성장 그래프"
                        width={800}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      ✔ 월간 도달 180K  
                      ✔ 검색 노출 강화  
                      ✔ 브랜드 신뢰도 상승
                    </div>

                    <Button
                      onClick={onOpen}
                      className="bg-[#00B140] text-white"
                    >
                      SNS 운영대행 상담하기
                    </Button>
                  </>
                )}

                {/* 법인 */}
                {active === "infra" && (
                  <>
                    <h3 className="text-lg font-semibold">
                      법인 설립 후 일본 이커머스 판매 정상화 사례
                    </h3>

                    <div className="rounded-xl overflow-hidden border">
                      <Image
                        src="/images/corporate-case.png"
                        alt="일본 법인 설립 케이스"
                        width={800}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      ✔ 일본 법인 설립  
                      ✔ 세무 체계 구축  
                      ✔ 물류 연결로 배송 리드타임 단축  
                      ✔ 라쿠텐·아마존 판매 원활화
                    </div>

                    <Button
                      onClick={onOpen}
                      className="bg-[#00B140] text-white"
                    >
                      법인·물류 최적화 상담하기
                    </Button>
                  </>
                )}

              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  )
}