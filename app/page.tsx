"use client"

import { useState } from "react"

import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { AuthoritySection } from "@/components/authority-section"
import { ServicesSection } from "@/components/services-section"
import { InfluencerDataLabSection } from "@/components/influencer-data-lab-section"
import { InsightsSection } from "@/components/insights-section"
import { WebinarsSection } from "@/components/webinars-section"
import { CtaSection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"
import { ContactModal } from "@/components/contact-modal"

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <SiteHeader onOpen={() => setOpen(true)} />

        <main>
          <HeroSection onOpen={() => setOpen(true)} />
          <AuthoritySection />
          <ServicesSection />
          <InfluencerDataLabSection />
          <InsightsSection />
          <WebinarsSection />
          <CtaSection onOpen={() => setOpen(true)} />
        </main>

        <SiteFooter />
      </div>

      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}