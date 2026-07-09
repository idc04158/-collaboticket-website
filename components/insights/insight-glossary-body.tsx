"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { getGlossaryHref, MARKETING_GLOSSARY_SLUG } from "@/lib/marketing-glossary"

type TooltipState = {
  id: string
  label: string
  definition: string
  x: number
  y: number
}

type Props = {
  html: string
  slug?: string
  className?: string
}

export function InsightGlossaryBody({ html, slug, className }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hideTooltip = useCallback(() => setTooltip(null), [])

  const showTooltip = useCallback((target: HTMLElement) => {
    const id = target.dataset.glossaryId
    const label = target.dataset.glossaryLabel
    const definition = target.dataset.glossaryDef
    if (!id || !label || !definition) return

    const rect = target.getBoundingClientRect()
    setTooltip({
      id,
      label,
      definition,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10,
    })
  }, [])

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const onPointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".glossary-term")
      if (!target || !root.contains(target)) return
      showTooltip(target)
    }

    const onFocusIn = (event: FocusEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".glossary-term")
      if (!target || !root.contains(target)) return
      showTooltip(target)
    }

    root.addEventListener("pointerover", onPointerOver)
    root.addEventListener("focusin", onFocusIn)
    root.addEventListener("pointerout", hideTooltip)
    root.addEventListener("focusout", hideTooltip)

    return () => {
      root.removeEventListener("pointerover", onPointerOver)
      root.removeEventListener("focusin", onFocusIn)
      root.removeEventListener("pointerout", hideTooltip)
      root.removeEventListener("focusout", hideTooltip)
    }
  }, [hideTooltip, html, showTooltip])

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="??? ??"
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {mounted &&
        tooltip &&
        createPortal(
          <div
            className="glossary-tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
            role="tooltip"
          >
            <p className="glossary-tooltip-label">{tooltip.label}</p>
            <p className="glossary-tooltip-def">{tooltip.definition}</p>
            <Link href={getGlossaryHref(tooltip.id)} className="glossary-tooltip-link">
              ?? ???? ??? ??
            </Link>
          </div>,
          document.body,
        )}

      {slug !== MARKETING_GLOSSARY_SLUG && (
        <p className="mt-4 text-xs text-muted-foreground">
          ??? ??? ???? ??? ??? ??? ? ? ????.{" "}
          <Link href={getGlossaryHref()} className="font-semibold text-brand underline-offset-4 hover:underline">
            ?? EC ??? ?? ??
          </Link>
          ?? ?? ??? ?????.
        </p>
      )}
    </>
  )
}
