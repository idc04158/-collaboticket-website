import { companyIntroParagraphs, heroDescription, supportedIndustries } from "@/lib/aeo-content"

export function CompanyIntroSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-[var(--surface-elevated)] py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <p className="section-label">회사 소개</p>
        <h2 className="type-section-title mt-4">
          콜라보티켓은 어떤 회사인가요?
        </h2>
        <p className="type-lead mt-4 text-muted-foreground">
          한국 브랜드의 일본 시장 진출을 A부터 Z까지 실행하는 파트너입니다. 일본 현지 인플루언서 연결이 핵심 차별점입니다.
        </p>

        <p className="mt-6 text-base leading-relaxed text-foreground/85">{heroDescription}</p>

        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground">지원 산업</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {supportedIndustries.map((industry) => (
              <li key={industry}>
                <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground/80">
                  {industry}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 space-y-6">
          {companyIntroParagraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-foreground/85">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
