/**
 * Title / publish-date / content year alignment rules.
 * @see scripts/insight-content-rules-registry.mjs — id: title-publish-year-alignment
 */

export const TITLE_YEAR_RULES_PROMPT = `Title / publish-date / year alignment (critical):
- Publish date is the as-of date for this report. The title year must match that as-of year when FACT data is from the same period.
- Example: publish 2024-07-03, FACT cites Statista 2024 → title "2024년 일본 이커머스 시장 트렌드 분석" — NOT "2025년 …"
- Never put next-year branding in the title just because the slug filename contains a year.
- description and ✓ summary bullets must use the same primary data year as the title (not a different year).
- Omit the year in the title when the article is a timeless playbook/checklist (SEO guide, launch checklist, CRM template).
- Exception A — timed events: event year/month in title when publish date is in that event window (e.g. 2026-07 PayPay祭).
- Exception B — forward period: title may name a future quarter/year ONLY when the article's primary subject is that specific future period (e.g. "2026년 2분기 통관 변화" published in 2025-06).
- Outlook articles published in year Y about data year Y should use Y in the title, not Y+1.`

/** Slugs where title year may be publishYear + 1 (forward-looking subject). */
const FORWARD_YEAR_SLUG_PATTERNS = [
  /logistics-regulation-20\d{2}/,
  /chou-paypay-festival-20\d{2}/,
  /paypay-festival-20\d{2}/,
]

/** Slugs where year in title should be removed (evergreen). */
const EVERGREEN_YEAR_SLUG_PATTERNS = [/keyword-map-20\d{2}/]

export function extractYears(text) {
  return [...String(text).matchAll(/20\d{2}/g)].map((m) => Number(m[0]))
}

export function maxYear(text) {
  const years = extractYears(text)
  return years.length ? Math.max(...years) : null
}

export function publishYear(date) {
  return Number(String(date).slice(0, 4))
}

export function allowsForwardTitleYear(slug, titleYear, pubYear) {
  if (titleYear <= pubYear) return true
  if (titleYear !== pubYear + 1) return false
  return FORWARD_YEAR_SLUG_PATTERNS.some((re) => re.test(slug))
}

export function isEvergreenYearSlug(slug) {
  return EVERGREEN_YEAR_SLUG_PATTERNS.some((re) => re.test(slug))
}

export function suggestTitle({ title, date, slug }) {
  const pubYear = publishYear(date)
  const titleMax = maxYear(title)
  if (!titleMax || titleMax <= pubYear) return title

  if (allowsForwardTitleYear(slug, titleMax, pubYear)) return title

  if (isEvergreenYearSlug(slug)) {
    return title
      .replace(/\s*20\d{2}\s*:?\s*/, ": ")
      .replace(/^:\s*/, "")
      .replace(/\s{2,}/g, " ")
      .trim()
  }

  return title.replace(/20\d{2}/g, (y) => (Number(y) > pubYear ? String(pubYear) : y))
}

export function suggestDescription(description, date, titleAfter) {
  const pubYear = publishYear(date)
  const descMax = maxYear(description)
  const titleMax = maxYear(titleAfter)
  const targetYear = titleMax ?? pubYear

  if (!descMax || descMax <= pubYear) return description
  if (descMax > pubYear && targetYear <= pubYear) {
    return description.replace(/20\d{2}/g, (y) => (Number(y) > pubYear ? String(pubYear) : y))
  }
  return description
}

export function scanTitleYearAlignment({ slug, title, description, date }) {
  const pubYear = publishYear(date)
  const issues = []

  const titleMax = maxYear(title)
  if (titleMax && titleMax > pubYear && !allowsForwardTitleYear(slug, titleMax, pubYear)) {
    issues.push({
      slug,
      publishDate: String(date),
      field: "title",
      foundYear: titleMax,
      expectedMaxYear: pubYear,
      snippet: title,
      suggested: suggestTitle({ title, date, slug }),
    })
  }

  const descMax = maxYear(description)
  if (descMax && descMax > pubYear) {
    const fixedTitle = suggestTitle({ title, date, slug })
    const titleYearAfter = maxYear(fixedTitle) ?? pubYear
    if (descMax > titleYearAfter) {
      issues.push({
        slug,
        publishDate: String(date),
        field: "description",
        foundYear: descMax,
        expectedMaxYear: pubYear,
        snippet: String(description).slice(0, 100),
        suggested: suggestDescription(description, date, fixedTitle),
      })
    }
  }

  return issues
}

/** Known hub anchor updates after title corrections (slug → display label). */
export const HUB_TITLE_LABELS = {
  "japan-ecommerce-2025": "2024년 일본 이커머스 시장 트렌드 분석",
  "japan-ec-market-trends-2026": "2025년 일본 EC 시장 트렌드",
}

export function fixHubAnchorText(body, slug) {
  let next = body

  next = next.replace(
    /\[2025년 일본 이커머스 시장 트렌드\]/g,
    `[${HUB_TITLE_LABELS["japan-ecommerce-2025"]}]`,
  )
  next = next.replace(
    /\[2025년 일본 이커머스 시장 트렌드 분석\]/g,
    `[${HUB_TITLE_LABELS["japan-ecommerce-2025"]}]`,
  )
  next = next.replace(
    /\[2024년 일본 이커머스 시장 트렌드\]/g,
    `[${HUB_TITLE_LABELS["japan-ecommerce-2025"]}]`,
  )
  next = next.replace(
    /\[일본 전자상거래 시장 트렌드 2025\]\(\/insights\/japan-ec-market-trends-2025\)/g,
    `[${HUB_TITLE_LABELS["japan-ec-market-trends-2026"]}](/insights/japan-ec-market-trends-2026)`,
  )
  next = next.replace(/\/insights\/japan-ec-market-trends-2025/g, "/insights/japan-ec-market-trends-2026")

  if (slug === "japan-ec-keyword-map-2026") {
    next = next.replace(
      /\[2025년 일본 이커머스 시장 트렌드\]\(\/insights\/japan-ecommerce-2025\)/g,
      `[${HUB_TITLE_LABELS["japan-ecommerce-2025"]}](/insights/japan-ecommerce-2025)`,
    )
  }

  return next
}
