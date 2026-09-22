import { ArticleBlock, ArticleCell, ArticleLabel, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  title?: string
  before: string | string[]
  after: string | string[]
}

function toList(value: string | string[]) {
  return Array.isArray(value) ? value : [value]
}

export function BeforeAfter({ title = "??? ?? ?", before, after }: Props) {
  const beforeItems = toList(before)
  const afterItems = toList(after)

  return (
    <ArticleBlock tone="muted">
      <ArticleTitle>{title}</ArticleTitle>
      <div className={cn("grid sm:grid-cols-2", articleSpaceClass.mt2, articleSpaceClass.gap2)}>
        <ArticleCell>
          <ArticleLabel>?? ?</ArticleLabel>
          <ul className={cn(articleSpaceClass.mt2, articleSpaceClass.stack1)}>
            {beforeItems.map((item) => (
              <li key={item} className={cn(articleTypeClass.caption, "text-foreground/85")}>
                {item}
              </li>
            ))}
          </ul>
        </ArticleCell>
        <ArticleCell className="border-brand/25 bg-brand-light/40 dark:bg-brand/10">
          <ArticleLabel className="text-brand">?? ?</ArticleLabel>
          <ul className={cn(articleSpaceClass.mt2, articleSpaceClass.stack1)}>
            {afterItems.map((item) => (
              <li key={item} className={cn(articleTypeClass.caption, "text-foreground/90")}>
                {item}
              </li>
            ))}
          </ul>
        </ArticleCell>
      </div>
    </ArticleBlock>
  )
}
