type IllustrationProps = {
  className?: string
}

const BRAND = "#00B140"
const BRAND_DARK = "#009C38"
const BRAND_LIGHT = "#E6F7EE"
const SURFACE = "#0a1610"
const MUTED = "#94a89c"

export function SubscriptionIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" className={className} aria-hidden="true">
      <rect x="20" y="30" width="160" height="80" rx="12" fill={BRAND_LIGHT} />
      <rect x="36" y="48" width="48" height="8" rx="4" fill={BRAND} opacity="0.35" />
      <rect x="36" y="64" width="88" height="6" rx="3" fill={SURFACE} opacity="0.12" />
      <rect x="36" y="78" width="64" height="6" rx="3" fill={SURFACE} opacity="0.08" />
      <circle cx="148" cy="70" r="22" fill={BRAND} opacity="0.15" />
      <path
        d="M148 58a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
        fill={BRAND}
      />
      <path
        d="M152 70h-4l2-6 2 6zm-8 0h8"
        stroke={BRAND_DARK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 108c20-8 40 8 60 0s40 8 60 0 40 8 60 0"
        stroke={BRAND}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

export function DataDrivenIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" className={className} aria-hidden="true">
      <rect x="24" y="24" width="152" height="92" rx="12" fill={BRAND_LIGHT} />
      <rect x="40" y="88" width="16" height="16" rx="3" fill={BRAND} opacity="0.45" />
      <rect x="64" y="72" width="16" height="32" rx="3" fill={BRAND} opacity="0.65" />
      <rect x="88" y="56" width="16" height="48" rx="3" fill={BRAND} />
      <rect x="112" y="64" width="16" height="40" rx="3" fill={BRAND_DARK} opacity="0.8" />
      <rect x="136" y="48" width="16" height="56" rx="3" fill={BRAND_DARK} />
      <path
        d="M48 72l24-12 24 8 24-16 24 4"
        stroke={SURFACE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      <circle cx="48" cy="72" r="4" fill={BRAND_DARK} />
      <circle cx="72" cy="60" r="4" fill={BRAND_DARK} />
      <circle cx="96" cy="68" r="4" fill={BRAND_DARK} />
      <circle cx="120" cy="52" r="4" fill={BRAND_DARK} />
      <circle cx="144" cy="56" r="4" fill={BRAND} />
      <rect x="40" y="36" width="56" height="6" rx="3" fill={SURFACE} opacity="0.15" />
      <rect x="40" y="46" width="36" height="4" rx="2" fill={MUTED} opacity="0.35" />
    </svg>
  )
}

export function JapanLocalIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" className={className} aria-hidden="true">
      <ellipse cx="100" cy="72" rx="52" ry="58" fill={BRAND_LIGHT} />
      <path
        d="M88 28c8-6 18-4 22 4 6 10-2 22-12 26-8 4-18 0-22-10-3-8 2-16 12-20z"
        fill={BRAND}
        opacity="0.85"
      />
      <path
        d="M108 42c6-4 14-2 16 6 3 8-4 16-12 14-6-2-10-10-6-16 2-3 4-4 2-4z"
        fill={BRAND_DARK}
        opacity="0.7"
      />
      <path
        d="M96 58c4-6 12-6 16 0 4 6-2 14-10 12-6-2-10-8-6-12z"
        fill={BRAND}
        opacity="0.55"
      />
      <circle cx="72" cy="88" r="6" fill={BRAND} />
      <circle cx="100" cy="98" r="5" fill={BRAND_DARK} />
      <circle cx="128" cy="84" r="6" fill={BRAND} opacity="0.75" />
      <circle cx="112" cy="68" r="4" fill="#fff" stroke={BRAND} strokeWidth="2" />
      <circle cx="84" cy="72" r="4" fill="#fff" stroke={BRAND} strokeWidth="2" />
      <path
        d="M112 68L100 98M84 72l-12 16M112 68l16 16"
        stroke={BRAND}
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.5"
      />
      <circle cx="100" cy="72" r="10" fill="#fff" stroke={BRAND} strokeWidth="2.5" />
      <circle cx="100" cy="72" r="4" fill={BRAND} />
    </svg>
  )
}

