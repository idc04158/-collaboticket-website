"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function InsightsNewsletter() {
  const [email, setEmail] = useState("")

  return (
    <section
      aria-labelledby="newsletter-title"
      className="mt-12 rounded-2xl border border-brand/20 bg-brand-light/40 p-6 sm:p-8"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-brand text-white">
          <Mail className="size-5" aria-hidden="true" />
        </div>
        <h2 id="newsletter-title" className="mt-4 text-xl font-bold">
          매주 일본 시장 데이터를 메일로 받아보세요
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          실무자가 바로 활용할 수 있는 시장 데이터, 플랫폼 변화, 광고 트렌드, 인플루언서 인사이트를 무료로
          제공합니다.
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={(event) => {
            event.preventDefault()
            window.location.href = `/contact?email=${encodeURIComponent(email)}&topic=newsletter`
          }}
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="업무용 이메일을 입력하세요"
            aria-label="이메일 주소"
            className="h-11 rounded-xl bg-white"
          />
          <Button type="submit" className="h-11 shrink-0 rounded-xl bg-brand px-6 font-semibold text-white hover:bg-brand-dark hover:text-white">
            구독하기
          </Button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          구독 신청 시{" "}
          <Link href="/contact" className="text-brand underline-offset-4 hover:underline">
            문의 페이지
          </Link>
          로 연결되어 담당자가 확인합니다.
        </p>
      </div>
    </section>
  )
}
