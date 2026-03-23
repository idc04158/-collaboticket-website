import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  { step: "STEP 01", title: "체험단 신뢰 확보", desc: "리뷰 축적" },
  { step: "STEP 02", title: "인플루언서 확산", desc: "도달 증폭" },
  { step: "STEP 03", title: "공식 SNS 운영", desc: "브랜드 축적" },
  { step: "STEP 04", title: "법인·물류 연결", desc: "장기 운영" },
]

export function AuthoritySection() {
  return (
    <section id="about" className="scroll-mt-24 bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Execution Flow</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">성과는 4단계 실행 흐름에서 만들어집니다</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((item, idx) => (
            <div key={item.step} className="relative rounded-2xl border bg-background p-8 shadow-md transition hover:scale-[1.02] hover:shadow-xl">
              <div className="text-sm font-semibold text-[#00B140]">{item.step}</div>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              {idx < steps.length - 1 && (
                <div className="pointer-events-none absolute right-[-14px] top-1/2 hidden h-0.5 w-7 -translate-y-1/2 bg-[#00B140]/40 xl:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button asChild className="rounded-xl bg-[#00B140] px-10 text-white shadow-lg transition hover:bg-[#009C38]">
            <Link href="/contact">
              일본 진출 상담 신청
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
