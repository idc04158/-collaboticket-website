import { normalizeInsightKorean } from "@/lib/insight-language-rules.mjs"
import { fixMarkdownHygiene } from "@/lib/insight-markdown-hygiene.mjs"
import { polishInsightCopy } from "@/lib/insight-plaintext-polish.mjs"

/** Remove leaked metadata / markup that should never appear in rendered insight bodies. */
/** @see scripts/insight-content-rules-registry.mjs — id: sanitize-output-hygiene */
export function sanitizeInsightBody(content: string) {
  let body = polishInsightCopy(fixMarkdownHygiene(normalizeInsightKorean(content)))

  // Trailing JSON description leaked from rewrite prompts
  body = body.replace(/^\s*\{"description"\s*:\s*"[\s\S]*?"\}\s*$/gm, "")
  // Broken partial JSON lines (truncated generation)
  body = body.replace(/^\s*\{"description"\s*:\s*"[^\n]*$/gm, "")

  // Accidental HTML blocks in markdown source
  body = body.replace(/^<aside[\s\S]*?<\/aside>\s*$/gm, "")
  body = body.replace(/^<script[\s\S]*?<\/script>\s*$/gm, "")

  // FAQ headings should be the question itself, not "질문?"
  body = body.replace(/^###\s*질문\?\s*/gm, "### ")
  body = body.replace(/^###\s*Q\d+[:.]\s*/gm, "### ")

  // Broken Megawari spelling from mixed-language generation
  body = body.replace(/Mega\s*Warí/gi, "메가와리")
  body = body.replace(/Mega\s*Wari/gi, "메가와리")

  // Footer link blocks — shown in "더 알아보기" section instead
  body = body.replace(/^##\s+관련 리포트\s*\n[\s\S]*?(?=^##\s+|\n*$)/gm, "")
  body = body.replace(
    /\n(?:For (?:more|further|additional)[^\n]*|Explore further[^\n]*|내부 링크[^\n]*)\s*$/gm,
    "",
  )

  // Generic English boilerplate sometimes appended after References
  body = body.replace(
    /\n+This report leverages[\s\S]*?market dynamics\.\s*(?=\n|$)/g,
    "",
  )

  return body.trimEnd()
}
