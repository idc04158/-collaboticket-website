/**
 * Runtime + batch hygiene for insight quality:
 * - float percentage noise (1.7999999999999998%)
 * - slug-as-link-text → human titles
 * - common translation-ese openers from gap seed templates
 */

/** @param {string} text */
export function fixFloatPercentages(text) {
  return text.replace(/(\d+\.\d{3,})\s*%/g, (_full, raw) => {
    const value = Number(raw)
    if (!Number.isFinite(value)) return _full
    const rounded = Math.round(value * 10) / 10
    const display = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
    return `${display}%`
  })
}

/**
 * Replace markdown links whose label is a path/slug with the article title.
 * @param {string} text
 * @param {Map<string, string> | Record<string, string>} titleBySlug
 */
export function fixInsightMarkdownLinkLabels(text, titleBySlug) {
  const lookup = titleBySlug instanceof Map ? titleBySlug : new Map(Object.entries(titleBySlug))

  return text.replace(/\[([^\]]+)\]\(\/insights\/([^)#\s]+)\)/g, (full, label, slug) => {
    const title = lookup.get(slug)
    if (!title) return full

    const normalized = String(label).trim()
    const isPathLike =
      normalized === `/insights/${slug}` ||
      normalized === slug ||
      normalized === `insights/${slug}` ||
      /^\/insights\//.test(normalized)

    if (!isPathLike) return full
    return `[${title}](/insights/${slug})`
  })
}

/**
 * Soften the most common gap-seed translation openers without rewriting whole posts.
 * @param {string} text
 */
export function softenGapSeedBoilerplate(text) {
  let next = text

  next = next.replace(
    /익명 처리한 ([^\n]+?) 브랜드 사례를 공유합니다\./g,
    "실제 운영에서 본 $1 브랜드 사례입니다. (브랜드명은 익명 처리)",
  )

  // "멀티브랜드 브랜드" duplication
  next = next.replace(/멀티브랜드 브랜드/g, "멀티브랜드")

  // Bare slug in prose: "따라서 japan-half-year-ec-report-2026 주제를 실행할 때도"
  next = next.replace(
    /따라서\s+[a-z0-9]+(?:-[a-z0-9]+)+\s+주제를 실행할 때도/g,
    "따라서 이번 주제를 실행할 때도",
  )

  // AI summary line that leaks the slug
  next = next.replace(
    /✓ 이 글은 [a-z0-9]+(?:-[a-z0-9]+)+ 주제에 맞춰 FACT-INSIGHT-ACTION 순으로 우선순위를 제시하며, 실무 팀이 바로 적용할 수 있게 구성했습니다\.\n?/g,
    "",
  )

  // Grammar: 성장률를 → 성장률을
  next = next.replace(/성장률를/g, "성장률을")

  return next
}

/**
 * @param {string} content
 * @param {Map<string, string> | Record<string, string>} [titleBySlug]
 */
export function applyInsightQualityHygiene(content, titleBySlug = {}) {
  let next = fixFloatPercentages(content)
  next = softenGapSeedBoilerplate(next)
  next = fixInsightMarkdownLinkLabels(next, titleBySlug)
  return next
}
