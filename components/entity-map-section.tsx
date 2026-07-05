import { entityMapChain } from "@/lib/aeo-content"

export function EntityMapSection() {
  return (
    <section id="entity-map" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="section-label">서비스 구조</p>
        <h2 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-4xl">
          콜라보티켓 서비스 관계도
        </h2>
        <p className="mt-4 text-muted-foreground">
          콜라보티켓이 제공하는 일본 마케팅·일본 EC·물류·법인 서비스가 일본 시장 진출로 연결되는 구조입니다.
        </p>

        <nav className="mt-12" aria-label="콜라보티켓 서비스 관계도">
          <ol className="space-y-0">
            {entityMapChain.map((item, index) => (
              <li key={item} className="flex flex-col items-center">
                <div
                  className={`w-full rounded-xl border px-6 py-4 text-center text-sm font-semibold ${
                    index === 0
                      ? "border-brand bg-brand text-white"
                      : index === entityMapChain.length - 1
                        ? "border-brand/40 bg-brand-light text-foreground"
                        : "border-border bg-card text-foreground"
                  }`}
                >
                  {item}
                </div>
                {index < entityMapChain.length - 1 && (
                  <span className="my-1 text-brand" aria-hidden="true">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  )
}
