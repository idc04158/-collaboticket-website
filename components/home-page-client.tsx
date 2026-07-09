import { HeroSection } from "@/components/hero-section"
import { HomeMarketBriefingSection } from "@/components/home-market-briefing-section"
import { OperatingPrinciplesSection } from "@/components/operating-principles-section"
import { WhyJapanSection } from "@/components/why-japan-section"
import { StatsSection } from "@/components/stats-section"
import { CompanyIntroSection } from "@/components/company-intro-section"
import { ServicesSection } from "@/components/services-section"
import { InfluencerNetworkSection } from "@/components/influencer-network-section"
import { StrengthsSection } from "@/components/strengths-section"
import { OperationProcessSection } from "@/components/operation-process-section"
import { SubscriptionSection } from "@/components/subscription-section"
import { JapanPlatformsSection } from "@/components/japan-platforms-section"
import { InfluencerDataLabSection } from "@/components/influencer-data-lab-section"
import { TrustHighlightsSection } from "@/components/trust-highlights-section"
import { FaqSection } from "@/components/faq-section"
import { KnowledgeHubSection } from "@/components/knowledge-hub-section"
import { InsightsSection } from "@/components/insights-section"
import { WebinarsSection } from "@/components/webinars-section"
import { MidCtaSection } from "@/components/mid-cta-section"
import { CtaSection } from "@/components/cta-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { InsightEnriched, InsightMeta } from "@/lib/insights"

type Props = {
  weeklyBriefing: InsightEnriched[]
  insightTeasers: InsightMeta[]
  totalInsightCount: number
  weeklyNewCount: number
  lastUpdated: string
}

export function HomePageClient({
  weeklyBriefing,
  insightTeasers,
  totalInsightCount,
  weeklyNewCount,
  lastUpdated,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main>
        <HeroSection totalInsightCount={totalInsightCount} weeklyNewCount={weeklyNewCount} />
        <HomeMarketBriefingSection
          insights={weeklyBriefing}
          totalCount={totalInsightCount}
          weeklyNewCount={weeklyNewCount}
          lastUpdated={lastUpdated}
        />
        <OperatingPrinciplesSection />
        <WhyJapanSection />
        <StatsSection />
        <ServicesSection />
        <InfluencerNetworkSection />
        <StrengthsSection />
        <OperationProcessSection />
        <SubscriptionSection />
        <JapanPlatformsSection />
        <InfluencerDataLabSection />
        <TrustHighlightsSection />
        <CompanyIntroSection />
        <FaqSection />
        <KnowledgeHubSection />
        <InsightsSection teasers={insightTeasers} totalCount={totalInsightCount} />
        <WebinarsSection />
        <MidCtaSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </div>
  )
}
