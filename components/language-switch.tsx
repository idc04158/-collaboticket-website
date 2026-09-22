import Link from "next/link"

import { cn } from "@/lib/utils"

export function LanguageSwitch({ current }: { current: "ko" | "en" }) {
  return (
    <nav
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-border bg-background p-0.5 text-xs font-semibold"
    >
      <Link
        href="/"
        hrefLang="ko"
        lang="ko"
        title="한국어"
        aria-current={current === "ko" ? "page" : undefined}
        className={cn(
          "rounded-full px-2.5 py-1.5 transition",
          current === "ko" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
        )}
      >
        KO
      </Link>
      <Link
        href="/en"
        hrefLang="en"
        lang="en"
        title="English"
        aria-current={current === "en" ? "page" : undefined}
        className={cn(
          "rounded-full px-2.5 py-1.5 transition",
          current === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </Link>
    </nav>
  )
}
