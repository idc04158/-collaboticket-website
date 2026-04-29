"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Service", href: "/#services" },
  { label: "Insight", href: "/insights" },
  { label: "Webinar", href: "/webinar" },
  { label: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            title="홈으로 이동"
            className="rounded-md py-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B140]/40"
          >
            <span className="text-lg font-black tracking-tight text-foreground sm:text-xl">COLLABOTICKET</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild size="default" className="rounded-lg bg-[#00B140] font-medium text-white transition hover:bg-[#009C38]">
              <Link href="/contact">상담 신청</Link>
            </Button>
          </div>

          <button
            type="button"
            className="flex items-center justify-center md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? (
              <X className="size-5 text-foreground" />
            ) : (
              <Menu className="size-5 text-foreground" />
            )}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-border bg-background transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-96 py-4" : "max-h-0 py-0",
          )}
        >
          <nav className="flex flex-col gap-1 px-6" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 px-3">
              <Button asChild size="default" className="w-full rounded-lg bg-[#00B140] font-medium text-white transition hover:bg-[#009C38]">
                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  상담 신청
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <Link
        href="/contact"
        className="fixed bottom-5 right-5 z-40 flex items-center justify-center rounded-full bg-[#00B140] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#009C38] md:bottom-8 md:right-8"
      >
        상담 신청
      </Link>
    </>
  )
}