export function AiAutomationIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" className={className} aria-hidden="true">
      <rect x="28" y="36" width="44" height="44" rx="10" fill="#fff" stroke={BRAND} strokeWidth="2" />
      <rect x="78" y="36" width="44" height="44" rx="10" fill={BRAND_LIGHT} stroke={BRAND} strokeWidth="2" />
      <rect x="128" y="36" width="44" height="44" rx="10" fill="#fff" stroke={BRAND_DARK} strokeWidth="2" />
      <circle cx="50" cy="58" r="8" fill={BRAND} opacity="0.25" />
      <rect x="42" y="66" width="16" height="4" rx="2" fill={MUTED} opacity="0.4" />
      <path d="M88 52h24M88 60h16M88 68h20" stroke={BRAND} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="150" cy="58" r="10" fill={BRAND} />
      <path
        d="M146 58l3 3 6-6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M72 58h6M122 58h6"
        stroke={BRAND}
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#arrow-ai-auto)"
      />
      <path
        d="M100 88v16M88 104h24"
        stroke={BRAND_DARK}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <rect x="72" y="104" width="56" height="20" rx="6" fill={BRAND} opacity="0.12" />
      <rect x="84" y="111" width="32" height="6" rx="3" fill={BRAND_DARK} opacity="0.5" />
      <defs>
        <marker id="arrow-ai-auto" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0l6 3-6 3z" fill={BRAND} />
        </marker>
      </defs>
    </svg>
  )
}

export function MonthlyReportIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" className={className} aria-hidden="true">
      <rect x="52" y="20" width="96" height="108" rx="8" fill="#fff" stroke={BRAND} strokeWidth="2" />
      <rect x="52" y="20" width="96" height="24" rx="8" fill={BRAND} />
      <rect x="52" y="36" width="96" height="8" fill={BRAND} />
      <rect x="64" y="54" width="40" height="5" rx="2.5" fill={SURFACE} opacity="0.15" />
      <rect x="64" y="66" width="72" height="4" rx="2" fill={MUTED} opacity="0.3" />
      <rect x="64" y="78" width="28" height="20" rx="4" fill={BRAND_LIGHT} />
      <rect x="98" y="78" width="28" height="20" rx="4" fill={BRAND} opacity="0.25" />
      <rect x="132" y="78" width="16" height="20" rx="4" fill={BRAND} opacity="0.45" />
      <rect x="64" y="104" width="56" height="4" rx="2" fill={MUTED} opacity="0.25" />
      <rect x="64" y="114" width="40" height="4" rx="2" fill={MUTED} opacity="0.2" />
      <circle cx="132" cy="110" r="12" fill={BRAND_LIGHT} stroke={BRAND} strokeWidth="1.5" />
      <path
        d="M128 110l3 3 6-7"
        stroke={BRAND_DARK}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IntegratedOpsIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" className={className} aria-hidden="true">
      <circle cx="100" cy="72" r="24" fill={BRAND} />
      <circle cx="100" cy="72" r="14" fill="#fff" />
      <circle cx="100" cy="72" r="6" fill={BRAND_DARK} />
      <circle cx="48" cy="44" r="14" fill={BRAND_LIGHT} stroke={BRAND} strokeWidth="2" />
      <circle cx="152" cy="44" r="14" fill={BRAND_LIGHT} stroke={BRAND} strokeWidth="2" />
      <circle cx="40" cy="100" r="14" fill="#fff" stroke={BRAND} strokeWidth="2" />
      <circle cx="160" cy="100" r="14" fill="#fff" stroke={BRAND_DARK} strokeWidth="2" />
      <circle cx="100" cy="118" r="12" fill={BRAND_LIGHT} stroke={BRAND} strokeWidth="2" />
      <path
        d="M60 50l28 16M140 50l-28 16M52 92l36-14M148 92l-36-14M100 96v10"
        stroke={BRAND}
        strokeWidth="2"
        opacity="0.55"
      />
      <circle cx="48" cy="44" r="4" fill={BRAND} />
      <circle cx="152" cy="44" r="4" fill={BRAND} />
      <circle cx="40" cy="100" r="4" fill={BRAND_DARK} />
      <circle cx="160" cy="100" r="4" fill={BRAND_DARK} />
      <circle cx="100" cy="118" r="3" fill={BRAND} />
    </svg>
  )
}

export const operatingPrincipleIllustrations = {
  subscription: SubscriptionIllustration,
  "data-driven": DataDrivenIllustration,
  "japan-local": JapanLocalIllustration,
  "ai-automation": AiAutomationIllustration,
  "monthly-report": MonthlyReportIllustration,
  "integrated-ops": IntegratedOpsIllustration,
} as const
