import fs from "fs"
import path from "path"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const URL_RE = /https?:\/\/[^\s)>"']+/g

async function check(url) {
  try {
    const head = await fetch(url, { method: "HEAD", redirect: "follow" })
    if (head.status === 200) return true
    const get = await fetch(url, { method: "GET", redirect: "follow" })
    return get.status === 200
  } catch {
    return false
  }
}

function isImageUrl(url) {
  return (
    url.includes("images.unsplash.com") ||
    url.includes("picsum.photos") ||
    /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)
  )
}

function picsumReplacement(slug, role, width, height) {
  return `https://picsum.photos/seed/ct-fix-${slug}-${role}/${width}/${height}`
}

const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"))
let replacedUrls = 0
let updatedFiles = 0

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file)
  const slug = file.replace(/\.md$/, "")
  let content = fs.readFileSync(filePath, "utf8")
  const urls = [...new Set([...content.matchAll(URL_RE)].map((match) => match[0].replace(/[),.;]+$/, "")))]
  let changed = false

  for (const url of urls) {
    if (!isImageUrl(url)) continue
    if (await check(url)) continue

    const role = url.includes("/900") || url.includes("본문") ? "body" : "cover"
    const width = role === "body" ? 1400 : 1400
    const height = role === "body" ? 900 : 788
    let replacement = picsumReplacement(slug, role, width, height)

    if (!(await check(replacement))) {
      replacement = `https://picsum.photos/seed/ct-fix-${slug}-${replacedUrls}/${width}/${height}`
    }

    if (content.includes(url)) {
      content = content.split(url).join(replacement)
      replacedUrls += 1
      changed = true
      console.log(`fixed ${file}\n  ${url}\n  -> ${replacement}`)
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8")
    updatedFiles += 1
  }
}

console.log(`\nUpdated files: ${updatedFiles}`)
console.log(`Replaced URLs: ${replacedUrls}`)
