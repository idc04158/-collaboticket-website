"use client"

import { useState } from "react"
import Link from "next/link"

import { ContactForm } from "@/components/contact-form"

export function ContactPageContent() {
  const [success, setSuccess] = useState(false)

  if (success) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
        <div className="mb-4 text-4xl">✅</div>
        <h2 className="text-2xl font-semibold">신청이 접수되었습니다.</h2>
        <p className="mt-2 text-muted-foreground">1영업일 이내에 연락드리겠습니다.</p>
        <Link
          href="/"
          className="mt-8 inline-flex text-sm font-medium text-[#00B140] underline-offset-4 hover:underline"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return <ContactForm onSuccess={() => setSuccess(true)} submitLabel="상담 신청하기" />
}
