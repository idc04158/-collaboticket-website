"use client"

import { useState } from "react"

import { ContactForm, type ContactSubmitResult } from "@/components/contact-form"
import { ContactPostSubmitInsights } from "@/components/contact-post-submit-insights"
import { getOrCreateVisitorId, sendServerTrackEvent } from "@/lib/visitor-tracking"

export function ContactPageContent() {
  const [success, setSuccess] = useState<ContactSubmitResult | null>(null)

  function handleSuccess(result: ContactSubmitResult) {
    setSuccess(result)
    if (result.id) {
      void sendServerTrackEvent({
        visitorId: getOrCreateVisitorId(),
        inquiryId: result.id,
        event: "contact_submit_success",
        funnel: "contact",
        path: "/contact",
        meta: {
          goal: result.profile?.goal,
          services: result.profile?.services,
          recommendedCount: result.recommendedArticles?.length || 0,
        },
      })
      if (result.recommendedArticles?.length) {
        void sendServerTrackEvent({
          visitorId: getOrCreateVisitorId(),
          inquiryId: result.id,
          event: "post_submit_recommendations_shown",
          funnel: "post_submit",
          path: "/contact",
          meta: { slugs: result.recommendedArticles.map((article) => article.slug) },
        })
      }
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-light text-2xl">✅</div>
        <h2 className="text-2xl font-bold">신청이 접수되었습니다</h2>
        <p className="mt-3 text-muted-foreground">
          아래 예약폼에서 편한 시간을 선택하시면 30분 무료 온라인 상담이 예약됩니다. 카카오톡으로도 상담을 시작하실 수 있습니다.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border bg-background">
          <iframe
            src={success.calendarUrl}
            title="CollaboTicket 상담 시간 예약"
            className="h-[620px] w-full"
          />
        </div>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={success.calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl bg-[#00B140] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#009C38]"
          >
            예약폼 새 창으로 열기
          </a>
          <a
            href={success.kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (!success.id) return
              void sendServerTrackEvent({
                visitorId: getOrCreateVisitorId(),
                inquiryId: success.id,
                event: "post_submit_kakao_click",
                funnel: "post_submit",
                path: "/contact",
              })
            }}
            className="inline-flex rounded-xl bg-[#FEE500] px-6 py-3 text-sm font-bold text-[#191919] transition hover:bg-[#f4dc00]"
          >
            카카오톡으로 상담하기
          </a>
        </div>

        {success.id && success.recommendedArticles && (
          <ContactPostSubmitInsights inquiryId={success.id} articles={success.recommendedArticles} />
        )}

        <a
          href="/"
          className="mt-5 block text-sm font-medium text-[#00B140] underline-offset-4 hover:underline"
        >
          홈으로 돌아가기
        </a>
      </div>
    )
  }

  return <ContactForm onSuccess={handleSuccess} submitLabel="상담 신청하기" />
}
