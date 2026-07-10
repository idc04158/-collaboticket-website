import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, "content", "blog")

const REPLACEMENTS = [
  ["/insights/ai-shopping-commerce-japan-2024", "/insights/ai-shopping-commerce-japan-2026"],
  ["/insights/ai-shopping-commerce-japan-2025", "/insights/ai-shopping-commerce-japan-2026"],
  ["/insights/japan-ec-market-trends-2024", "/insights/japan-ec-market-trends-2026"],
  ["/insights/japan-ecommerce-2024", "/insights/japan-ecommerce-2025"],
  ["/insights/qoo10-메가와리-live-commerce-strategy", "/insights/qoo10-megawari-live-commerce-strategy"],
  ["/insights/qoo10-메가와리-prep-plan", "/insights/qoo10-megawari-prep-plan"],
]

function listFiles(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue
      listFiles(full, exts, out)
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      out.push(full)
    }
  }
  return out
}

const files = [
  ...listFiles(BLOG_DIR, [".md"]),
  ...listFiles(path.join(ROOT, "components"), [".tsx", ".ts"]),
  ...listFiles(path.join(ROOT, "app"), [".tsx", ".ts"]),
  ...listFiles(path.join(ROOT, "lib"), [".ts", ".tsx"]),
]

let totalChanges = 0

for (const file of files) {
  let content = fs.readFileSync(file, "utf8")
  let changed = false

  for (const [from, to] of REPLACEMENTS) {
    if (!content.includes(from)) continue
    const count = content.split(from).length - 1
    content = content.split(from).join(to)
    totalChanges += count
    changed = true
  }

  if (changed) {
    fs.writeFileSync(file, content, "utf8")
    console.log(`fixed: ${path.relative(ROOT, file).replace(/\\/g, "/")}`)
  }
}

console.log(`\nTotal link replacements: ${totalChanges}`)
