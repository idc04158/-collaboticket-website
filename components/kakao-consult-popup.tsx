"use client"

import { X } from "lucide-react"

import { kakaoChannelUrl } from "@/lib/contact-links"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

type KakaoConsultPopupProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDismiss: () => void
  onContinue: () => void
  onKakaoClick?: () => void
}

export function KakaoConsultPopup({
  open,
  onOpenChange,
  onDismiss,
  onContinue,
  onKakaoClick,
}: KakaoConsultPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md overflow-hidden border-0 p-0 sm:max-w-md">
        <div className="relative bg-[#FEE500] px-6 pb-6 pt-8 text-[#191919]">
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-full p-1 text-[#191919]/70 transition hover:bg-black/5 hover:text-[#191919]"
            aria-label="팝업 닫기"
          >
            <X className="size-5" />
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-[#191919]/70">빠른 상담</p>
          <DialogTitle className="type-section-title mt-3 text-[#191919]">
            카카오톡으로 가볍게 문의해 보세요
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-[#191919]/80">
            일본 진출이 막막하시면 채널로 메시지를 남겨주세요. 담당자가 확인 후 답변드립니다.
          </DialogDescription>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              asChild
              className="h-11 rounded-xl bg-[#191919] font-semibold text-white hover:bg-[#333]"
              onClick={onKakaoClick}
            >
              <a href={kakaoChannelUrl} target="_blank" rel="noopener noreferrer">
                카카오톡으로 문의하기
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 text-[#191919]/80 hover:bg-black/5 hover:text-[#191919]"
              onClick={onContinue}
            >
              계속 둘러보기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
