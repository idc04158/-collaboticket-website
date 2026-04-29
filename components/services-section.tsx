import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const blocks = [
  {
    id: "sns",
    title: "SNS Marketing",
    lines: [
      "TikTok 운영 대행",
      "Instagram 인플루언서 마케팅",
      "YouTube 섭외",
      "콘텐츠 제작",
      "광고 / 파트너십 캠페인",
    ],
  },
  {
    id: "open",
    title: "Open Market",
    subtitle: "Rakuten / Qoo10 / Amazon Japan",
    lines: ["입점", "상품 등록", "상세페이지 제작", "운영 관리", "물류 연동"],
  },
  {
    id: "review",
    title: "Review Campaign",
    lines: [
      "Open market reviews (Rakuten / Qoo10 / Amazon)",
      "Community reviews (@cosme, LIPS)",
      "인증 리포트 제공",
    ],
  },
  {
    id: "logistics",
    title: "Logistics",
    lines: ["FBA", "Cross-border shipping", "Import/customs"],
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 bg-[#f7f8f3] py-28 lg:py-40">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#00B140]">Services</p>
        <h2 className="text-balance text-4xl font-black tracking-tight md:text-5xl">콜라보티켓 서비스 소개</h2>
        <p className="mt-4 text-muted-foreground">
          핵심 실행 영역만 메뉴 형태로 정리했습니다. 법인 설립은 메인 서비스 라인에 넣지 않으며,{" "}
          <span className="font-semibold text-foreground">법인 설립 지원 가능</span>합니다.
        </p>

        <Accordion type="multiple" defaultValue={["sns", "open"]} className="mt-12 w-full rounded-2xl border bg-card px-2 shadow-sm md:px-4">
          {blocks.map((block) => (
            <AccordionItem key={block.id} value={block.id} className="border-border px-2">
              <AccordionTrigger className="py-5 text-base font-bold hover:no-underline md:text-lg">
                <span className="text-left">
                  {block.title}
                  {block.subtitle ? (
                    <span className="mt-1 block text-xs font-normal text-muted-foreground md:text-sm">{block.subtitle}</span>
                  ) : null}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-inside list-disc space-y-2 pb-2 pl-1 text-sm text-muted-foreground md:text-base">
                  {block.lines.map((line) => (
                    <li key={line} className="marker:text-[#00B140]">
                      {line}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 flex justify-center">
          <Button asChild className="rounded-xl bg-[#00B140] px-8 text-white hover:bg-[#009C38]">
            <Link href="/contact">일본 진출 상담 신청</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
