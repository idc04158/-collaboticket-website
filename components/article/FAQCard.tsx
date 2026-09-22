"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { articleAccordionClass, articleTypeClass } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

type Item = {
  question: string
  answer: string
}

type Props = {
  title?: string
  items: Item[]
}

function answerPreview(answer: string) {
  const cleaned = String(answer || "")
    .replace(/\s+/g, " ")
    .trim()
  if (!cleaned) return ""
  const firstSentence = cleaned.split(/(?<=[.?!??])\s+/)[0] || cleaned
  if (firstSentence.length <= 72) return firstSentence
  return `${firstSentence.slice(0, 70).trimEnd()}?`
}

export function FAQCard({ title, items = [] }: Props) {
  if (!items.length) return null

  return (
    <div className="w-full">
      {title ? <p className={cn(articleTypeClass.title, "mb-[var(--article-space-2)] text-foreground")}>{title}</p> : null}
      <Accordion type="multiple" className={articleAccordionClass.root}>
        {items.map((item, index) => {
          const preview = answerPreview(item.answer)
          return (
            <AccordionItem
              key={`${index}-${item.question}`}
              value={`faq-${index}`}
              className={cn("group border-0", articleAccordionClass.item)}
            >
              <AccordionTrigger
                className={cn(
                  articleAccordionClass.trigger,
                  "hover:no-underline [&[data-state=open]>svg]:rotate-180",
                )}
              >
                <span className="flex min-w-0 flex-1 flex-col justify-center py-3.5 pr-1 text-left">
                  <span className={cn(articleTypeClass.faqQuestion, "text-foreground")}>{item.question}</span>
                  {preview ? (
                    <span className={articleAccordionClass.preview}>{preview}</span>
                  ) : null}
                </span>
              </AccordionTrigger>
              <AccordionContent className={articleAccordionClass.content}>
                <p className={cn(articleTypeClass.caption, "pb-4 text-muted-foreground")}>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
