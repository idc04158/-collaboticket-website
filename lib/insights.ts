import fs from "fs"
import path from "path"
import matter from "gray-matter"

import { enrichInsight, type InsightEnriched } from "@/lib/insight-hub"

export type InsightMeta = {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
  image?: string
}

export { getInsightCategoryLabel, insightCategoryLabels } from "@/lib/insight-categories"
export type { InsightEnriched } from "@/lib/insight-hub"
export {
  enrichInsight,
  filterInsights,
  getFeaturedReport,
  getHubStats,
  getRelatedInsights,
  getTopicClusterLinks,
  getWeeklyBriefLines,
  INSIGHT_FILTER_GROUPS,
} from "@/lib/insight-hub"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

function readMetaFromFile(fileName: string): InsightMeta | null {
  if (!fileName.endsWith(".md")) return null
  const slug = fileName.replace(/\.md$/, "")
  const fullPath = path.join(BLOG_DIR, fileName)
  const raw = fs.readFileSync(fullPath, "utf8")
  const { data } = matter(raw)

  return {
    slug,
    title: (data.title as string) || slug,
    description: (data.description as string) || "",
    category: (data.category as string) || "Insight",
    tags: Array.isArray(data.tags) ? (data.tags as string[]).filter(Boolean) : [],
    date: (data.date as string) || "",
    image: data.image as string | undefined,
  }
}

export function getAllInsightSummaries(): InsightMeta[] {
  try {
    const names = fs.readdirSync(BLOG_DIR)
    const items = names
      .map(readMetaFromFile)
      .filter((x): x is InsightMeta => x !== null)

    return items.sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export function getAllEnrichedInsights(): InsightEnriched[] {
  try {
    const names = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
    const items = names
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "")
        const result = getInsightBySlug(slug)
        if (!result) return null
        return enrichInsight(result.meta, result.content)
      })
      .filter((x): x is InsightEnriched => x !== null)

    return items.sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export function getEnrichedInsightBySlug(slug: string): (InsightEnriched & { content: string }) | null {
  const result = getInsightBySlug(slug)
  if (!result) return null
  return { ...enrichInsight(result.meta, result.content), content: result.content }
}

export function getInsightSlugs(): string[] {
  return getAllInsightSummaries().map((p) => p.slug)
}

export function getInsightBySlug(slug: string): {
  meta: InsightMeta
  content: string
} | null {
  try {
    const fullPath = path.join(BLOG_DIR, `${slug}.md`)
    const raw = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(raw)
    const meta: InsightMeta = {
      slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      category: (data.category as string) || "Insight",
      tags: Array.isArray(data.tags) ? (data.tags as string[]).filter(Boolean) : [],
      date: (data.date as string) || "",
      image: data.image as string | undefined,
    }
    return { meta, content }
  } catch {
    return null
  }
}
