type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown"
  return request.headers.get("x-real-ip") || "unknown"
}

/** Returns true when the request is still within the window. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 5_000) {
      for (const [entryKey, entry] of buckets) {
        if (now >= entry.resetAt) buckets.delete(entryKey)
      }
    }
    return true
  }

  if (bucket.count >= limit) return false
  bucket.count += 1
  return true
}

export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; body: unknown } | { ok: false; status: number; error: string }> {
  const declared = Number(request.headers.get("content-length") || "0")
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, status: 413, error: "payload too large" }
  }

  const text = await request.text()
  if (new TextEncoder().encode(text).length > maxBytes) {
    return { ok: false, status: 413, error: "payload too large" }
  }

  if (!text) return { ok: true, body: null }

  try {
    return { ok: true, body: JSON.parse(text) as unknown }
  } catch {
    return { ok: false, status: 400, error: "invalid json" }
  }
}

export function sanitizeMeta(value: unknown, maxBytes = 2_000): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined

  const clean: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, 20)) {
    if (!key || key.length > 40) continue
    if (typeof item === "string") clean[key] = item.slice(0, 200)
    else if (typeof item === "boolean") clean[key] = item
    else if (typeof item === "number" && Number.isFinite(item)) clean[key] = item
  }

  if (JSON.stringify(clean).length > maxBytes) return undefined
  return clean
}
