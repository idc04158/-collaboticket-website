import type { ComponentType, ReactNode } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

import { articleMdxComponents } from "@/components/article"
import type { InsightTocItem } from "@/lib/render-insight-markdown"

function toAnchorId(text: string, index: number) {
  const normalized = text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")

  return normalized || `section-${index + 1}`
}

/** Extract TOC from MDX/markdown headings (ignores JSX component trees). */
export function extractInsightTocFromSource(source: string): InsightTocItem[] {
  const toc: InsightTocItem[] = []
  const lines = source.replace(/\r\n/g, "\n").split("\n")
  let inFence = false

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (/^\s*</.test(line)) continue

    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim())
    if (!match) continue
    const level = match[1].length
    const text = match[2].replace(/[#*_`]/g, "").trim()
    if (!text) continue
    toc.push({ id: toAnchorId(text, toc.length), level, text })
  }

  return toc
}

type ExtraComponents = Record<string, ComponentType<any>>

type RenderInsightMdxOptions = {
  source: string
  components?: ExtraComponents
}

/** Compile insight MDX (markdown + article visual components) for RSC. */
export async function renderInsightMdx({ source, components }: RenderInsightMdxOptions) {
  const toc = extractInsightTocFromSource(source)

  const content: ReactNode = (
    <MDXRemote
      source={source}
      components={{
        ...articleMdxComponents,
        ...components,
        h2: (props) => {
          const text = String(props.children ?? "")
          const id = toAnchorId(text, 0)
          const match = toc.find((item) => item.text === text && item.level === 2)
          return <h2 id={match?.id || id} {...props} />
        },
        h3: (props) => {
          const text = String(props.children ?? "")
          const id = toAnchorId(text, 0)
          const match = toc.find((item) => item.text === text && item.level === 3)
          return <h3 id={match?.id || id} className="insight-faq-question" {...props} />
        },
      }}
      options={{
        // next-mdx-remote defaults blockJS=true, which strips headers={...} / steps={[...]} props.
        blockJS: false,
        mdxOptions: {
          // Source comes from .md strings — force MDX so JSX props/expressions work.
          format: "mdx",
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  )

  return { content, toc }
}
