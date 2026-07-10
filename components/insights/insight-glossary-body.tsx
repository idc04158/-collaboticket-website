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

const HIDE_DELAY_MS = 160

export function InsightGlossaryBody({ html, slug, className }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const hideTooltip = useCallback(() => {
    cancelHide()
    setTooltip(null)
  }, [cancelHide])

  const scheduleHide = useCallback(() => {
    cancelHide()
    hideTimerRef.current = setTimeout(() => {
      setTooltip(null)
      hideTimerRef.current = null
    }, HIDE_DELAY_MS)
  }, [cancelHide])

  const showTooltip = useCallback(
    (target: HTMLElement) => {
      const id = target.dataset.glossaryId
      const label = target.dataset.glossaryLabel
      const definition = target.dataset.glossaryDef
      if (!id || !label || !definition) return

      cancelHide()
      const rect = target.getBoundingClientRect()
      setTooltip({
        id,
        label,
        definition,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 6,
      })
    },
    [cancelHide],
  )

  const isMovingToTooltip = useCallback((related: EventTarget | null) => {
    if (!(related instanceof Node)) return false
    return Boolean(tooltipRef.current?.contains(related))
  }, [])

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const onPointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".glossary-term")
      if (!target || !root.contains(target)) return
      showTooltip(target)
    }

    const onPointerOut = (event: PointerEvent) => {
      const from = (event.target as HTMLElement | null)?.closest<HTMLElement>(".glossary-term")
      if (!from || !root.contains(from)) return
      if (isMovingToTooltip(event.relatedTarget)) {
        cancelHide()
        return
      }
      scheduleHide()
    }

    const onFocusIn = (event: FocusEvent) => {
      const term = (event.target as HTMLElement | null)?.closest<HTMLElement>(".glossary-term")
      if (term && root.contains(term)) {
        showTooltip(term)
        return
      }
      if (isMovingToTooltip(event.target)) {
        cancelHide()
      }
    }

    const onFocusOut = (event: FocusEvent) => {
      if (isMovingToTooltip(event.relatedTarget)) return
      const from = (event.target as HTMLElement | null)?.closest<HTMLElement>(".glossary-term")
      if (from && root.contains(from)) {
        scheduleHide()
      }
    }

    root.addEventListener("pointerover", onPointerOver)
    root.addEventListener("pointerout", onPointerOut)
    root.addEventListener("focusin", onFocusIn)
    root.addEventListener("focusout", onFocusOut)

    return () => {
      root.removeEventListener("pointerover", onPointerOver)
      root.removeEventListener("pointerout", onPointerOut)
      root.removeEventListener("focusin", onFocusIn)
      root.removeEventListener("focusout", onFocusOut)
      cancelHide()
    }
  }, [cancelHide, html, isMovingToTooltip, scheduleHide, showTooltip])

  useEffect(() => {
    return () => cancelHide()
  }, [cancelHide])

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="리포트 본문"
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {mounted &&
        tooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            className="glossary-tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
            role="tooltip"
            onPointerEnter={cancelHide}
            onPointerLeave={scheduleHide}
            onFocus={cancelHide}
            onBlur={(event) => {
              if (!isMovingToTooltip(event.relatedTarget)) scheduleHide()
            }}
          >
            <p className="glossary-tooltip-label">{tooltip.label}</p>
            <p className="glossary-tooltip-def">{tooltip.definition}</p>
            <Link href={getGlossaryHref(tooltip.id)} className="glossary-tooltip-link">
              용어 사전에서 자세히 보기 →
            </Link>
          </div>,
          document.body,
        )}

      {slug !== MARKETING_GLOSSARY_SLUG && (
        <p className="mt-4 text-xs text-muted-foreground">
          마케팅 용어에 마우스를 올리면 간단한 설명을 볼 수 있습니다.{" "}
          <Link href={getGlossaryHref()} className="font-semibold text-brand underline-offset-4 hover:underline">
            일본 EC 마케팅 용어 사전
          </Link>
          에서 전체 목록을 확인하세요.
        </p>
      )}
    </>
  )
}
