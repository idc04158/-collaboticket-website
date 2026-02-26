"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type Category = "뷰티" | "식품" | "라이프" | "패션"

export function InfluencerDataLabSection() {
  const [selected, setSelected] = useState<Category>("뷰티")
  const [loading, setLoading] = useState(false)

  const handleSelect = (cat: Category) => {
    setLoading(true)
    setSelected(cat)
    setTimeout(() => setLoading(false), 2000)
  }

  const dummyData = Array.from({ length: 8 }).map((_, i) => ({
    name: `tokyo_creator_${i + 1}`,
    followers: `${(5 + i) * 1.3}만`,
    engagement: `${(3 + i * 0.4).toFixed(1)}%`,
  }))

  return (
    <section className="bg-[#f8f9fa] py-32 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-20">
          <p className="text-sm font-semibold text-[#00B140] tracking-widest uppercase">
            Influencer Matching System
          </p>
          <h2 className="mt-4 text-4xl font-bold">
            하루 종일 찾던 인플루언서
            <br />
            <span className="text-[#00B140]">5초 만에 찾기</span>
          </h2>
          <p className="mt-6 text-muted-foreground">
            카테고리 선택 → 데이터 분석 → 상위 3명 무료 공개  
            선택 후 전체 데이터 확인
          </p>
        </div>

        {/* ================= CATEGORY ================= */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {(["뷰티", "식품", "라이프", "패션"] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelect(cat)}
              className={`px-6 py-2 rounded-full border font-medium transition
                ${
                  selected === cat
                    ? "bg-[#00B140] text-white border-[#00B140]"
                    : "bg-white hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="text-xl font-semibold mb-6">
              일본 인플루언서 데이터 분석 중...
            </div>
            <div className="w-20 h-20 border-4 border-[#00B140] border-t-transparent rounded-full animate-spin mx-auto" />
          </motion.div>
        ) : (
          <>
            {/* ================= LIST ================= */}
            <div className="space-y-14 max-h-[900px] overflow-hidden relative">

              {dummyData.map((item, i) => {
                const locked = i >= 3

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative rounded-3xl bg-white shadow-lg p-8 flex gap-10 items-center ${
                      locked ? "blur-sm opacity-60" : ""
                    }`}
                  >

                    {/* LEFT PROFILE */}
                    <div className="min-w-[260px]">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 relative">
                          <Image
                            src="/images/sample-profile.jpg"
                            alt="profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            팔로워 {item.followers}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            평균 참여율 {item.engagement}
                          </p>
                        </div>
                      </div>

                      {!locked && (
                        <Button
                          size="sm"
                          className="mt-6 bg-[#00B140] text-white"
                        >
                          협업 제안하기
                        </Button>
                      )}
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex gap-6 flex-1">
                      {[1, 2, 3, 4].map((num) => (
                        <div
                          key={num}
                          className="w-[160px] aspect-[9/16] relative rounded-xl overflow-hidden bg-gray-100 shadow-sm"
                        >
                          <Image
                            src="/images/sample-thumb.jpg"
                            alt="콘텐츠"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* LOCK OVERLAY */}
                    {locked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button className="bg-[#00B140] text-white px-8 py-4 text-lg rounded-xl shadow-xl">
                          전체 데이터 보기
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* FADE */}
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#f8f9fa] to-transparent" />
            </div>

            {/* ================= CTA ================= */}
            <div className="mt-28 text-center">
              <Button
                size="lg"
                className="bg-[#00B140] hover:bg-[#009C38] text-white px-14 py-6 text-lg rounded-2xl shadow-xl"
              >
                우리 브랜드 맞춤 인플루언서 리스트 받기
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                ✔ 리스트 확인 후 결제 진행  
                ✔ 인플루언서 선택 후 계약 진행
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}