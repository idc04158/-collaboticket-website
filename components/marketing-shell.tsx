"use client"

import { useState } from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactModal } from "@/components/contact-modal"

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <SiteHeader onOpen={() => setOpen(true)} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
