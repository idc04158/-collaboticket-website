import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

const LOGO_SRC = "/logo.png"
const LOGO_WIDTH = 117
const LOGO_HEIGHT = 74

type SiteLogoProps = {
  variant?: "header" | "footer"
  className?: string
}

function LogoWordmark({
  variant,
  className,
}: {
  variant: "header" | "footer"
  className?: string
}) {
  const isFooter = variant === "footer"

  return (
    <span
      className={cn(
        "text-lg font-black tracking-tight",
        isFooter ? "text-white" : "text-foreground",
        className,
      )}
    >
      Collabo<span className="text-brand">Ticket</span>
    </span>
  )
}

export function SiteLogo({ variant = "header", className }: SiteLogoProps) {
  return (
    <Link
      href="/"
      title="홈으로 이동"
      className={cn(
        "inline-flex shrink-0 items-center gap-2.5 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        className,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={variant === "header"}
        className="h-8 w-auto object-contain sm:h-9"
      />
      <LogoWordmark variant={variant} className={variant === "header" ? "hidden min-[420px]:inline" : undefined} />
    </Link>
  )
}
