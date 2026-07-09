import { operationProcessSteps } from "@/lib/aeo-content"

export function OperationProcessSection() {
  return (
    <section id="process" className="scroll-mt-24 bg-[var(--surface-elevated)] py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="section-label">운영 프로세스</p>
        <h2 className="type-section-title mt-4">
          일본 시장 진출 실행 프로세스
        </h2>
        <p className="type-lead mt-4 text-muted-foreground">
          콜라보티켓이 한국 브랜드의 일본 시장 진출을 A부터 Z까지 실행하는 10단계 프로세스입니다.
        </p>

        <ol className="mt-12 space-y-0">
          {operationProcessSteps.map((item, index) => (
            <li key={item.step} className="flex flex-col items-center">
              <article className="w-full rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{item.step}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </article>
              {index < operationProcessSteps.length - 1 && (
                <span className="my-2 text-brand" aria-hidden="true">
                  ↓
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
