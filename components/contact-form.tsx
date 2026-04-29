"use client"

import { useState } from "react"

type Props = {
  onSuccess?: (result: ContactSubmitResult) => void
  submitLabel?: string
}

export type ContactSubmitResult = {
  id?: string
  calendarUrl: string
  kakaoUrl: string
}

const fieldClass =
  "w-full rounded-lg border border-input bg-background p-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-[#00B140]/30"

const serviceOptions = [
  "오픈마켓 운영대행",
  "SNS 마케팅/계정 운영",
  "리뷰 체험단/커뮤니티 리뷰",
  "인플루언서 마케팅",
  "물류/정산/법인 설립",
  "일본 진출 전체 설계",
]

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-foreground">
      {children}
      {required && (
        <span className="rounded-full bg-[#00B140]/10 px-2 py-0.5 text-[10px] font-bold text-[#00B140]">
          필수
        </span>
      )}
    </span>
  )
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
    if (!services) {
      alert("필요한 서비스를 1개 이상 선택해주세요.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "homepage",
          website: formData.get("website"),
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          category: formData.get("category"),
          services: formData.getAll("services"),
          salesStatus: formData.get("salesStatus"),
          monthlyRevenue: formData.get("monthlyRevenue"),
          budget: formData.get("budget"),
          startTiming: formData.get("startTiming"),
          channels: formData.get("channels"),
          goal: formData.get("goal"),
          detail: formData.get("detail"),
          consent: true,
        }),
      })
      const result = (await response.json()) as { ok: boolean; id?: string; calendarUrl?: string; kakaoUrl?: string; message?: string }

      if (!response.ok || !result.ok || !result.calendarUrl || !result.kakaoUrl) {
        alert(result.message || "전송 중 오류가 발생했습니다.")
        return
      }

      onSuccess?.({ id: result.id, calendarUrl: result.calendarUrl, kakaoUrl: result.kakaoUrl })
    } catch {
      alert("전송 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" name="website" className="hidden" aria-hidden="true" />

      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <FieldLabel required>이름</FieldLabel>
          <input name="name" required placeholder="담당자 이름" className={fieldClass} />
        </label>
        <label>
          <FieldLabel required>회사명 / 브랜드명</FieldLabel>
          <input name="company" required placeholder="회사명 또는 브랜드명" className={fieldClass} />
        </label>
        <label>
          <FieldLabel required>이메일</FieldLabel>
          <input name="email" required type="email" placeholder="이메일" className={fieldClass} />
        </label>
        <label>
          <FieldLabel required>연락처</FieldLabel>
          <input name="phone" required placeholder="연락 가능한 번호" className={fieldClass} />
        </label>
      </div>

      <div className="rounded-2xl border border-[#00B140]/20 bg-[#00B140]/5 p-4">
        <p className="text-sm font-semibold text-[#00B140]">상담 전 확인사항</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          아래 정보가 구체적일수록 일본 진출 가능성과 우선순위를 빠르게 판단할 수 있습니다.
        </p>
      </div>

      <label>
        <FieldLabel required>제품/카테고리</FieldLabel>
        <input
          name="category"
          required
          placeholder="예: 스킨케어, 건강식품, 패션잡화"
          className={fieldClass}
        />
      </label>

      <div className="rounded-lg border border-border p-4">
        <FieldLabel required>필요한 서비스 (복수 선택 가능)</FieldLabel>
        <div className="grid gap-2 sm:grid-cols-2">
          {serviceOptions.map((service) => (
            <label key={service} className="flex items-start gap-2 text-sm leading-snug">
              <input type="checkbox" name="services" value={service} className="mt-0.5" />
              <span>{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <FieldLabel required>현재 판매 상태</FieldLabel>
          <select name="salesStatus" required className={fieldClass} defaultValue="">
            <option value="" disabled>선택해주세요</option>
            <option>아직 출시 전 / 준비 중</option>
            <option>국내 판매 중</option>
            <option>국내에서 매출 검증 완료</option>
            <option>일본 입점 준비 중</option>
            <option>일본 채널 운영 중</option>
          </select>
        </label>

        <label>
          <FieldLabel>최근 월 매출 규모</FieldLabel>
          <select name="monthlyRevenue" className={fieldClass} defaultValue="">
            <option value="" disabled>선택해주세요</option>
            <option>아직 매출 없음</option>
            <option>월 1,000만원 미만</option>
            <option>월 1,000만~5,000만원</option>
            <option>월 5,000만~1억원</option>
            <option>월 1억원 이상</option>
          </select>
        </label>

        <label>
          <FieldLabel>일본 운영 가능 예산</FieldLabel>
          <select name="budget" className={fieldClass} defaultValue="">
            <option value="" disabled>선택해주세요</option>
            <option>월 100만원 미만</option>
            <option>월 100만~300만원</option>
            <option>월 300만~700만원</option>
            <option>월 700만~1,500만원</option>
            <option>월 1,500만원 이상</option>
          </select>
        </label>

        <label>
          <FieldLabel>희망 시작 시점</FieldLabel>
          <select name="startTiming" className={fieldClass} defaultValue="">
            <option value="" disabled>선택해주세요</option>
            <option>즉시 시작 가능</option>
            <option>1개월 이내</option>
            <option>3개월 이내</option>
            <option>일정 미정 / 정보 수집 단계</option>
          </select>
        </label>
      </div>

      <label>
        <FieldLabel>현재/희망 판매 채널</FieldLabel>
        <select name="channels" className={fieldClass} defaultValue="">
          <option value="" disabled>선택해주세요</option>
          <option>자사몰</option>
          <option>라쿠텐</option>
          <option>Qoo10</option>
          <option>Amazon Japan</option>
          <option>오프라인/도매</option>
          <option>아직 없음 / 미정</option>
          <option>상담 필요</option>
        </select>
      </label>

      <label>
        <FieldLabel required>가장 중요한 목표</FieldLabel>
        <select name="goal" required className={fieldClass} defaultValue="">
          <option value="" disabled>선택해주세요</option>
          <option>일본 시장 진입 가능성 검토</option>
          <option>라쿠텐/Qoo10/Amazon 매출 확대</option>
          <option>SNS 인지도와 브랜드 신뢰 확보</option>
          <option>리뷰 체험단/커뮤니티 리뷰 확보</option>
          <option>물류·정산·법인 등 운영 기반 구축</option>
          <option>전체 일본 판매 구조 설계</option>
        </select>
      </label>

      <label>
        <FieldLabel>추가 문의 내용</FieldLabel>
        <textarea
          name="detail"
          placeholder="현재 고민, 목표 매출, 보유 자료, 참고 브랜드, 희망 일정 등을 자유롭게 적어주세요."
          className="min-h-28 rounded-lg border border-input bg-background p-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-[#00B140]/30"
        />
      </label>

      <label className="text-sm leading-relaxed">
        <input type="checkbox" name="consent" className="mr-2" />
        개인정보 수집 및 이용에 동의합니다. <span className="font-bold text-[#00B140]">(필수)</span>{" "}
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
