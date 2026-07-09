import { typeDisplay, typeLead } from "@/lib/typography"

type PageHeroProps = {
  label: string
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHero({ label, title, description, children }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden border-b bg-[var(--surface-dark)] py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.07]" />
      <div className="pointer-events-none absolute -right-32 top-0 size-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 size-72 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <p className="section-label text-brand">{label}</p>
        <h1 className={typeDisplay("mt-4")}>{title}</h1>
        {description && <p className={typeLead("mt-5 text-white/70")}>{description}</p>}
        {children}
      </div>
    </div>
  )
}
