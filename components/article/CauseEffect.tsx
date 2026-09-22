import { ChevronDown } from "lucide-react"
import {
  ArticleBlock,
  ArticleCell,
  ArticleIcon,
  ArticleTitle,
  articleSpaceClass,
  articleTypeClass,
} from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  title?: string
  cause: string
  effect?: string
  impact?: string
  result?: string
  solution?: string
  chain?: string[]
}

export function CauseEffect({
  title = "???? ????",
  cause,
  effect,
  impact,
  result,
  solution,
  chain,
}: Props) {
  const items =
    chain && chain.length > 0
      ? chain
      : [cause, impact || effect, result, solution].filter((v): v is string => Boolean(v))

  return (
    <ArticleBlock tone="muted">
      <ArticleTitle>{title}</ArticleTitle>
      <ol className={cn("flex flex-col", articleSpaceClass.mt2, articleSpaceClass.gap1)}>
        {items.map((item, index) => (
          <li key={`${index}-${item}`} className={cn("flex flex-col", articleSpaceClass.gap1)}>
            <ArticleCell className="article-icon-text">
              <span className={cn(articleTypeClass.caption, "w-4 shrink-0 font-bold tabular-nums text-muted-foreground")}>
                {index + 1}
              </span>
              <span className={cn(articleTypeClass.caption, "min-w-0 flex-1 text-foreground/90")}>{item}</span>
            </ArticleCell>
            {index < items.length - 1 ? (
              <span className="mx-auto flex items-center justify-center text-muted-foreground/70">
                <ArticleIcon icon={ChevronDown} size="sm" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </ArticleBlock>
  )
}
