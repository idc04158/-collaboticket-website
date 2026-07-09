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

type InsightConversionPopupProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDismiss: () => void
  onContinue: () => void
  onCtaClick?: () => void
  articlesRead: number
}

export function InsightConversionPopup({
  open,
  onOpenChange,
  onDismiss,
  onContinue,
  onCtaClick,
  articlesRead,
}: InsightConversionPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md overflow-hidden border-0 p-0 sm:max-w-md"
      >
        <div className="relative bg-gradient-to-br from-[#009C38] via-[#00B140] to-[#00D64B] px-6 pb-6 pt-8 text-white">
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="팝업 닫기"
          >
            <X className="size-5" />
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">무료 진단</p>
          <DialogTitle className="mt-3 text-balance text-2xl font-black leading-snug text-white">
            인사이트 {articlesRead}편을 읽으셨네요.
            <br />
            <span className="rounded bg-white/20 px-1.5 py-0.5">우리 브랜드</span>도 일본에서
            가능할까요?
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-white/90">
            상품·채널·예산만 알려주시면 일본 진출 가능성과 우선 실행 과제를 무료로 정리해 드립니다.
          </DialogDescription>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              asChild
              className="h-12 rounded-full bg-[#0a1610] text-base font-bold text-white hover:bg-[#0a1610]/90"
            >
              <Link href="/contact?topic=diagnosis&from=insight-popup" onClick={onCtaClick}>
                무료 일본 진출 진단 받기
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <button
              type="button"
              onClick={onContinue}
              className="rounded-full border border-white/40 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              계속 읽기
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
