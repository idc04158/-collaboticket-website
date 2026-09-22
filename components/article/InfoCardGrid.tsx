import { ArticleBlock, ArticleCell, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Card = {
  title: string
  body: string
}

type Props = {
  title?: string
  cards: Card[]
}

export function InfoCardGrid({ title = "??? ????", cards }: Props) {
  return (
    <ArticleBlock tone="default">
      {title ? <ArticleTitle>{title}</ArticleTitle> : null}
      <ul className={cn("grid grid-cols-1", articleSpaceClass.mt2, articleSpaceClass.gap2)}>
        {cards.map((card) => (
          <li key={card.title}>
            <ArticleCell>
              <p className={cn(articleTypeClass.title, "text-foreground")}>{card.title}</p>
              <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>
                {card.body}
              </p>
            </ArticleCell>
          </li>
        ))}
      </ul>
    </ArticleBlock>
  )
}
