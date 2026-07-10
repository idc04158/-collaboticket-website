import type { MetadataRoute } from "next"

import { getAllInsightSummaries } from "@/lib/insights"
import { SITE_URL } from "@/lib/site-url"

function parseLastModified(date: string | undefined): Date {
  if (!date) return new Date()
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

export default function sitemap(): MetadataRoute.Sitemap {
  const insights = getAllInsightSummaries()
  const latestInsightDate = insights.reduce<Date>((latest, post) => {
    const modified = parseLastModified(post.date)
    return modified > latest ? modified : latest
  }, new Date(0))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: latestInsightDate.getTime() > 0 ? latestInsightDate : new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/insights`,
      lastModified: latestInsightDate.getTime() > 0 ? latestInsightDate : new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/webinar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/influencers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  const articlePages: MetadataRoute.Sitemap = insights.map((post) => ({
    url: `${SITE_URL}/insights/${post.slug}`,
    lastModified: parseLastModified(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticPages, ...articlePages]
}
