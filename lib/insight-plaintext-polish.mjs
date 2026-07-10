/**
 * Plaintext polish — unwrap leaked ** bold, fix JP particles in Korean prose, tidy link artifacts.
 * @see scripts/insight-content-rules-registry.mjs
 */

import { normalizeInsightKorean } from "./insight-language-rules.mjs"

/** @type {[string | RegExp, string][]} */
const PLAIN_COPY_REPLACEMENTS = [
  [/」を/g, "」를"],
  [/」が/g, "」가"],
  [/」は/g, "」는"],
  [/」の/g, "」의"],
  [/」に/g, "」에"],
  [/」で/g, "」에서"],
  [/」と/g, "」와"],
  [/バズ離れ/g, "버즈 이탈"],
  [/ロゴ・データ利用ウェビナー/g, "로고·데이터 이용 웨비나"],
  [/プロモ/g, "프로모"],
  [/istyle\(istyle\(아이스타일\)\)/g, "istyle(아이스타일)"],
  [/istyle\(istyle\)/g, "istyle"],
]

export function unwrapMarkdownBold(text) {
  let prev
  let next = text
  do {
    prev = next
    next = next.replace(/\*\*([^*\n]+?)\*\*/g, "$1")
  } while (next !== prev)
  return next.replace(/\*\*/g, "")
}

export function cleanLinkArtifacts(text) {
  return text
    .split("\n")
    .map((line) =>
      line
        .replace(/\s*\(\s*\)\s*/g, " ")
        .replace(/[ \t]{2,}/g, " ")
        .replace(/\s+\./g, ".")
        .trimEnd(),
    )
    .join("\n")
}

function protectCodeFences(text) {
  const slots = []
  const protectedText = text.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
    const key = `\x00CODE${slots.length}\x00`
    slots.push(match)
    return key
  })
  return { protectedText, slots }
}

function restoreCodeFences(text, slots) {
  return text.replace(/\x00CODE(\d+)\x00/g, (_, i) => slots[Number(i)] ?? "")
}

/** @param {string} text @param {{ keepBold?: boolean }} [options] */
export function polishInsightCopy(text, options = {}) {
  const { protectedText, slots } = protectCodeFences(text)
  let next = normalizeInsightKorean(protectedText)

  for (const [pattern, replacement] of PLAIN_COPY_REPLACEMENTS) {
    next = next.replace(pattern, replacement)
  }

  if (!options.keepBold) {
    next = unwrapMarkdownBold(next)
  }

  next = cleanLinkArtifacts(next)
  return restoreCodeFences(next, slots)
}

export function polishInsightTags(tags) {
  if (!Array.isArray(tags)) return tags
  return tags.map((tag) => (typeof tag === "string" ? polishInsightCopy(tag) : tag))
}
