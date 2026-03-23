"use client"

import { useState } from "react"

import { ContactForm } from "@/components/contact-form"

type Props = {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: Props) {
  const [success, setSuccess] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
        {!success ? (
          <>
            <h2 className="mb-6 text-2xl font-bold">상담 신청</h2>
            <ContactForm
              onSuccess={() => setSuccess(true)}
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
            <p className="mt-2 text-sm text-gray-500">1영업일 이내에 연락드리겠습니다.</p>

            <button
              type="button"
              onClick={() => {
                setSuccess(false)
                onClose()
              }}
              className="mt-6 rounded-lg bg-[#00B140] px-6 py-3 text-white transition hover:bg-[#009C38]"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
