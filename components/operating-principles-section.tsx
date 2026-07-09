import { operatingPrinciples } from "@/lib/aeo-content"
import { operatingPrincipleIllustrations } from "@/components/illustrations/operating-principle-svgs"

export function OperatingPrinciplesSection() {
  return (
    <section
      id="operating-principles"
      className="scroll-mt-24 border-b border-border/60 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">운영 원칙</p>
          <h2 className="type-section-title type-section-title--center mt-4">
            콜라보티켓은 어떻게 운영하나요?
          </h2>
          <p className="type-lead type-lead--center mt-5 text-muted-foreground md:text-lg">
            어떤 서비스를 제공하는지보다, 브랜드와 함께 성장하는 운영 방식이 더 중요합니다.
            콜라보티켓은 일본 시장 진출을 단발성 프로젝트가 아닌 지속 가능한 운영 체계로 설계합니다.
          </p>
        </div>

        <ul className="mt-16 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {operatingPrinciples.map((principle) => {
            const Illustration =
              operatingPrincipleIllustrations[
                principle.id as keyof typeof operatingPrincipleIllustrations
              ]

            return (
              <li key={principle.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition duration-300 hover:border-brand/25 hover:shadow-[0_12px_40px_var(--brand-glow)]">
                  <div className="flex items-center justify-center bg-[var(--surface-elevated)] px-6 py-8 transition group-hover:bg-brand-light/60">
                    <Illustration className="h-[7.5rem] w-full max-w-[12.5rem]" />
                  </div>

                  <div className="flex flex-1 flex-col px-6 py-6 lg:px-7 lg:py-7">
                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                      {principle.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
