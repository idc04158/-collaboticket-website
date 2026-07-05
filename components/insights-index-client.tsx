"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === category
                      ? "border-brand bg-brand text-white"
                      : "bg-background hover:border-brand"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">태그</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    selectedTag === tag
                      ? "border-brand bg-brand text-white"
                      : "bg-background hover:border-brand"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        총 <span className="font-mono font-bold text-foreground">{filtered.length}</span>개 인사이트
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/insights/${post.slug}`} className="group block h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
              {post.image ? (
                <img
                  src={post.image}
                  alt={`${post.title} 썸네일`}
                  className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-muted/40 text-muted-foreground">
                  <FileText className="size-6" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <Badge variant="secondary" className="w-fit text-xs">{post.category}</Badge>
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h2 className="line-clamp-2 text-base font-bold leading-snug transition group-hover:text-brand">
                  {post.title}
                </h2>
                <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                {post.date && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  읽어보기
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  )
}
