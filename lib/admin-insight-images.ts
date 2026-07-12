export type CoverImageOption = {
  id: string
  url: string
  thumb: string
  photographer?: string
  source: "unsplash" | "pool"
}

const POOL_IDS = [
  "1460925895917-afdab827c52f",
  "1556742049-0cfed4f6a45d",
  "1557804506-669a67965ba0",
  "1520607162513-77705c0f0d4a",
  "1556155092-490a1ba16284",
  "1607082349566-187342175e2f",
  "1552664730-d307ca884978",
  "1516321318423-f06f85e504b3",
  "1454165804606-c3d57bc86b40",
  "1586528116311-ad8dd3c8310d",
  "1556741533-6e6a62bd8b49",
  "1611162616475-46b635cb6868",
  "1441986300917-64674bd600d8",
  "1507679799987-c73779587ccf",
  "1486406146926-c627a92ad1ab",
  "1600880292203-757bb62b4baf",
  "1553877522-43269d4ea984",
  "1559136555-9303baea8ebd",
  "1542744173-8e7e53415bb0",
  "1556761175-b413da4baf72",
  "1523275335684-37898b6baf30",
  "1517245386807-bb43f82c33c4",
  "1551288049-bebda4e38f71",
  "1522202176988-66273c2fd55f",
]

function unsplashUrl(photoId: string, width: number) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`
}

function hashKeyword(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function poolFallback(query: string, count: number): CoverImageOption[] {
  const start = hashKeyword(query.toLowerCase().trim() || "japan-ec") % POOL_IDS.length
  const options: CoverImageOption[] = []
  for (let i = 0; i < count; i++) {
    const id = POOL_IDS[(start + i * 3) % POOL_IDS.length]
    options.push({
      id: `pool-${id}-${i}`,
      url: unsplashUrl(id, 1400),
      thumb: unsplashUrl(id, 600),
      source: "pool",
    })
  }
  return options
}

export async function searchCoverImages(query: string, count = 8): Promise<CoverImageOption[]> {
  const q = query.trim()
  if (!q) return poolFallback("japan ecommerce", count)

  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim()
  if (!accessKey) {
    return poolFallback(q, count)
  }

  try {
    const url = new URL("https://api.unsplash.com/search/photos")
    url.searchParams.set("query", q)
    url.searchParams.set("per_page", String(count))
    url.searchParams.set("orientation", "landscape")
    url.searchParams.set("content_filter", "high")

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      next: { revalidate: 0 },
    })

    if (!res.ok) return poolFallback(q, count)

    const data = (await res.json()) as {
      results?: Array<{
        id: string
        urls?: { regular?: string; small?: string }
        user?: { name?: string }
      }>
    }

    const results: CoverImageOption[] = []
    for (const item of data.results || []) {
      const regular = item.urls?.regular
      const small = item.urls?.small
      if (!regular) continue
      results.push({
        id: item.id,
        url: `${regular}${regular.includes("?") ? "&" : "?"}w=1400`,
        thumb: small || regular,
        photographer: item.user?.name,
        source: "unsplash",
      })
    }

    if (results.length === 0) return poolFallback(q, count)
    if (results.length >= count) return results.slice(0, count)
    return [...results, ...poolFallback(q, count - results.length)]
  } catch {
    return poolFallback(q, count)
  }
}
