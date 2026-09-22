"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

import {
  ArticleBlock,
  ArticleIcon,
  ArticleTitle,
  articleSpaceClass,
  articleTypeClass,
} from "@/components/article/_shell"
import {
  buildInsightActionContactHref,
  loadCheckedItems,
  saveCheckedItems,
} from "@/lib/insight-action-context"
import { cn } from "@/lib/utils"

type Props = {
  slug: string
  title: string
  items: string[]
}

export function InsightActionChecklist({ slug, title, items }: Props) {
  const [checked, setChecked] = useState<string[]>([])

  useEffect(() => {
    setChecked(loadCheckedItems(slug))
  }, [slug])

  const checkedSet = useMemo(() => new Set(checked), [checked])
  const done = checked.filter((item) => items.includes(item)).length
  const total = items.length

  function toggle(item: string) {
    setChecked((prev) => {
      const next = prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
      saveCheckedItems(slug, next)
      return next
    })
  }

  if (!items.length) return null

  const href = buildInsightActionContactHref({
    slug,
    title,
    checkedItems: checked.filter((item) => items.includes(item)),
    total,
    step: done >= total && total > 0 ? "checklist-complete" : "action-checklist",
  })

  return (
    <ArticleBlock card="action" as="section" aria-labelledby="action-checklist-title">
      <ArticleTitle>
        <span id="action-checklist-title">다음 단계 · 실행 체크리스트</span>
      </ArticleTitle>
      <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>
        항목을 체크하면 이 기기에 저장됩니다. 끝나면 우선순위를 받아보세요 — 체크한 내용이 상담에 전달됩니다.
      </p>
      <p className={cn(articleTypeClass.caption, articleSpaceClass.mt2, "font-semibold text-brand")}>
        {done}/{total} 완료
      </p>
      <ul className={cn("article-list", articleSpaceClass.mt2)}>
        {items.map((item) => {
          const isOn = checkedSet.has(item)
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                className="article-list-item w-full rounded-lg px-1 py-1 text-left transition hover:bg-background/60"
              >
                <span
                  className={cn(
                    "article-list-item__marker rounded border",
                    isOn ? "border-brand bg-brand text-white" : "border-brand/40 bg-background text-transparent",
                  )}
                >
                  <ArticleIcon icon={Check} size="sm" className={isOn ? "text-white" : "opacity-0"} />
                </span>
                <span
                  className={cn(
                    "article-list-item__title font-normal",
                    isOn ? "text-foreground/70 line-through" : "text-foreground/90",
                  )}
                >
                  {item}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className={cn(articleSpaceClass.mt3)}>
        <Link
          href={href}
          className="article-icon-text inline-flex justify-center rounded-xl bg-brand px-[var(--article-space-3)] py-3 text-sm font-semibold text-white no-underline transition hover:bg-brand-dark hover:text-white hover:no-underline"
        >
          우선순위 받기
        </Link>
        <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>
          체크한 항목과 진행 단계가 문의에 함께 전달됩니다.
        </p>
      </div>
    </ArticleBlock>
  )
}
