import { ArticleBlock, ArticleCell, ArticleLabel, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

export type CaseStudyItem = {
  title: string
  cause: string
  action: string
}

type Props = {
  title?: string
  cases: CaseStudyItem[]
}

export function CaseStudies({ title = "실무에서 자주 보는 사례", cases = [] }: Props) {
  if (!cases.length) return null

  return (
    <ArticleBlock card="info">
      <ArticleTitle>{title}</ArticleTitle>
      <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>
        상담에서 자주 보는 패턴입니다. 긴 사례 나열보다, 원인과 대응만 짧게 정리했습니다.
      </p>
      <ul className={cn("grid", articleSpaceClass.mt3, articleSpaceClass.gap2)}>
        {cases.slice(0, 3).map((item) => (
          <li key={item.title}>
            <ArticleCell>
              <p className={cn(articleTypeClass.label, "text-brand")}>Case</p>
              <p className={cn(articleTypeClass.title, articleSpaceClass.mt1, "text-foreground")}>
                {item.title}
              </p>
              <div className={cn("grid gap-2 sm:grid-cols-2", articleSpaceClass.mt2)}>
                <div>
                  <ArticleLabel>원인</ArticleLabel>
                  <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-foreground/90")}>
                    {item.cause}
                  </p>
                </div>
                <div>
                  <ArticleLabel className="text-brand">실무 대응</ArticleLabel>
                  <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-foreground/90")}>
                    {item.action}
                  </p>
                </div>
              </div>
            </ArticleCell>
          </li>
        ))}
      </ul>
    </ArticleBlock>
  )
}
