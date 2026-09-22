import { ArticleBlock, ArticleCell, ArticleLabel, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  title?: string
  problem: string
  cause: string
  check: string
  action: string
}

const LABELS = ["??", "??", "??", "??"] as const

export function Framework({ title = "?? ?? ??", problem, cause, check, action }: Props) {
  const steps = [problem, cause, check, action]

  return (
    <ArticleBlock tone="info">
      <ArticleTitle>{title}</ArticleTitle>
      <ol className={cn("grid sm:grid-cols-2", articleSpaceClass.mt2, articleSpaceClass.gap2)}>
        {steps.map((text, index) => (
          <li key={LABELS[index]}>
            <ArticleCell>
              <ArticleLabel className="normal-case tracking-normal text-brand">
                {index + 1}. {LABELS[index]}
              </ArticleLabel>
              <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-foreground/90")}>{text}</p>
            </ArticleCell>
          </li>
        ))}
      </ol>
    </ArticleBlock>
  )
}
