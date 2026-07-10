"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteLogo } from "@/components/site-logo"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { kakaoChannelUrl } from "@/lib/contact-links"
import { getOrCreateVisitorId, sendServerTrackEvent } from "@/lib/visitor-tracking"

const navItems = [
  { label: "서비스", href: "/#services" },
  { label: "회사 소개", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "인사이트", href: "/insights" },
  { label: "웨비나", href: "/webinar" },
  { label: "상담", href: "/contact" },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <SiteLogo variant="header" />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/contact" className="btn-brand px-5 py-2.5 text-sm">
              상담 신청
            </Link>
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-border bg-background transition-all duration-300 lg:hidden",
            mobileOpen ? "max-h-[28rem] py-4" : "max-h-0 py-0",
          )}
        >
          <nav className="flex flex-col gap-1 px-5" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 px-3">
              <Link
                href="/contact"
                className="btn-brand w-full py-3 text-center text-sm"
                onClick={() => setMobileOpen(false)}
              >
                상담 신청
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 md:bottom-8 md:right-8">
        <a
          href={kakaoChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            void sendServerTrackEvent({
              visitorId: getOrCreateVisitorId(),
              event: "floating_kakao_click",
              funnel: "kakao",
              path: typeof window !== "undefined" ? window.location.pathname : "/",
            })
          }}
          className="flex items-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 text-sm font-bold text-[#191919] shadow-lg transition hover:bg-[#f4dc00]"
        >
          카카오 문의
        </a>
        <Link
          href="/contact"
          className="flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_8px_30px_var(--brand-glow)] transition hover:bg-brand-dark"
        >
          상담 신청
        </Link>
      </div>
    </>
  )
}
