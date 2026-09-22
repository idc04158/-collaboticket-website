import { ArticleBlock, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Item = string | { time: string; text: string }

type Props = {
  title?: string
  items: Item[]
}

function normalize(item: Item, index: number) {
  if (typeof item === "string") return { time: `${index + 1}`, text: item }
  return item
}

export function Timeline({ title = "?? ????", items }: Props) {
  return (
    <ArticleBlock tone="default">
      <ArticleTitle>{title}</ArticleTitle>
      <ol className={cn("article-list", articleSpaceClass.mt2)}>
        {items.map((raw, index) => {
          const item = normalize(raw, index)
          return (
            <li key={`${item.time}-${item.text}`} className="article-list-item">
              <div className="flex flex-col items-center">
                <span className="article-list-item__marker w-auto min-w-[var(--article-icon-md)] rounded-md border bg-muted px-2 text-[0.7rem] font-bold text-foreground">
                  {item.time}
                </span>
                {index < items.length - 1 ? (
                  <span className="mt-1 w-px min-h-3 flex-1 bg-border" aria-hidden="true" />
                ) : null}
              </div>
              <div className="article-list-item__body">
                <p className={cn(articleTypeClass.caption, "text-foreground/90")}>{item.text}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </ArticleBlock>
  )
}
