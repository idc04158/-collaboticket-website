#!/usr/bin/env node
const slug = process.argv[2] || "e-commerce"

async function probe(url) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
    const t = await r.text()
    console.log("---", url, r.status, t.length)
    const m = t.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (m) {
      const data = JSON.parse(m[1])
      const pp = data.props?.pageProps || {}
      console.log("pageProps keys:", Object.keys(pp))
      const sample = JSON.stringify(pp).slice(0, 1200)
      console.log(sample)
    } else {
      console.log(t.slice(0, 400))
    }
  } catch (e) {
    console.log(url, e.message)
  }
}

await probe(`https://poomgo.com/blog/${slug}`)
