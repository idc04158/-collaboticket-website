import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, "content", "blog")

const MARKDOWN_LINK_RE = /\[([^\]]*)\]\((\/[^)\s#]+)(#[^)\s]+)?\)/g
const RAW_PATH_RE = /(?<![(\["'`])(\/insights\/[a-z0-9-]+)/gi
const HREF_RE = /href=["'](\/[^"'#?]+)(#[^"'?]+)?["']/g

const STATIC_ROUTES = new Set([
  "/",
  "/contact",
  "/insights",
  "/webinar",
  "/influencers",
  "/admin/crm",
  "/admin/insights",
])

const glossarySource = fs.readFileSync(path.join(ROOT, "lib", "marketing-glossary.ts"), "utf8")
const glossaryIds = new Set([...glossarySource.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]))

function listFiles(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out
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

function collectLinks(filePath, content) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/")
  const links = []

  for (const match of content.matchAll(MARKDOWN_LINK_RE)) {
    links.push({
      file: rel,
      text: match[1],
      path: match[2],
      hash: match[3]?.slice(1),
      raw: match[0],
    })
  }

  for (const match of content.matchAll(HREF_RE)) {
    links.push({
      file: rel,
      text: "",
      path: match[1],
      hash: match[2]?.slice(1),
      raw: match[0],
    })
  }

  if (rel.startsWith("content/blog/")) {
    for (const match of content.matchAll(RAW_PATH_RE)) {
      const insightPath = match[1]
      if (links.some((link) => link.path === insightPath)) continue
      links.push({
        file: rel,
        text: "",
        path: insightPath,
        hash: undefined,
        raw: insightPath,
      })
    }
  }

  return links
}

function validateLink(link, insightSlugs) {
  const issues = []
  const { path: href, hash } = link

  if (!href.startsWith("/")) {
    issues.push("not-internal")
    return issues
  }

  if (STATIC_ROUTES.has(href)) return issues

  if (href.startsWith("/insights/")) {
    const slug = href.slice("/insights/".length)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      issues.push("invalid-slug-characters")
    }
    if (!insightSlugs.has(slug)) {
      issues.push("missing-insight-slug")
    }
    if (hash && slug === "japan-ecommerce-marketing-glossary") {
      const termId = hash
      if (!glossaryIds.has(termId)) issues.push("missing-glossary-term")
    }
    return issues
  }

  if (href.startsWith("/#")) {
    return issues
  }

  issues.push("unknown-route")
  return issues
}

const insightSlugs = new Set(
  fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, "")),
)

const sourceFiles = [
  ...listFiles(BLOG_DIR, [".md"]),
  ...listFiles(path.join(ROOT, "components"), [".tsx", ".ts"]),
  ...listFiles(path.join(ROOT, "app"), [".tsx", ".ts"]),
  ...listFiles(path.join(ROOT, "lib"), [".ts", ".tsx"]),
]

const allLinks = []
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8")
  allLinks.push(...collectLinks(file, content))
}

const uniquePaths = new Set(allLinks.map((link) => link.path))
const broken = []

for (const link of allLinks) {
  const issues = validateLink(link, insightSlugs)
  if (issues.length > 0) {
    broken.push({ ...link, issues })
  }
}

const grouped = new Map()
for (const item of broken) {
  const key = `${item.issues.join(",")}|${item.path}${item.hash ? `#${item.hash}` : ""}`
  if (!grouped.has(key)) {
    grouped.set(key, { ...item, files: new Set() })
  }
  grouped.get(key).files.add(item.file)
}

console.log(`Scanned ${allLinks.length} internal links (${uniquePaths.size} unique paths)`)
console.log(`Insight slugs on disk: ${insightSlugs.size}`)
console.log(`Broken links: ${broken.length} (${grouped.size} unique)`)

if (grouped.size === 0) {
  console.log("\nAll internal links resolve to existing routes/slugs.")
  process.exit(0)
}

for (const item of [...grouped.values()].sort((a, b) => a.path.localeCompare(b.path))) {
  console.log(`\n[${item.issues.join(", ")}] ${item.path}${item.hash ? `#${item.hash}` : ""}`)
  if (item.text) console.log(`  text: ${item.text}`)
  for (const file of [...item.files].sort()) {
    console.log(`  - ${file}`)
  }
}

process.exitCode = 1
