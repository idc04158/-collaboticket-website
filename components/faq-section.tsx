"use client"

import { faqItems } from "@/lib/aeo-content"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 bg-[var(--surface-elevated)] py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <p className="section-label">자주 묻는 질문</p>
        <h2 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-4xl">
          일본 시장 진출 FAQ
        </h2>
        <p className="mt-4 text-muted-foreground">
          일본 마케팅, 일본 EC 운영, 일본 리뷰·인플루언서 마케팅, 일본 물류, 법인 설립에 대해 자주 받는 질문입니다.
          총 {faqItems.length}개 항목입니다.
        </p>

        <Accordion type="multiple" className="mt-12 w-full space-y-2">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="rounded-xl border bg-card px-4"
            >
              <AccordionTrigger className="py-4 text-left text-base font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
