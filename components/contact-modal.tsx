"use client"

import { useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // 🔒 honeypot
    if (formData.get("website")) return

    if (!formData.get("consent")) {
      alert("개인정보 수집 및 이용에 동의해주세요.")
      return
    }

    // 체크된 서비스들 배열화
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

      setSuccess(true)
    } catch {
      alert("전송 중 오류가 발생했습니다.")
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]">

        {!success ? (
          <>
            <h2 className="text-2xl font-bold mb-6">상담 신청</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* honeypot */}
              <input type="text" name="website" className="hidden" />

              <input name="name" required placeholder="이름" className="border p-3 rounded-lg" />
              <input name="company" required placeholder="회사명" className="border p-3 rounded-lg" />
              <input name="email" required type="email" placeholder="이메일" className="border p-3 rounded-lg" />
              <input name="phone" required placeholder="연락처" className="border p-3 rounded-lg" />

              {/* 🔹 문의 유형 체크박스 */}
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-2">문의 유형 (복수 선택 가능)</p>

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

              {/* 🔹 추가 내용 */}
              <textarea
                name="detail"
                placeholder="추가 문의 내용을 입력해주세요."
                className="border p-3 rounded-lg"
              />

              {/* 🔹 개인정보 동의 + 링크 */}
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
                className="bg-[#00B140] hover:bg-[#009C38] text-white py-3 rounded-lg transition-all duration-300"
              >
                {loading ? "전송 중..." : "상담 신청하기"}
              </button>
            </form>

            <button
              onClick={onClose}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              닫기
            </button>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-semibold">신청이 접수되었습니다.</h3>
            <p className="text-sm text-gray-500 mt-2">
              1영업일 이내에 연락드리겠습니다.
            </p>

            <button
              onClick={() => {
                setSuccess(false)
                onClose()
              }}
              className="mt-6 bg-[#00B140] text-white px-6 py-3 rounded-lg"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}