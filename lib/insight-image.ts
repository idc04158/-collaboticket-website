/** Stock/placeholder hosts used by older insight generators — never show these. */
const PLACEHOLDER_HOST = /picsum\.photos|loremflickr\.com|placehold\.co|via\.placeholder\.com/i

export function isPlaceholderInsightImage(url?: string | null) {
  return Boolean(url && PLACEHOLDER_HOST.test(url))
}

export function sanitizeInsightImage(url?: string | null): string | undefined {
  const value = typeof url === "string" ? url.trim() : ""
  if (!value || isPlaceholderInsightImage(value)) return undefined
  return value
}
