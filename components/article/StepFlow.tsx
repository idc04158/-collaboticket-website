import { ArticleBlock, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Step = string | { title: string; description?: string }

type Props = {
  title?: string
  steps: Step[]
}

function normalize(step: Step) {
  if (typeof step === "string") return { title: step, description: undefined }
  return step
}

export function StepFlow({ title = "?? ??", steps = [] }: Props) {
  return (
    <ArticleBlock tone="default">
      {title ? <ArticleTitle>{title}</ArticleTitle> : null}
      <ol className={cn("article-list", articleSpaceClass.mt2)}>
        {steps.map((raw, index) => {
          const step = normalize(raw)
          const isLast = index === steps.length - 1
          return (
            <li key={`${index}-${step.title}`} className="article-list-item relative">
              {!isLast ? (
                <span
                  className="absolute left-[0.6rem] top-[1.75rem] bottom-[-0.5rem] w-px bg-border"
                  aria-hidden="true"
                />
              ) : null}
              <span className="article-list-item__marker relative z-[1] rounded-full border border-brand/30 bg-brand-light text-brand dark:bg-brand/15">
                <span className="text-xs font-bold">{index + 1}</span>
              </span>
              <div className="article-list-item__body">
                <p className="article-list-item__title">{step.title}</p>
                {step.description ? (
                  <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>
                    {step.description}
                  </p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </ArticleBlock>
  )
}
