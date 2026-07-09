import fs from "fs"
import path from "path"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

async function check(url) {
  const head = await fetch(url, { method: "HEAD", redirect: "follow" })
  if (head.status === 200) return { url, status: 200 }
  const get = await fetch(url, { redirect: "follow" })
  return { url, status: get.status }
}

const fileIssues = []

for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
  const urls = [...content.matchAll(/https:\/\/images\.unsplash\.com\/[^\s)>"']+/g)].map((m) => m[0])
  const unique = [...new Set(urls)]

  for (const url of unique) {
    const result = await check(url)
    if (result.status !== 200) {
      fileIssues.push({ file, url, status: result.status })
    }
  }
}

console.log(`Files with broken images: ${new Set(fileIssues.map((i) => i.file)).size}`)
for (const issue of fileIssues) {
  console.log(`${issue.status}\t${issue.file}\t${issue.url}`)
}
