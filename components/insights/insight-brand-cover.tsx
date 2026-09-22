"use client"

import { useState } from "react"

import { sanitizeInsightImage } from "@/lib/insight-image"
import { BRAND_COVER_PATH } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

type Props = {
  /** Option B: diagram / article image */
  mediaSrc?: string
  heroMode?: "brand" | "diagram"
  className?: string
  children?: React.ReactNode
}

/**
 * Shared brand cover surface for Insight Hero + list cards.
 * Default: gradient mesh. Optional /brand/insight-cover.jpg or diagram media.
 */
export function InsightBrandCover({ mediaSrc, heroMode = "brand", className, children }: Props) {
  const media = sanitizeInsightImage(mediaSrc)
  const preferDiagram = heroMode === "diagram" && Boolean(media)
  const [brandFailed, setBrandFailed] = useState(false)
  const [diagramFailed, setDiagramFailed] = useState(false)

  const showDiagram = preferDiagram && !diagramFailed && media
  const showBrandPhoto = !showDiagram && !brandFailed

  return (
    <div className={cn("insight-brand-cover", className)}>
      {showDiagram ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media}
          alt=""
          className="insight-brand-cover__media"
          onError={() => setDiagramFailed(true)}
        />
      ) : showBrandPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={BRAND_COVER_PATH}
          alt=""
          className="insight-brand-cover__media opacity-70"
          onError={() => setBrandFailed(true)}
        />
      ) : null}
      <div className="insight-brand-cover__pattern" aria-hidden="true" />
      <div className="insight-brand-cover__overlay" aria-hidden="true" />
      {children ? <div className="relative z-[1] h-full">{children}</div> : null}
    </div>
  )
}
