import { ARTICLE_MDX_TAG_NAMES } from "@/lib/article-mdx-tags"

const TAG_ALT = ARTICLE_MDX_TAG_NAMES.join("|")
const START_RE = new RegExp(`<(${TAG_ALT})(?=[\\s/>])`, "g")

/** Find end index of a JSX/MDX component starting at `start` (`<Tag`). */
function findComponentEnd(source: string, start: number, tag: string): number {
  let i = start + tag.length + 1
  let quote: '"' | "'" | "`" | null = null
  let brace = 0
  let bracket = 0

  while (i < source.length) {
    const ch = source[i]
    const next = source[i + 1]

    if (quote) {
      if (ch === "\\" && quote !== "`") {
        i += 2
        continue
      }
      if (ch === quote) quote = null
      i += 1
      continue
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch
      i += 1
      continue
    }

    if (ch === "{") {
      brace += 1
      i += 1
      continue
    }
    if (ch === "}") {
      brace = Math.max(0, brace - 1)
      i += 1
      continue
    }
    if (ch === "[") {
      bracket += 1
      i += 1
      continue
    }
    if (ch === "]") {
      bracket = Math.max(0, bracket - 1)
      i += 1
      continue
    }

    if (brace === 0 && bracket === 0) {
      if (ch === "/" && next === ">") {
        return i + 2
      }
      if (ch === ">") {
        const close = `</${tag}>`
        const closeAt = source.indexOf(close, i + 1)
        if (closeAt >= 0) return closeAt + close.length
        return i + 1
      }
    }

    i += 1
  }

  return source.length
}

/** Park article MDX islands so hygiene pass does not alter JSX props. */
export function protectArticleComponents(content: string) {
  const slots: string[] = []
  let result = ""
  let lastIndex = 0
  START_RE.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = START_RE.exec(content)) !== null) {
    const start = match.index
    const tag = match[1]
    const end = findComponentEnd(content, start, tag)
    result += content.slice(lastIndex, start)
    const index = slots.length
    slots.push(content.slice(start, end))
    result += `\n\n%%ARTICLE_COMPONENT_${index}%%\n\n`
    lastIndex = end
    START_RE.lastIndex = end
  }

  result += content.slice(lastIndex)
  return { protectedBody: result, slots }
}

export function restoreArticleComponents(content: string, slots: string[]) {
  return content.replace(/%%ARTICLE_COMPONENT_(\d+)%%/g, (_, index) => slots[Number(index)] || "")
}
