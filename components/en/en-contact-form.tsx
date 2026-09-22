"use client"

import { useState, type FormEvent } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { calendarBookingUrl } from "@/lib/contact-links"
import { enContactOptions } from "@/lib/en-content"
import { cn } from "@/lib/utils"

type Status = "idle" | "submitting" | "success" | "error"

const fieldLabel = "text-sm font-semibold text-foreground"

export function EnContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [services, setServices] = useState<string[]>([])

  function toggleService(service: string) {
    setServices((prev) => (prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (services.length === 0) {
      setStatus("error")
      setErrorMessage("Please select at least one area you are interested in.")
      return
    }

    const form = new FormData(event.currentTarget)
    const value = (key: string) => String(form.get(key) ?? "").trim()

    setStatus("submitting")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          company: value("company"),
          email: value("email"),
          phone: value("phone"),
          category: value("category"),
          services,
          salesStatus: value("salesStatus"),
          goal: value("goal"),
          detail: value("detail"),
          monthlyRevenue: "",
          budget: "",
          startTiming: "",
          website: value("website"),
          source: "en-landing",
        }),
      })
      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null
      if (!response.ok || !result?.ok) throw new Error("submit failed")
      setStatus("success")
    } catch {
      setStatus("error")
      setErrorMessage("Something went wrong. Please try again or email partner@collaboticket.com.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand/30 bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto size-10 text-brand" aria-hidden="true" />
        <h3 className="type-card-title mt-4 text-xl">Thank you. We received your inquiry.</h3>
        <p className="type-body mt-3 text-muted-foreground">
          Our team will reply by email within two business days. If you prefer, you can book a call now.
        </p>
        <a
          href={calendarBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand mt-6 gap-2"
        >
          Book a call
          <ArrowRight className="size-4" />
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className={fieldLabel}>Name *</span>
          <Input name="name" required autoComplete="name" className="h-11" />
        </label>
        <label className="space-y-2">
          <span className={fieldLabel}>Company or brand *</span>
          <Input name="company" required autoComplete="organization" className="h-11" />
        </label>
        <label className="space-y-2">
          <span className={fieldLabel}>Work email *</span>
          <Input name="email" type="email" required autoComplete="email" className="h-11" />
        </label>
        <label className="space-y-2">
          <span className={fieldLabel}>Phone or WhatsApp *</span>
          <Input name="phone" type="tel" required autoComplete="tel" className="h-11" />
        </label>
        <label className="space-y-2">
          <span className={fieldLabel}>Product category *</span>
          <Input name="category" required placeholder="e.g. Skincare, supplements" className="h-11" />
        </label>
        <label className="space-y-2">
          <span className={fieldLabel}>Current status *</span>
          <select
            name="salesStatus"
            required
            defaultValue=""
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            <option value="" disabled>
              Select one
            </option>
            {enContactOptions.salesStatus.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="space-y-3">
        <legend className={fieldLabel}>What are you interested in? *</legend>
        <div className="flex flex-wrap gap-2">
          {enContactOptions.services.map((service) => {
            const selected = services.includes(service)
            return (
              <button
                key={service}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleService(service)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition",
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-background text-foreground/80 hover:border-brand/40",
                )}
              >
                {service}
              </button>
            )
          })}
        </div>
      </fieldset>

      <label className="block space-y-2">
        <span className={fieldLabel}>What would you like to achieve in Japan? *</span>
        <Input name="goal" required placeholder="e.g. Launch on Amazon Japan within 3 months" className="h-11" />
      </label>

      <label className="block space-y-2">
        <span className={fieldLabel}>Anything else we should know?</span>
        <Textarea name="detail" rows={4} />
      </label>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-brand w-full gap-2 disabled:opacity-60">
        {status === "submitting" ? "Sending..." : "Send inquiry"}
        {status !== "submitting" && <ArrowRight className="size-4" />}
      </button>
    </form>
  )
}
