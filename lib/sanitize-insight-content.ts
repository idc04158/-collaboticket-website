/** Remove leaked metadata / markup that should never appear in rendered insight bodies. */
export function sanitizeInsightBody(content: string) {
  let body = content

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

  return body.trimEnd()
}
