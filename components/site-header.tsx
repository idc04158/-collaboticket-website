"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Insights", href: "/insights" }, // 실제 페이지 연결
  { label: "Webinars", href: "#webinars" },
  { label: "Contact", href: "#contact" },
]

export function SiteHeader({ onOpen }: { onOpen: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="font-sans text-lg font-bold tracking-tight text-foreground"
        >
          CollaboTicket
        </Link>

        {/* Desktop Nav */}
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

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Button
            size="default"
            onClick={onOpen}
            className="rounded-lg font-medium bg-[#00B140] hover:bg-[#009C38] text-white transition"
          >
            상담 신청
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="size-5 text-foreground" />
          ) : (
            <Menu className="size-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-96 py-4" : "max-h-0 py-0"
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
            <Button
              size="default"
              onClick={() => {
                setMobileOpen(false)
                onOpen()
              }}
              className="w-full rounded-lg font-medium bg-[#00B140] hover:bg-[#009C38] text-white transition"
            >
              상담 신청
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}