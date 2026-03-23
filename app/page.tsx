import { getAllInsightSummaries } from "@/lib/insights"
import { HomePageClient } from "@/components/home-page-client"

export default function Home() {
  const insightTeasers = getAllInsightSummaries().slice(0, 3)

  return <HomePageClient insightTeasers={insightTeasers} />
}
