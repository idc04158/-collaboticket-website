import { ArticleBlock, ArticleCell, ArticleLabel, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  title?: string
  pros: string[]
  cons: string[]
}

export function ProsCons({ title = "??? ???", pros, cons }: Props) {
  return (
    <ArticleBlock tone="default">
      <ArticleTitle>{title}</ArticleTitle>
      <div className={cn("grid sm:grid-cols-2", articleSpaceClass.mt2, articleSpaceClass.gap2)}>
        <ArticleCell className="border-brand/25 bg-brand-light/40 dark:bg-brand/10">
          <ArticleLabel className="text-brand">??</ArticleLabel>
          <ul className={cn("article-list", articleSpaceClass.mt2)}>
            {pros.map((item) => (
              <li key={item} className="article-list-item">
                <span className="article-list-item__marker text-brand" aria-hidden="true">
                  +
                </span>
                <div className="article-list-item__body">
                  <p className="article-list-item__title font-normal">{item}</p>
                </div>
              </li>
            ))}
          </ul>
        </ArticleCell>
        <ArticleCell>
          <ArticleLabel>?? / ???</ArticleLabel>
          <ul className={cn("article-list", articleSpaceClass.mt2)}>
            {cons.map((item) => (
              <li key={item} className="article-list-item">
                <span className="article-list-item__marker text-muted-foreground" aria-hidden="true">
                  ?
                </span>
                <div className="article-list-item__body">
                  <p className="article-list-item__title font-normal">{item}</p>
                </div>
              </li>
            ))}
          </ul>
        </ArticleCell>
      </div>
    </ArticleBlock>
  )
}
