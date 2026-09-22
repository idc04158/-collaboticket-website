import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  ArticleBlock,
  ArticleIcon,
  ArticleTitle,
  articleSpaceClass,
  articleTypeClass,
} from "@/components/article/_shell"
import { cn } from "@/lib/utils"

type Props = {
  slug?: string
  title?: string
  heading?: string
  body?: string
  ctaLabel?: string
  href?: string
}

/** Unified CTA card — info-card extension, not a promo banner */
export function InsightNextStepCta({
  slug,
  title,
  heading = "우리 상품에도 적용해보기",
  body = "지금 글에서 본 실행 순서를 우리 SKU·채널·예산에 맞춰 우선순위만 정리해 드립니다.",
  ctaLabel = "우선순위 받기",
  href,
}: Props) {
  const link =
    href ||
    (slug
      ? `/contact?topic=insight-action&source=insight-next&slug=${encodeURIComponent(slug)}${
          title ? `&title=${encodeURIComponent(title)}` : ""
        }&step=next-step`
      : "/contact?topic=diagnosis")

  return (
    <ArticleBlock card="cta" as="aside" aria-labelledby="insight-next-step-title">
      <p className={cn(articleTypeClass.label, "text-brand")}>다음 단계</p>
      <ArticleTitle>
        <span id="insight-next-step-title" className={articleTypeClass.subtitle}>
          {heading}
        </span>
      </ArticleTitle>
      <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>{body}</p>
      <Link
        href={link}
        className={cn(
          "article-icon-text mt-[var(--article-space-3)] inline-flex justify-center rounded-xl bg-brand px-[var(--article-space-3)] py-3 text-sm font-semibold text-white no-underline transition hover:bg-brand-dark hover:text-white hover:no-underline",
        )}
      >
        {ctaLabel}
        <ArticleIcon icon={ArrowRight} size="sm" className="text-white" />
      </Link>
    </ArticleBlock>
  )
}
