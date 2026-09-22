"use client"

import type { ReactNode } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

type Props = {
  items: { text: string }[]
  className?: string
}

/** Collapsed by default — trust signal, not a reading section. */
export function InsightReferences({ items, className }: Props) {
  if (!items.length) return null

  return (
    <aside
      aria-label="참고한 자료"
      className={cn(
        "mt-10 border-t border-border/50 pt-1 text-muted-foreground sm:mt-12",
        className,
      )}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="references" className="border-0">
          <AccordionTrigger
            className={cn(
              "min-h-0 py-2.5 text-left text-sm font-medium text-muted-foreground",
              "hover:text-foreground hover:no-underline",
              "[&>svg]:size-3.5 [&>svg]:text-muted-foreground/80",
            )}
          >
            참고한 자료 ({items.length})
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <ul className="list-disc space-y-1.5 pl-4 marker:text-muted-foreground/50">
              {items.map((item, index) => (
                <li
                  key={`${index}-${item.text.slice(0, 48)}`}
                  className="text-xs leading-relaxed text-muted-foreground/90 sm:text-[13px]"
                >
                  <ReferenceLine text={item.text} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  )
}

function ReferenceLine({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const href = match[2]
    const label = match[1]
    const external = /^https?:\/\//i.test(href)
    nodes.push(
      <a
        key={`${match.index}-${href}`}
        href={href}
        className="underline underline-offset-2 hover:text-foreground"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {label}
      </a>,
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? <>{nodes}</> : <>{text}</>
}
