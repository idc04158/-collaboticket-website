"use client"

import { useState } from "react"
import { FileText } from "lucide-react"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80"

type Props = {
  src?: string
  alt: string
  className?: string
}

export function InsightCoverImage({ src, alt, className }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_IMAGE)
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-brand/10 via-muted/40 to-muted/20 text-muted-foreground ${className ?? ""}`}
        role="img"
        aria-label={alt}
      >
        <FileText className="size-8" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (currentSrc !== FALLBACK_IMAGE) {
          setCurrentSrc(FALLBACK_IMAGE)
          return
        }
        setFailed(true)
      }}
    />
  )
}
