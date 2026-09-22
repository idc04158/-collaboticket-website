import { ArticleBlock, ArticleTitle, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Props = {
  title?: string
  headers: string[]
  rows: string[][]
}

export function ComparisonTable({ title = "한눈에 비교", headers = [], rows = [] }: Props) {
  if (headers.length === 0 || rows.length === 0) return null

  return (
    <ArticleBlock tone="default" className="article-comparison overflow-hidden !p-0">
      <div className="border-b px-[var(--article-space-2)] py-[var(--article-space-2)]">
        <ArticleTitle>{title}</ArticleTitle>
      </div>
      <div className="overflow-x-auto">
        <table className="article-comparison-table w-full border-collapse text-left">
          <thead>
            <tr className="bg-muted/60">
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className={cn(articleTypeClass.caption, "px-[var(--article-space-2)] py-2.5 font-semibold text-foreground")}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border/80">
                {(row || []).map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className={cn(
                      articleTypeClass.caption,
                      "px-[var(--article-space-2)] py-2.5 align-top",
                      cellIndex === 0 ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ArticleBlock>
  )
}
