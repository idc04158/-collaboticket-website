import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"

import { DocumentLang } from "@/components/document-lang"
import { EnContactForm } from "@/components/en/en-contact-form"
import { LanguageSwitch } from "@/components/language-switch"
import { SiteLogo } from "@/components/site-logo"
import {
  enCompanyInfo,
  enDifferentiators,
  enHero,
  enIndustries,
  enPlatforms,
  enProblem,
  enProcess,
  enServices,
  enStats,
} from "@/lib/en-content"
import { typeBody, typeCardTitle, typeHero, typeLead, typeSectionTitle } from "@/lib/typography"

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
]

function EnHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <SiteLogo variant="header" href="/en" title="CollaboTicket home" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch current="en" />
          <a href="#contact" className="btn-brand px-4 py-2.5 text-sm sm:px-5">
            Contact us
          </a>
        </div>
      </div>
    </header>
  )
}

function EnFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--surface-dark)] text-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14 lg:flex-row lg:justify-between lg:px-8">
        <div className="max-w-sm space-y-4">
          <SiteLogo variant="footer" href="/en" title="CollaboTicket home" />
          <p className="text-sm leading-relaxed text-white/65">{enCompanyInfo.description}</p>
        </div>

        <ul className="space-y-3 text-sm">
          <li>
            <a
              href={`mailto:${enCompanyInfo.email}`}
              className="flex items-center gap-2.5 text-white/65 transition hover:text-brand"
            >
              <Mail className="size-4 shrink-0 text-brand" aria-hidden="true" />
              {enCompanyInfo.email}
            </a>
          </li>
          <li>
            <a
              href={`tel:${enCompanyInfo.phoneHref}`}
              className="flex items-center gap-2.5 text-white/65 transition hover:text-brand"
            >
              <Phone className="size-4 shrink-0 text-brand" aria-hidden="true" />
              {enCompanyInfo.phone}
            </a>
          </li>
          <li className="flex items-start gap-2.5 text-white/65">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            <address className="not-italic leading-relaxed">{enCompanyInfo.address}</address>
          </li>
        </ul>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-6 py-6 lg:px-8">
        <p className="text-xs text-white/35">© 2020–2026 CollaboTicket. All rights reserved.</p>
      </div>
    </footer>
  )
}

export function EnLanding() {
  return (
    <div lang="en" className="flex min-h-screen flex-col">
      <DocumentLang lang="en" />
      <EnHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[var(--surface-dark)] text-white">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.05]" />
          <div className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-brand/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-1/3 size-96 rounded-full bg-brand/8 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="animate-fade-up max-w-3xl">
              <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold tracking-wide text-white/70">
                {enHero.eyebrow}
              </p>
              <h1 className={typeHero("mt-5")}>{enHero.title}</h1>
              <p className={typeLead("mt-6 text-white/65 sm:text-lg")}>{enHero.subtitle}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="btn-brand h-11 gap-2 px-7">
                  {enHero.primaryCta}
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#services"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {enHero.secondaryCta}
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Supported platforms">
                {enPlatforms.map((platform) => (
                  <li key={platform}>
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70">
                      {platform}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-b bg-white py-14" aria-labelledby="en-stats-heading">
          <h2 id="en-stats-heading" className="sr-only">
            CollaboTicket at a glance
          </h2>
          <ul className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {enStats.map((stat) => (
              <li key={stat.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="stat-value text-brand">{stat.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stat.label}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <p className="section-label">{enProblem.label}</p>
            <h2 className={typeSectionTitle("mt-4")}>{enProblem.title}</h2>
            <div className="mt-8 space-y-5">
              {enProblem.paragraphs.map((paragraph) => (
                <p key={paragraph} className={typeBody("text-foreground/85")}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-24 bg-[var(--surface-elevated)] py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-label">Services</p>
              <h2 className={typeSectionTitle("type-section-title--center mt-4")}>
                Everything you need to sell in Japan, run by one team
              </h2>
              <p className={typeLead("type-lead--center mt-4 text-muted-foreground")}>
                Pick a single service or combine them. Most engagements are monthly retainers with fixed pricing.
              </p>
            </div>

            <ul className="mt-14 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {enServices.map((service) => (
                <li key={service.id}>
                  <article
                    className={`flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg ${
                      "highlighted" in service && service.highlighted ? "border-brand ring-1 ring-brand/20" : "border-border"
                    }`}
                  >
                    <h3 className={typeCardTitle("text-lg")}>{service.title}</h3>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{service.subtitle}</p>
                    <ul className="mt-4 flex flex-1 flex-col gap-2">
                      {service.lines.map((line) => (
                        <li key={line} className="flex items-center gap-2 text-sm text-foreground/75">
                          <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="approach" className="scroll-mt-24 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="section-label">Why CollaboTicket</p>
              <h2 className={typeSectionTitle("mt-4")}>Built for brands that want sales in Japan, not just a launch</h2>
            </div>
            <ul className="mt-12 grid gap-5 md:grid-cols-2">
              {enDifferentiators.map((item) => (
                <li key={item.title} className="rounded-2xl border border-border bg-card p-7 shadow-sm">
                  <h3 className={typeCardTitle("text-lg")}>{item.title}</h3>
                  <p className={typeBody("mt-3 text-muted-foreground")}>{item.body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <p className="text-sm font-semibold text-foreground">Categories we work in</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {enIndustries.map((industry) => (
                  <li key={industry}>
                    <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground/80">
                      {industry}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="process" className="scroll-mt-24 bg-[var(--surface-elevated)] py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <p className="section-label">How we work</p>
            <h2 className={typeSectionTitle("mt-4")}>From first analysis to a growing business in Japan</h2>
            <ol className="mt-12 space-y-4">
              {enProcess.map((step, index) => (
                <li key={step.title} className="flex gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 py-24 lg:py-32">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:px-8">
            <div>
              <p className="section-label">Contact</p>
              <h2 className={typeSectionTitle("mt-4")}>Tell us about your brand</h2>
              <p className={typeLead("mt-4 text-muted-foreground")}>
                Brands, agencies, investors and partners are all welcome. We reply in English within two business days.
              </p>
              <p className="mt-8 text-sm text-muted-foreground">
                Prefer email? Write to{" "}
                <a href={`mailto:${enCompanyInfo.email}`} className="font-semibold text-brand hover:underline">
                  {enCompanyInfo.email}
                </a>
              </p>
            </div>
            <EnContactForm />
          </div>
        </section>
      </main>

      <EnFooter />
    </div>
  )
}
