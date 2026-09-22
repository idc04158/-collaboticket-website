import type { CSSProperties } from "react"
import { ArticleBlock, ArticleCell, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Stage = string | { label: string; note?: string }

type Props = {
  title?: string
  stages: Stage[]
}

function normalize(stage: Stage) {
  if (typeof stage === "string") return { label: stage, note: undefined }
  return stage
}

export function Funnel({ title = "??? ???? ??", stages = [] }: Props) {
  return (
    <ArticleBlock tone="default">
      <ArticleTitle>{title}</ArticleTitle>
      <ol className={cn("flex flex-col items-center", articleSpaceClass.mt2, articleSpaceClass.gap1)}>
        {stages.map((raw, index) => {
          const stage = normalize(raw)
          const width = `${Math.max(42, 100 - index * 14)}%`
          return (
            <li key={`${index}-${stage.label}`} className="flex w-full justify-center">
              <ArticleCell
                className="border-brand/25 bg-brand-light/50 text-center dark:bg-brand/10"
                style={{ width } as CSSProperties}
              >
                <p className={cn(articleTypeClass.caption, "font-semibold text-foreground")}>
                  <span className="mr-1.5 text-xs font-bold text-brand">{index + 1}</span>
                  {stage.label}
                </p>
                {stage.note ? (
                  <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>
                    {stage.note}
                  </p>
                ) : null}
              </ArticleCell>
            </li>
          )
        })}
      </ol>
    </ArticleBlock>
  )
}
