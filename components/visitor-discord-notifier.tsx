"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { getOrCreateVisitorId } from "@/lib/visitor-tracking"

const SESSION_FLAG = "ct_discord_visit_sent"

export function VisitorDiscordNotifier() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(SESSION_FLAG)) return

    const visitorId = getOrCreateVisitorId()
    if (!visitorId || visitorId === "ssr") return

    sessionStorage.setItem(SESSION_FLAG, "1")

    void fetch("/api/visitor/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        path: pathname || window.location.pathname,
        title: document.title,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    })
  }, [pathname])

  return null
}
