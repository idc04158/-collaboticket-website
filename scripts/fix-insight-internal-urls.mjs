import fs from "fs"
import path from "path"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

const REPLACEMENTS = [
  [/https?:\/\/collaboticket\/insights\//gi, "/insights/"],
  [/https?:\/\/www\.collaboticket\.com\/insights\//gi, "/insights/"],
  [/https?:\/\/collaboticket\.com\/insights\//gi, "/insights/"],
]

let total = 0
for (const file of fs.readdirSync(BLOG_DIR).filter((name) => name.endsWith(".md"))) {
  const full = path.join(BLOG_DIR, file)
  let content = fs.readFileSync(full, "utf8")
  let changed = false

  for (const [pattern, replacement] of REPLACEMENTS) {
    const next = content.replace(pattern, replacement)
    if (next !== content) {
      const count = (content.match(pattern) || []).length
      total += count
      content = next
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(full, content, "utf8")
    console.log(`fixed: content/blog/${file}`)
  }
}

console.log(`\nTotal URL normalizations: ${total}`)
