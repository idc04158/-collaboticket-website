import fs from "fs"
import path from "path"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const URL_RE = /https?:\/\/[^\s)>"']+/g

async function check(url) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    const head = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal })
    clearTimeout(timer)
    if (head.status === 200) return { ok: true, status: 200 }

    const controller2 = new AbortController()
    const timer2 = setTimeout(() => controller2.abort(), 15000)
    const get = await fetch(url, { method: "GET", redirect: "follow", signal: controller2.signal })
    clearTimeout(timer2)
    return { ok: get.status === 200, status: get.status }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, status: message.includes("abort") ? "timeout" : message }
  }
}

function isImageUrl(url) {
  return (
    url.includes("images.unsplash.com") ||
    url.includes("picsum.photos") ||
    /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)
  )
}

const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"))
const urlToRefs = new Map()

for (const file of files) {
  const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
  const urls = [...content.matchAll(URL_RE)].map((match) => match[0].replace(/[),.;]+$/, ""))
  for (const url of urls) {
    if (!isImageUrl(url)) continue
    if (!urlToRefs.has(url)) urlToRefs.set(url, [])
    const refs = urlToRefs.get(url)
    if (!refs.includes(file)) refs.push(file)
  }
}

console.log(`Scanning ${urlToRefs.size} unique image URLs across ${files.length} posts...`)

const broken = []
let ok = 0
let index = 0

for (const [url, refs] of urlToRefs) {
  index += 1
  if (index % 25 === 0) {
    process.stderr.write(`checked ${index}/${urlToRefs.size}\n`)
  }
  const result = await check(url)
  if (result.ok) {
    ok += 1
  } else {
    broken.push({ url, status: result.status, refs })
  }
}

console.log("\n=== SUMMARY ===")
console.log(`OK: ${ok}`)
console.log(`Broken: ${broken.length}`)
console.log(`Affected files: ${new Set(broken.flatMap((item) => item.refs)).size}`)

for (const item of broken) {
  console.log(`\n[${item.status}] ${item.url}`)
  for (const ref of item.refs) {
    console.log(`  - ${ref}`)
  }
}

if (broken.length > 0) process.exitCode = 1
