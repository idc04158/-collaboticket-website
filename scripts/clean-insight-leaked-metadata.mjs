import fs from "fs"
import path from "path"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

function sanitizeInsightBody(content) {
  let body = content
  body = body.replace(/^\s*\{"description"\s*:\s*"[\s\S]*?"\}\s*$/gm, "")
  body = body.replace(/^\s*\{"description"\s*:\s*"[^\n]*$/gm, "")
  body = body.replace(/^<aside[\s\S]*?<\/aside>\s*$/gm, "")
  body = body.replace(/^<script[\s\S]*?<\/script>\s*$/gm, "")
  return body.trimEnd()
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
let updated = 0

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file)
  const raw = fs.readFileSync(filePath, "utf8")
  const cleaned = sanitizeInsightBody(raw)
  if (cleaned === raw.trimEnd()) continue
  fs.writeFileSync(filePath, `${cleaned}\n`)
  updated++
  console.log("Cleaned", file)
}

console.log("Done:", updated, "files")
