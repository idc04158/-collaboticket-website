import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { SiteLogo } from "@/components/site-logo"
import {
  footerCompanyInfo,
  footerCompanyLinks,
  footerGuideLinks,
  footerPlatformLinks,
  footerSeoStatement,
  footerServiceLinks,
} from "@/lib/aeo-content"

const legalLinks = [
  {
    label: "개인정보처리방침",
    href: "https://docs.google.com/document/d/1m-BzQlt-8e2Uo3htd9P7KiDeuX1w61o2-y2jVOfND2I/view",
  },
  {
    label: "이용약관",
    href: "https://docs.google.com/document/d/1m-BzQlt-8e2Uo3htd9P7KiDeuX1w61o2-y2jVOfND2I/view",
  },
]

function FooterNav({
  title,
  links,
  ariaLabel,
}: {
  title: string
  links: ReadonlyArray<{ label: string; href: string }>
  ariaLabel: string
}) {
  return (
    <nav aria-label={ariaLabel}>
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm leading-snug text-white/65 transition hover:text-brand"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--surface-dark)] text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* 1. 회사 정보 */}
          <div className="flex flex-col gap-5 sm:col-span-2 xl:col-span-1">
            <SiteLogo variant="footer" />
            <div>
              <p className="text-sm font-semibold text-white">{footerCompanyInfo.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {footerCompanyInfo.description}
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${footerCompanyInfo.phone.replace(/-/g, "")}`}
                  className="flex items-center gap-2.5 text-white/65 transition hover:text-brand"
                >
                  <Phone className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  {footerCompanyInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${footerCompanyInfo.email}`}
                  className="flex items-center gap-2.5 break-all text-white/65 transition hover:text-brand"
                >
                  <Mail className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  {footerCompanyInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/65">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <address className="not-italic leading-relaxed">{footerCompanyInfo.address}</address>
              </li>
            </ul>
          </div>

          {/* 2. 서비스 */}
          <FooterNav title="서비스" links={footerServiceLinks} ariaLabel="서비스" />

          {/* 3. 지원 플랫폼 */}
          <FooterNav title="지원 플랫폼" links={footerPlatformLinks} ariaLabel="지원 플랫폼" />

          {/* 4. 가이드 */}
          <FooterNav title="가이드" links={footerGuideLinks} ariaLabel="가이드" />

          {/* 5. 회사 */}
          <FooterNav title="회사" links={footerCompanyLinks} ariaLabel="회사" />
        </div>

        {/* 하단 SEO 문장 + 법적 고지 */}
        <div className="mt-14 space-y-6 border-t border-white/10 pt-10">
          <p className="max-w-5xl text-sm leading-relaxed text-white/55">{footerSeoStatement}</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-4 text-xs text-white/40">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-brand"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-xs text-white/35">© 2020–2026 CollaboTicket. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
