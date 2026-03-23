"use client"

import { useState } from "react"

type Props = {
  onSuccess?: () => void
  submitLabel?: string
}

export function ContactForm({ onSuccess, submitLabel = "상담 신청하기" }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (formData.get("website")) return

    if (!formData.get("consent")) {
      alert("개인정보 수집 및 이용에 동의해주세요.")
      return
    }

    const services = formData.getAll("services").join(", ")

    setLoading(true)

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbypM1I5j3VyXrRr5SlBQ6DxAW8yUXL_D_Och3vMirFpZ4hdVyQDb6Q9oBWvNCI06bKTMQ/exec",
        {
          method: "POST",
          body: JSON.stringify({
            secret: "collaboticket_secure_2024",
            source: "homepage",
            name: formData.get("name"),
            company: formData.get("company"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            message: `문의 유형: ${services}\n\n추가 내용:\n${formData.get("detail")}`,
            consent: true,
          }),
        }
      )
      onSuccess?.()
    } catch {
      alert("전송 중 오류가 발생했습니다.")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" name="website" className="hidden" aria-hidden="true" />

      <input
        name="name"
        required
        placeholder="이름"
        className="rounded-lg border border-input bg-background p-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-[#00B140]/30"
      />
      <input
        name="company"
        required
        placeholder="회사명"
        className="rounded-lg border border-input bg-background p-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-[#00B140]/30"
      />
      <input
        name="email"
        required
        type="email"
        placeholder="이메일"
        className="rounded-lg border border-input bg-background p-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-[#00B140]/30"
      />
      <input
        name="phone"
        required
        placeholder="연락처"
        className="rounded-lg border border-input bg-background p-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-[#00B140]/30"
      />

      <div className="rounded-lg border border-border p-4">
        <p className="mb-2 font-medium">문의 유형 (복수 선택 가능)</p>

        <label className="block text-sm">
          <input type="checkbox" name="services" value="Rakuten/Qoo10/Amazon 운영대행" className="mr-2" />
          Rakuten / Qoo10 / Amazon 운영대행
        </label>

        <label className="block text-sm">
          <input type="checkbox" name="services" value="SNS 운영대행" className="mr-2" />
          SNS 운영대행
        </label>

        <label className="block text-sm">
          <input type="checkbox" name="services" value="인플루언서 마케팅" className="mr-2" />
          인플루언서 마케팅
        </label>

        <label className="block text-sm">
          <input type="checkbox" name="services" value="체험단 운영" className="mr-2" />
          체험단 운영
        </label>
      </div>

      <textarea
        name="detail"
        placeholder="추가 문의 내용을 입력해주세요."
        className="min-h-28 rounded-lg border border-input bg-background p-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-[#00B140]/30"
      />

      <label className="text-sm leading-relaxed">
        <input type="checkbox" name="consent" className="mr-2" />
        개인정보 수집 및 이용에 동의합니다.{" "}
        <a
          href="https://docs.google.com/document/d/1m-BzQlt-8e2Uo3htd9P7KiDeuX1w61o2-y2jVOfND2I/view"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00B140] underline"
        >
          (내용 보기)
        </a>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#00B140] py-3 font-medium text-white transition hover:bg-[#009C38] disabled:opacity-60"
      >
        {loading ? "전송 중..." : submitLabel}
      </button>
    </form>
  )
}
