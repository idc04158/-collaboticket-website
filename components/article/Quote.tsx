import { ArticleBlock, ArticleCaption, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  children?: React.ReactNode
  body?: string
  cite?: string
}

export function Quote({ children, body, cite }: Props) {
  return (
    <ArticleBlock tone="muted" as="figure" className="border-l-2 border-l-brand/40 pl-[var(--article-space-2)]">
      <blockquote className={cn(articleTypeClass.subtitle, "font-medium text-foreground/90")}>
        {children ?? body}
      </blockquote>
      {cite ? <ArticleCaption className={articleSpaceClass.mt2}>— {cite}</ArticleCaption> : null}
    </ArticleBlock>
  )
}
