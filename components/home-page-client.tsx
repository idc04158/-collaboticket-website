"use client"

import { HeroSection } from "@/components/hero-section"
import { TrustHighlightsSection } from "@/components/trust-highlights-section"
import { AuthoritySection } from "@/components/authority-section"
import { InfluencerDataLabSection } from "@/components/influencer-data-lab-section"
import { MidCtaSection } from "@/components/mid-cta-section"
import { ServicesSection } from "@/components/services-section"
import { InsightsSection } from "@/components/insights-section"
import { WebinarsSection } from "@/components/webinars-section"
import { CtaSection } from "@/components/cta-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { InsightMeta } from "@/lib/insights"

type Props = {
  insightTeasers: InsightMeta[]
}

export function HomePageClient({ insightTeasers }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main>
        <HeroSection />
        <ServicesSection />
        <TrustHighlightsSection />
        <AuthoritySection />
        <InfluencerDataLabSection />
        <MidCtaSection />
        <InsightsSection teasers={insightTeasers} />
        <WebinarsSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </div>
  )
}
