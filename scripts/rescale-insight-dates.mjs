#!/usr/bin/env node
/**
 * Rescale insight publish dates to match content year references.
 * - 2025 outlook posts: early timeline (2024 H2)
 * - 2026 outlook posts: late timeline (2025 H2)
 * - Evergreen posts: between, with body year references adjusted to publish as-of year
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import {
  PUBLISH_ORDER,
  assignPublishDate,
  sortPostsByPublishOrder,
} from "./insight-content-rules.mjs"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

function slugTargetYear(slug, title = "") {
  const hay = `${slug} ${title}`
  if (/2026/.test(hay)) return 2026
  if (/2025/.test(hay)) return 2025
  return null
}

function adjustBodyYears(body, publishDate, targetYear) {
  const publishYear = Number(publishDate.slice(0, 4))
  const maxOutlook = targetYear ?? publishYear + (publishDate.slice(5, 7) >= "09" ? 1 : 0)

  let next = body

  // Forward years beyond allowed outlook → clamp
  for (let year = 2028; year >= 2024; year--) {
    if (year > maxOutlook) {
      next = next.replace(new RegExp(`\\b${year}\\b`, "g"), String(maxOutlook))
    }
  }

  // Posts without explicit target year should not discuss far future
  if (!targetYear && publishYear <= 2024) {
    next = next.replace(/\b2026\b/g, "2025")
  }
  if (!targetYear && publishYear === 2025) {
    // evergreen in 2025: 2026 only as optional outlook - keep one year ahead max
    next = next.replace(/\b2027\b/g, "2026")
    next = next.replace(/\b2028\b/g, "2026")
  }

  // Source citation years should not be after publish year
  for (let year = 2030; year > publishYear; year--) {
    next = next.replace(new RegExp(`(${year})(?=\\s*\\)|\\s*년|\\s*,|\\s*$|\\s*\\.)`, "g"), String(publishYear))
    next = next.replace(new RegExp(`(METI|Statista|Rakuten IR|NielsenIQ|JETRO|Qoo10)[^\\n]{0,30}\\b${year}\\b`, "g"), (m) =>
      m.replace(String(year), String(Math.max(publishYear - 1, 2023))),
    )
  }

  return next
}

function adjustDescription(description, publishDate, targetYear) {
  if (!description) return description
  const publishYear = Number(publishDate.slice(0, 4))
  const maxOutlook = targetYear ?? publishYear + 1
  let next = description
  for (let year = 2028; year >= 2024; year--) {
    if (year > maxOutlook) {
      next = next.replace(new RegExp(`\\b${year}\\b`, "g"), String(maxOutlook))
    }
  }
  if (!targetYear && publishYear <= 2024) {
    next = next.replace(/\b2026\b/g, "2025")
  }
  return next
}

function main() {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
      const parsed = matter(raw)
      return { slug, file, meta: parsed.data, content: parsed.content }
    })

  const sorted = sortPostsByPublishOrder(files)
  let updated = 0

  for (const [index, post] of sorted.entries()) {
    const publishDate = assignPublishDate(index)
    const targetYear = slugTargetYear(post.slug, post.meta.title)
    const newContent = adjustBodyYears(post.content, publishDate, targetYear)
    const newDescription = adjustDescription(post.meta.description, publishDate, targetYear)

    const changed =
      post.meta.date !== publishDate || post.content !== newContent || post.meta.description !== newDescription

    if (!changed) continue

    const nextMeta = {
      ...post.meta,
      date: publishDate,
      description: newDescription,
    }

    fs.writeFileSync(path.join(BLOG_DIR, post.file), matter.stringify(newContent, nextMeta))
    console.log(
      `${post.slug}: ${post.meta.date} → ${publishDate}` +
        (targetYear ? ` (target ${targetYear})` : ""),
    )
    updated++
  }

  console.log(`\nRescaled ${updated} / ${sorted.length} posts`)
  console.log(`Range: ${assignPublishDate(0)} → ${assignPublishDate(sorted.length - 1)}`)
}

main()
