import { whyJapanHardParagraphs } from "@/lib/aeo-content"

export function WhyJapanSection() {
  return (
    <section id="why-japan" className="scroll-mt-24 border-b bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <p className="section-label">일본 시장 진출</p>
        <h2 className="type-section-title mt-4">
          왜 일본 시장 진출은 어려울까요?
        </h2>

        <div className="mt-10 space-y-6">
          {whyJapanHardParagraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-foreground/85">
              {paragraph}
            </p>
          ))}
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["플랫폼", "광고", "리뷰 문화", "물류", "소비자 성향"].map((factor) => (
            <li
              key={factor}
              className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-medium"
            >
              <span className="text-brand" aria-hidden="true">✓</span>
              일본과 다른 {factor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
