import { Check } from "lucide-react"
import { ArticleBlock, ArticleIcon, ArticleTitle, articleSpaceClass } from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  title?: string
  items: string[]
}

export function Checklist({ title = "?? ??? ??", items = [] }: Props) {
  return (
    <ArticleBlock tone="muted">
      <ArticleTitle>{title}</ArticleTitle>
      <ul className={cn("article-list contains-task-list", articleSpaceClass.mt2)}>
        {items.map((item) => (
          <li key={item} className="article-list-item insight-native-bullet">
            <span className="article-list-item__marker rounded border border-brand/40 bg-background text-brand">
              <ArticleIcon icon={Check} size="sm" className="stroke-[2.5]" />
            </span>
            <div className="article-list-item__body">
              <p className="article-list-item__title font-normal text-foreground/90">{item}</p>
            </div>
          </li>
        ))}
      </ul>
    </ArticleBlock>
  )
}
