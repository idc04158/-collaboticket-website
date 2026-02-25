"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <h1 className="text-balance font-sans text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              데이터로 설계하는
              <br />
              일본 시장 진출 전략
            </h1>

            <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              콜라보티켓은 한국 브랜드의 일본 진출을 전략적으로 설계하는 글로벌 마케팅 파트너입니다.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={onOpen}
                className="
                  rounded-lg
                  px-8
                  font-medium
                  bg-[#00B140]
                  text-white
                  hover:bg-[#009C38]
                  transition-all
                  duration-300
                  ease-out
                  hover:scale-[1.03]
                  shadow-md
                  hover:shadow-lg
                "
              >
                상담 신청
                <ArrowRight className="ml-2 size-4" />
              </Button>

              <Link href="/insights">
                <Button
                  variant="outline"
                  size="lg"
                  className="
                    rounded-lg
                    px-8
                    font-medium
                    border-gray-300
                    hover:bg-gray-100
                    transition
                  "
                >
                  인사이트 보기
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Grid */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="relative aspect-square w-full max-w-lg ml-auto">

              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2">
                {Array.from({ length: 36 }).map((_, i) => {
                  const opacity = [0.04, 0.07, 0.1, 0.15, 0.2, 0.06, 0.12][i % 7]
                  const scale = [1, 0.85, 0.7, 0.95, 0.75, 1, 0.9][i % 7]
                  const isGreen = i % 9 === 0 || i % 13 === 0

                  return (
                    <div
                      key={i}
                      className={`rounded-lg transition-all duration-700 ${
                        isGreen ? "bg-[#00B140]/20" : "bg-foreground"
                      }`}
                      style={{
                        opacity,
                        transform: `scale(${scale})`,
                      }}
                    />
                  )
                })}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-48 rounded-full border border-[#00B140]/40" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-32 rounded-full border border-border" />
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
    </section>
  )
}