import { ArticleBlock, ArticleCell, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Item = {
  label: string
  priority: "high" | "medium" | "low" | string
  note?: string
}

type Props = {
  title?: string
  items: Item[]
}

const priorityStyle: Record<string, string> = {
  high: "border-brand/40 bg-brand-light/70 text-brand dark:bg-brand/15",
  medium: "border-amber-500/35 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  low: "border-border bg-muted text-muted-foreground",
}

const priorityLabel: Record<string, string> = {
  high: "??",
  medium: "??",
  low: "??",
}

export function PriorityMatrix({ title = "??? ?? ??", items }: Props) {
  return (
    <ArticleBlock tone="muted">
      <ArticleTitle>{title}</ArticleTitle>
      <ul className={cn("article-list", articleSpaceClass.mt2)}>
        {items.map((item) => {
          const key = String(item.priority).toLowerCase()
          return (
            <li key={item.label}>
              <ArticleCell className="flex flex-col gap-[var(--article-space-1)] sm:flex-row sm:items-start sm:gap-[var(--article-space-2)]">
                <span
                  className={cn(
                    "article-type-label inline-flex w-fit shrink-0 rounded-md border px-2 py-1 normal-case tracking-normal",
                    priorityStyle[key] || priorityStyle.medium,
                  )}
                >
                  {priorityLabel[key] || item.priority}
                </span>
                <div className="min-w-0">
                  <p className={cn(articleTypeClass.caption, "font-semibold text-foreground")}>{item.label}</p>
                  {item.note ? (
                    <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>
                      {item.note}
                    </p>
                  ) : null}
                </div>
              </ArticleCell>
            </li>
          )
        })}
      </ul>
    </ArticleBlock>
  )
}
