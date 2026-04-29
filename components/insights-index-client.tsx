"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { InsightMeta } from "@/lib/insights"

type Props = {
  posts: InsightMeta[]
}

export function InsightsIndexClient({ posts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체")
  const [selectedTag, setSelectedTag] = useState<string>("전체")

  const categories = useMemo(() => ["전체", ...new Set(posts.map((post) => post.category))], [posts])
  const tags = useMemo(() => ["전체", ...new Set(posts.flatMap((post) => post.tags || []))], [posts])

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const categoryOk = selectedCategory === "전체" || post.category === selectedCategory
      const tagOk = selectedTag === "전체" || post.tags.includes(selectedTag)
      return categoryOk && tagOk
    })
  }, [posts, selectedCategory, selectedTag])

  return (
    <>
      <div className="mt-8 space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">카테고리 필터</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === category ? "border-[#00B140] bg-[#00B140]/10 text-foreground" : "bg-card hover:border-[#00B140]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">태그 필터</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedTag === tag ? "border-[#00B140] bg-[#00B140]/10 text-foreground" : "bg-card hover:border-[#00B140]"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">총 {filtered.length}개 인사이트</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/insights/${post.slug}`} className="group block h-full">
            <Card className="h-full border-border transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={`${post.title} 썸네일`}
                    className="aspect-[16/9] w-full rounded-lg border object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
                    <FileText className="size-5" />
                  </div>
                )}
                <Badge variant="secondary" className="w-fit text-xs">
                  {post.category}
                </Badge>
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h2 className="line-clamp-2 text-lg font-semibold leading-snug transition group-hover:text-[#00B140]">
                  {post.title}
                </h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                {post.date && (
                  <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#00B140]">
                  읽어보기
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
