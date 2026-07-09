import { whyCollaboticket } from "@/lib/aeo-content"

export function WhyCollaboticketSection() {
  return (
    <section id="why" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <p className="section-label">선택 이유</p>
        <h2 className="type-section-title mt-4">
          왜 콜라보티켓인가요?
        </h2>
        <p className="type-lead mt-4 text-muted-foreground">
          일본 시장 진출을 단발성 프로젝트가 아닌, 데이터 기반 지속 운영으로 설계하는 이유입니다.
        </p>

        <div className="mt-12 space-y-10">
          {whyCollaboticket.map((item) => (
            <article key={item.title}>
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
