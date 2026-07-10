import fs from "fs"
import path from "path"

const roots = ["components", "app", "lib"]
const hits = []

function scanDir(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue
      scanDir(p)
      continue
    }
    if (!/\.(tsx?|jsx?|md)$/.test(ent.name)) continue

    const lines = fs.readFileSync(p, "utf8").split("\n")
    lines.forEach((line, i) => {
      if (/\?{3,}/.test(line) && !line.includes("???")) return
      if (/\?{3,}/.test(line)) {
        hits.push(`${p}:${i + 1}: ${line.trim().slice(0, 120)}`)
      }
    })
  }
}

for (const root of roots) scanDir(root)

if (hits.length === 0) {
  console.log("No ??? patterns in source or markdown.")
} else {
  console.log(hits.join("\n"))
}
