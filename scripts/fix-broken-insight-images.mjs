import fs from "fs"
import path from "path"

import { INSIGHT_IMAGES } from "./insight-images.mjs"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

const MANUAL_REPLACEMENTS = new Map([
  [
    "https://images.unsplash.com/photo-1524758637124-a6b3e2c4a4b3?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1400&q=80",
  ],
])

async function verify(url) {
  const head = await fetch(url, { method: "HEAD", redirect: "follow" })
  if (head.status === 200) return true
  const get = await fetch(url, { redirect: "follow" })
  return get.status === 200
}

async function buildVerifiedPool() {
  const pool = []
  for (const url of INSIGHT_IMAGES) {
    if (await verify(url)) pool.push(url)
  }
  return [...new Set(pool)]
}

function collectUrls(content) {
  return [...content.matchAll(/https:\/\/images\.unsplash\.com\/[^\s)>"']+/g)].map((match) => match[0])
}

async function main() {
  const verifiedPool = await buildVerifiedPool()
  if (verifiedPool.length === 0) {
    console.error("No verified insight images available.")
    process.exit(1)
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"))
  const brokenUrls = new Set()

  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
    for (const url of collectUrls(content)) {
      if (!(await verify(url))) brokenUrls.add(url)
    }
  }

  const replacementMap = new Map(MANUAL_REPLACEMENTS)
  let poolIndex = 0

  for (const brokenUrl of brokenUrls) {
    if (replacementMap.has(brokenUrl)) continue
    const replacement = verifiedPool[poolIndex % verifiedPool.length]
    replacementMap.set(brokenUrl, replacement)
    poolIndex += 1
  }

  if (replacementMap.size === 0) {
    console.log("No broken insight images found.")
    return
  }

  for (const [brokenUrl, replacementUrl] of replacementMap) {
    if (!(await verify(replacementUrl))) {
      console.error("Replacement URL is invalid:", replacementUrl)
      process.exit(1)
    }
    console.log("Replace", brokenUrl, "->", replacementUrl)
  }

  let updatedFiles = 0

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    let content = fs.readFileSync(filePath, "utf8")
    let changed = false

    for (const [brokenUrl, replacementUrl] of replacementMap) {
      if (content.includes(brokenUrl)) {
        content = content.replaceAll(brokenUrl, replacementUrl)
        changed = true
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content)
      updatedFiles += 1
      console.log("Updated", file)
    }
  }

  const imagesPath = path.join(process.cwd(), "scripts", "insight-images.mjs")
  let imagesContent = fs.readFileSync(imagesPath, "utf8")
  for (const [brokenUrl, replacementUrl] of replacementMap) {
    imagesContent = imagesContent.replaceAll(brokenUrl, replacementUrl)
  }
  fs.writeFileSync(imagesPath, imagesContent)

  console.log(`Done. ${updatedFiles} blog files updated, insight-images.mjs synced.`)
}

main()
