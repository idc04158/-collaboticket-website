import { ArticleBlock, ArticleCell, ArticleLabel, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  question: string
  yes: string
  no: string
  title?: string
}

export function DecisionTree({ title = "?? ?????", question, yes, no }: Props) {
  return (
    <ArticleBlock tone="info">
      <ArticleTitle>{title}</ArticleTitle>
      <p className={cn(articleTypeClass.caption, articleSpaceClass.mt2, "font-semibold text-foreground")}>
        {question}
      </p>
      <div className={cn("grid sm:grid-cols-2", articleSpaceClass.mt2, articleSpaceClass.gap2)}>
        <ArticleCell>
          <ArticleLabel className="text-brand">Yes</ArticleLabel>
          <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-foreground/90")}>{yes}</p>
        </ArticleCell>
        <ArticleCell>
          <ArticleLabel>No</ArticleLabel>
          <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-foreground/90")}>{no}</p>
        </ArticleCell>
      </div>
    </ArticleBlock>
  )
}
