"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

import { LanguageSwitch } from "@/components/language-switch"
import { SiteLogo } from "@/components/site-logo"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
]

export function EnHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <SiteLogo variant="header" href="/en" title="CollaboTicket home" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch current="en" />
          <a href="#contact" className="btn-brand hidden px-5 py-2.5 text-sm lg:inline-flex">
            Contact us
          </a>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="en-mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-96 py-4" : "max-h-0 border-t-0 py-0",
        )}
      >
        <nav id="en-mobile-nav" className="flex flex-col gap-1 px-5" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 px-3">
            <a href="#contact" className="btn-brand w-full py-3 text-center text-sm" onClick={() => setMobileOpen(false)}>
              Contact us
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
