import fs from "fs"
import path from "path"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

const REPLACEMENTS = [
  [
    "https://images.unsplash.com/photo-1521737711865-e3b97375f902?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1551836022-deb49876c1d1?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1555421689-491a97ff5280?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1497215728101-856f4ea4214f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1556742502-ec7c0e7f34b1?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1531403009284-68497727125a?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1556760544-7402140f8d9e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1573164713714-d95e436058b6?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=80",
  ],
]

async function verify(url) {
  const res = await fetch(url, { method: "HEAD" })
  return res.status
}

async function main() {
  for (const [, newUrl] of REPLACEMENTS) {
    const status = await verify(newUrl)
    if (status !== 200) {
      console.error("Replacement not valid:", newUrl, status)
      process.exit(1)
    }
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
  let updated = 0

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    let content = fs.readFileSync(filePath, "utf8")
    let changed = false

    for (const [oldUrl, newUrl] of REPLACEMENTS) {
      if (content.includes(oldUrl)) {
        content = content.replaceAll(oldUrl, newUrl)
        changed = true
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content)
      updated++
      console.log("Updated", file)
    }
  }

  const imagesPath = path.join(process.cwd(), "scripts", "insight-images.mjs")
  let imagesContent = fs.readFileSync(imagesPath, "utf8")
  for (const [oldUrl, newUrl] of REPLACEMENTS) {
    imagesContent = imagesContent.replaceAll(oldUrl, newUrl)
  }
  fs.writeFileSync(imagesPath, imagesContent)

  console.log("Done:", updated, "blog files + insight-images.mjs")
}

main()
