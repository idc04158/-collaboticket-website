import { ArticleBlock, ArticleBody, ArticleTitle, articleSpaceClass } from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  title?: string
  points?: string[]
  children?: React.ReactNode
  body?: string
}

export function SummaryCard({ title = "? ?? ??", points = [], body, children }: Props) {
  return (
    <ArticleBlock tone="brand">
      <ArticleTitle>{title}</ArticleTitle>
      {points.length > 0 ? (
        <ul className={cn("article-list", articleSpaceClass.mt2)}>
          {points.map((point) => (
            <li key={point} className="article-list-item">
              <span className="article-list-item__marker" aria-hidden="true">
                <span className="size-1.5 rounded-full bg-brand" />
              </span>
              <div className="article-list-item__body">
                <p className="article-list-item__title font-normal text-foreground/90">{point}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ArticleBody>{children ?? body}</ArticleBody>
      )}
    </ArticleBlock>
  )
}
