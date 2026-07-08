import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { assignPublishDate, PUBLISH_ORDER, sortPostsByPublishOrder } from "./insight-content-rules.mjs"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

const files = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const slug = file.replace(/\.md$/, "")
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
    return { slug, file, meta: matter(raw).data }
  })

const sorted = sortPostsByPublishOrder(files)

for (const [index, post] of sorted.entries()) {
  const date = assignPublishDate(index)
  if (post.meta.date === date) continue
  const raw = fs.readFileSync(path.join(BLOG_DIR, post.file), "utf8")
  const parsed = matter(raw)
  parsed.data.date = date
  fs.writeFileSync(path.join(BLOG_DIR, post.file), matter.stringify(parsed.content, parsed.data))
  console.log(post.slug, "→", date)
}

console.log("Publish dates synced for", sorted.length, "posts")
