/** Insight image helpers — verified Unsplash pool + Picsum seeds for guaranteed uniqueness. */

const VERIFIED_UNSPLASH_IDS = [
  "1460925895917-afdab827c52f", "1556742049-0cfed4f6a45d", "1557804506-669a67965ba0",
  "1520607162513-77705c0f0d4a", "1556155092-490a1ba16284", "1607082349566-187342175e2f",
  "1552664730-d307ca884978", "1516321318423-f06f85e504b3", "1454165804606-c3d57bc86b40",
  "1586528116311-ad8dd3c8310d", "1556741533-6e6a62bd8b49", "1611162616475-46b635cb6868",
  "1556740758-90de374c12ad", "1441986300917-64674bd600d8", "1507679799987-c73779587ccf",
  "1486406146926-c627a92ad1ab", "1600880292203-757bb62b4baf", "1553877522-43269d4ea984",
  "1559136555-9303baea8ebd", "1563986768609-322da13575f3", "1579621970563-ebec7560ff3e",
  "1542744173-8e7e53415bb0", "1556761175-b413da4baf72", "1600880292089-90a7e086ee0c",
  "1547658719-da2b51169166", "1556761175-5973dc0f32e7", "1472851294608-062f824d29cc",
  "1498050108023-c5249f4df085", "1523275335684-37898b6baf30", "1563013544-824ae1b704d3",
  "1432888498266-38ffec3eaf0a", "1517245386807-bb43f82c33c4", "1560472354-b33ff0c44a43",
  "1559526324-593bc073d938", "1551288049-bebda4e38f71", "1504384308090-c894fdcc538d",
  "1522202176988-66273c2fd55f", "1552581234-26160f608093", "1543286386-713bdd548da4",
  "1596526131083-e8c633c948d2", "1618005182384-a83a8bd57fbe", "1556228578-0d85b1a4d571",
  "1522335789203-aabd1fc54bc9", "1485827404703-89b55fcc595e", "1556228720-195a672e8a03",
  "1515377905703-c4788e51af15", "1560066984-138dadb4c035", "1521737716862-f4d55f914f0a",
  "1551836022-deb4988ff7a0", "1555421687-50043aa82036", "1556764542-52a584bb7a1f",
  "1551434678-e076c223a692", "1556761175-4b46a5720a6c", "1504868584809-f2597d062cee",
  "1556761175-d9a03b072599", "1556761175-8bdfa46b0500", "1611229855428-9080f314f04e",
  "1586281380349-632531db7ed4", "1533750348312-6b5b769ede78", "1497366216548-37526070297c",
  "1497366754035-f200968a6e72", "1486312338219-ce68d2c6f44d", "1416331108674-37159f7e0d07",
  "1407797147364-28505d7c1e0c", "1397622597469-3306f7ae5487", "1387673909858-4155807e3467",
  "1556761175-6a56d0bf403e", "1556761175-00c6da944b05", "1556761175-1c0764a88421",
  "1556761175-2d0d0be29bb6",
]

export const UNIQUE_PHOTO_IDS = [...new Set(VERIFIED_UNSPLASH_IDS)]

export function unsplashUrl(photoId, width = 1400) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`
}

export function picsumUrl(seed, width = 1400, height = 788) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
}

export function coverImageForPost(slug, index) {
  if (index < UNIQUE_PHOTO_IDS.length) return unsplashUrl(UNIQUE_PHOTO_IDS[index])
  return picsumUrl(`ct-cover-${slug}`, 1400, 788)
}

export function bodyImageForPost(slug, index) {
  const offset = index + 37
  if (offset < UNIQUE_PHOTO_IDS.length) return unsplashUrl(UNIQUE_PHOTO_IDS[offset])
  return picsumUrl(`ct-body-${slug}`, 1400, 900)
}

export function imageAt(index) {
  if (index < UNIQUE_PHOTO_IDS.length) return unsplashUrl(UNIQUE_PHOTO_IDS[index])
  return picsumUrl(`ct-index-${index}`)
}

export const INSIGHT_IMAGE_POOL = UNIQUE_PHOTO_IDS.map((id) => unsplashUrl(id))

export function baseImageId(url) {
  const unsplash = String(url || "").match(/photo-([a-z0-9-]+)/i)
  if (unsplash) return unsplash[1]
  const picsum = String(url || "").match(/seed\/([^/]+)/i)
  return picsum?.[1] ?? String(url)
}

export function pickDistinctCover(index, slug, used) {
  const primary = coverImageForPost(slug, index)
  const id = baseImageId(primary)
  if (!used.has(id)) {
    used.add(id)
    return primary
  }
  const fallback = picsumUrl(`ct-cover-${slug}`, 1400, 788)
  used.add(baseImageId(fallback))
  return fallback
}

export function pickDistinctBody(coverUrl, slug, index) {
  const candidate = bodyImageForPost(slug, index)
  if (baseImageId(candidate) !== baseImageId(coverUrl)) return candidate
  return picsumUrl(`ct-body-${slug}`, 1400, 900)
}
