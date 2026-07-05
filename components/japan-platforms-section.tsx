import Image from "next/image"

import { japanPlatforms } from "@/lib/aeo-content"

export function JapanPlatformsSection() {
  return (
    <section id="platforms" className="scroll-mt-24 bg-[var(--surface-elevated)] py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <p className="section-label">지원 플랫폼</p>
        <h2 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-4xl">
          일본 EC·SNS 플랫폼 소개
        </h2>
        <p className="mt-4 text-muted-foreground">
          콜라보티켓이 일본 시장 진출 시 운영·마케팅을 지원하는 주요 플랫폼입니다.
        </p>

        <div className="mt-12 space-y-10">
          {japanPlatforms.map((platform) => (
            <article
              key={platform.name}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-brand/25 hover:shadow-md"
            >
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted sm:aspect-[2.8/1]">
                <Image
                  src={platform.image}
                  alt={platform.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  {platform.category}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-foreground">{platform.name}</h3>
                <div className="mt-5 space-y-4">
                  {platform.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
