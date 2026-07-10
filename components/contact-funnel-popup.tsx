"use client"

import Link from "next/link"
import { ArrowRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

type ContactFunnelPopupProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDismiss: () => void
  onContinue: () => void
  onCtaClick?: () => void
}

export function ContactFunnelPopup({
  open,
  onOpenChange,
  onDismiss,
  onContinue,
  onCtaClick,
}: ContactFunnelPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md overflow-hidden border-0 p-0 sm:max-w-md">
        <div className="relative bg-gradient-to-br from-[#009C38] via-[#00B140] to-[#00D64B] px-6 pb-6 pt-8 text-white">
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="팝업 닫기"
          >
            <X className="size-5" />
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">무료 실행 진단</p>
          <DialogTitle className="type-section-title mt-3 text-white">
            일본 진출 실행 전략, 지금 바로 설계해 보세요
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-white/90">
            상품·채널·예산만 알려주시면 일본 진출 가능성과 우선 실행 과제를 무료로 정리해 드립니다.
          </DialogDescription>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              asChild
              className="h-11 rounded-xl bg-white font-semibold text-[#009C38] hover:bg-white/90"
              onClick={onCtaClick}
            >
              <Link href="/contact?source=funnel">
                무료 상담 신청하기
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 text-white/90 hover:bg-white/10 hover:text-white"
              onClick={onContinue}
            >
              계속 읽기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
