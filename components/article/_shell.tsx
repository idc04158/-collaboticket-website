import type { LucideIcon } from "lucide-react"
import type { CSSProperties, HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  articleAccordionClass,
  articleCardClass,
  articleIconClass,
  articleSpaceClass,
  articleTypeClass,
  type ArticleCardVariant,
  type ArticleIconSize,
} from "@/lib/design-tokens"

export type ArticleTone = "default" | "brand" | "warning" | "muted" | "info" | "success"

/** Map legacy tone → Card Design System variant */
function toneToVariant(tone: ArticleTone, variant?: ArticleCardVariant | "default" | "cta"): ArticleCardVariant {
  if (variant && variant !== "default") {
    if (variant === "cta") return "cta"
    return variant
  }
  if (tone === "warning") return "warning"
  if (tone === "success") return "success"
  if (tone === "brand") return "action"
  return "info"
}

const alertIconTone: Record<ArticleTone, string> = {
  default: "bg-muted text-foreground",
  brand: "bg-brand/15 text-brand",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  muted: "bg-muted text-muted-foreground",
  info: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  success: "bg-brand/15 text-brand",
}

type ArticleBlockProps = {
  children: ReactNode
  className?: string
  /** @deprecated — do not show developer labels to readers */
  label?: string
  /** @deprecated Prefer `card` (info|warning|success|action|cta) */
  tone?: ArticleTone
  as?: "aside" | "section" | "div" | "figure"
  /** Card Design System variant */
  card?: ArticleCardVariant
  /** @deprecated Use card="cta" */
  variant?: "default" | "cta" | ArticleCardVariant
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "color">

export function ArticleBlock({
  children,
  className,
  tone = "default",
  as: Tag = "aside",
  card,
  variant = "default",
  ...rest
}: ArticleBlockProps) {
  const resolved = card || toneToVariant(tone, variant)
  return (
    <Tag
      className={cn("article-visual", articleCardClass[resolved], className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function ArticleTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn(articleTypeClass.title, "text-foreground", className)}>{children}</p>
}

export function ArticleBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        articleTypeClass.caption,
        articleSpaceClass.mt1,
        "text-muted-foreground [&_strong]:text-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ArticleCaption({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn(articleTypeClass.caption, "text-muted-foreground", className)}>{children}</p>
}

export function ArticleLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn(articleTypeClass.label, "text-muted-foreground", className)}>{children}</p>
}

/** Lucide / SVG icon — optical center, sizes 16 | 20 | 24 only */
export function ArticleIcon({
  icon: Icon,
  size = "md",
  className,
}: {
  icon: LucideIcon
  size?: ArticleIconSize
  className?: string
}) {
  return (
    <Icon
      className={cn(
        "article-icon",
        size === "sm" && "article-icon--sm",
        size === "lg" && "article-icon--lg",
        articleIconClass[size],
        className,
      )}
      aria-hidden="true"
    />
  )
}

/** Icon + text row — always flex + optical center */
export function ArticleIconText({
  icon,
  size = "md",
  children,
  className,
  align = "center",
}: {
  icon: LucideIcon
  size?: ArticleIconSize
  children: ReactNode
  className?: string
  align?: "center" | "start"
}) {
  return (
    <span
      className={cn(
        "article-icon-text",
        align === "start" && "article-icon-text--start",
        className,
      )}
    >
      <ArticleIcon icon={icon} size={size} />
      <span className="min-w-0 flex-1">{children}</span>
    </span>
  )
}

export function ArticleCell({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={cn(articleCardClass.nested, className)} style={style}>
      {children}
    </div>
  )
}

type ListItem = {
  title: string
  description?: string
  marker?: ReactNode
}

export function ArticleList({
  items,
  className,
  ordered,
}: {
  items: ListItem[]
  className?: string
  ordered?: boolean
}) {
  const Tag = ordered ? "ol" : "ul"
  return (
    <Tag className={cn("article-list", articleSpaceClass.mt2, className)}>
      {items.map((item, index) => (
        <li key={`${index}-${item.title}`} className="article-list-item">
          <span className="article-list-item__marker" aria-hidden={item.marker ? true : undefined}>
            {item.marker ?? (ordered ? <span className="article-type-caption font-bold text-brand">{index + 1}</span> : null)}
          </span>
          <div className="article-list-item__body">
            <p className="article-list-item__title">{item.title}</p>
            {item.description ? <p className="article-list-item__desc">{item.description}</p> : null}
          </div>
        </li>
      ))}
    </Tag>
  )
}

/** Warning / Success / Info / Tip — Icon → Title → Description */
export function ArticleAlert({
  icon,
  title,
  children,
  body,
  tone = "info",
  className,
}: {
  icon: LucideIcon
  title?: string
  children?: ReactNode
  body?: string
  tone?: ArticleTone
  className?: string
}) {
  const card: ArticleCardVariant =
    tone === "warning" ? "warning" : tone === "success" || tone === "brand" ? "success" : "info"

  return (
    <ArticleBlock card={card} className={className}>
      <div className="article-alert">
        <span className={cn("article-alert__icon", alertIconTone[tone])} aria-hidden="true">
          <ArticleIcon icon={icon} size="sm" />
        </span>
        <div className="min-w-0 flex-1">
          {title ? <ArticleTitle>{title}</ArticleTitle> : null}
          <ArticleBody>{children ?? body}</ArticleBody>
        </div>
      </div>
    </ArticleBlock>
  )
}

export { articleAccordionClass, articleCardClass, articleSpaceClass, articleTypeClass }
