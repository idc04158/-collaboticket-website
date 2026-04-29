import { promises as fs } from "fs"
import path from "path"
import matter from "gray-matter"

import { getAllInsightSummaries, getInsightBySlug, type InsightMeta } from "@/lib/insights"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

export type InsightEditorPayload = {
  slug?: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
  image?: string
  content: string
}

function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function listInsightMetas(): Promise<InsightMeta[]> {
  return getAllInsightSummaries()
}

export async function getInsightForEdit(slug: string) {
  const item = getInsightBySlug(slug)
  if (!item) return null
  return {
    ...item.meta,
    content: item.content,
  }
}

export async function saveInsight(payload: InsightEditorPayload) {
  await fs.mkdir(BLOG_DIR, { recursive: true })
  const slug = sanitizeSlug(payload.slug || payload.title)
  if (!slug) throw new Error("슬러그를 생성할 수 없습니다.")

  const frontMatter = {
    title: payload.title.trim(),
    description: payload.description.trim(),
    category: payload.category.trim() || "Insight",
    tags: payload.tags.filter(Boolean),
    date: payload.date.trim(),
    image: payload.image?.trim() || undefined,
  }

  const markdown = matter.stringify(payload.content.trim(), frontMatter)
  const fullPath = path.join(BLOG_DIR, `${slug}.md`)
  await fs.writeFile(fullPath, markdown, "utf8")

  return slug
}
