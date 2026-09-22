import { ArticleBlock, ArticleTitle, articleSpaceClass, articleTypeClass } from "./_shell"
import { cn } from "@/lib/utils"

type Metric = {
  value: string
  label: string
  note?: string
}

type Props = {
  title?: string
  metrics?: Metric[]
  value?: string
  label?: string
  note?: string
  className?: string
}

export function MetricCard({ title, metrics, value, label, note, className }: Props) {
  const items =
    metrics && metrics.length > 0
      ? metrics
      : value
        ? [{ value, label: label || "", note }]
        : []

  return (
    <ArticleBlock tone="brand" className={className}>
      {title ? <ArticleTitle>{title}</ArticleTitle> : null}
      <div
        className={cn(
          "grid",
          articleSpaceClass.gap2,
          title ? articleSpaceClass.mt2 : "",
          items.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "",
        )}
      >
        {items.map((item) => (
          <div key={`${item.value}-${item.label}`} className="min-w-0">
            <p className={cn(articleTypeClass.subtitle, "font-black tracking-tight text-foreground sm:text-[1.75rem]")}>
              {item.value}
            </p>
            {item.label ? (
              <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "font-semibold text-foreground/90")}>
                {item.label}
              </p>
            ) : null}
            {item.note ? (
              <p className={cn(articleTypeClass.caption, articleSpaceClass.mt1, "text-muted-foreground")}>
                {item.note}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </ArticleBlock>
  )
}
