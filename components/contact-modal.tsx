"use client"

import { useState } from "react"

import { ContactForm, type ContactSubmitResult } from "@/components/contact-form"

type Props = {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: Props) {
  const [success, setSuccess] = useState<ContactSubmitResult | null>(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {!success ? (
          <>
            <h2 className="mb-6 text-2xl font-bold">상담 신청</h2>
            <ContactForm
              onSuccess={(result) => setSuccess(result)}
              submitLabel="상담 신청하기"
            />
            <button
              type="button"
              onClick={onClose}
              className="mt-4 text-sm text-gray-500 transition hover:text-foreground"
            >
              닫기
            </button>
          </>
        ) : (
          <div className="py-10 text-center">
            <div className="mb-4 text-3xl">✅</div>
            <h3 className="text-xl font-semibold">신청이 접수되었습니다.</h3>
            <p className="mt-2 text-sm text-gray-500">
              아래에서 편한 상담 시간을 바로 예약하거나 카카오톡으로 가볍게 문의하실 수 있습니다.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border">
              <iframe
                src={success.calendarUrl}
                title="CollaboTicket 상담 시간 예약"
                className="h-[520px] w-full"
              />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={success.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#00B140] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#009C38]"
              >
                예약폼 새 창으로 열기
              </a>
              <a
                href={success.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#FEE500] px-6 py-3 text-sm font-bold text-[#191919] transition hover:bg-[#f4dc00]"
              >
                카카오톡 상담하기
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccess(null)
                onClose()
              }}
              className="mt-4 block w-full text-sm text-gray-500 transition hover:text-foreground"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
