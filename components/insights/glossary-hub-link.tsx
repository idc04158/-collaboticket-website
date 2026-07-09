import Link from "next/link"
import { BookOpen } from "lucide-react"

import { getGlossaryHref } from "@/lib/marketing-glossary"

export function GlossaryHubLink() {
  return (
    <Link
      href={getGlossaryHref()}
      className="group inline-flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand-light/40 px-5 py-4 transition hover:border-brand/40 hover:bg-brand-light/70"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
        <BookOpen className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-bold text-foreground">일본 EC 마케팅 용어 사전</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          ROAS, LTV, CVR 등 리포트에 나오는 약자·전문용어를 쉽게 확인하세요.
        </span>
      </span>
    </Link>
  )
}
