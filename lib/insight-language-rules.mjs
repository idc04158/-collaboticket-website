/** Korean-only insight copy rules + normalizers to prevent KR/JP language mixing. */
/** @see scripts/insight-content-rules-registry.mjs — id: language-korean-only */


const JP_CHAR = /[\u3040-\u30ff\u3400-\u9fff\u30a0-\u30ff]/g
const HANGUL = /[\uac00-\ud7a3]/

export const INSIGHT_LANGUAGE_RULES_PROMPT = `Language (Korean-only — critical):
- Write ALL titles, descriptions, headings, bullets, FAQ answers, and table cells in Korean.
- Do NOT mix Japanese script (ひらがな・カタカナ・漢字) into Korean sentences.
- Japanese is allowed ONLY in these cases:
  1) Official UI literals inside backticks that sellers must type verbatim (e.g. \`ppf202607\`, \`超PayPay祭\`)
  2) First mention of an official campaign name: Korean name + official name in parentheses — e.g. 초페이페이 마츠리(超PayPay祭), then use the Korean name in prose
  3) Markdown link URLs (href may stay Japanese)
  4) References section source titles may keep the original Japanese document name
  5) Japanese SEO keyword examples ONLY inside 「」 or backticks in keyword-research articles (never in running Korean prose)
- Convert Japanese calendar tokens to Korean: 7月→7월, (金)→(금), 3日間→3일간, 本番→본편
- Convert Japanese UI terms to Korean in prose: 検索キーワード→검색 키워드, 商品タグ→상품 태그, くじ券→추첨권, 付与率→지급률, 加入→가입, 特典→특전, 入札→입찰
- Do NOT write FAQ answers in Japanese. Translate consumer/market concepts (バズ離れ→버즈 이탈, 納得感→납득감).
- Title pattern: "2026년 7월 초페이페이 마츠리(超PayPay祭): …" NOT "2026년 7月 …"
- Description must be 100% readable Korean except backtick UI literals.`

/** @type {[string | RegExp, string][]} */
const KOREAN_REPLACEMENTS = [
  [/2026년 7月 Yahoo! 超PayPay祭/g, "2026년 7월 초페이페이 마츠리(超PayPay祭)"],
  [/2026年7月/g, "2026년 7월"],
  [/2026年6月/g, "2026년 6월"],
  [/2026年3月/g, "2026년 3월"],
  [/(\d{4})年(\d{1,2})月/g, "$1년 $2월"],
  [/7月超PayPay祭/g, "7월 초페이페이 마츠리(超PayPay祭)"],
  [/3月超PayPay祭/g, "3월 초페이페이 마츠리(超PayPay祭)"],
  [/2026년 7月/g, "2026년 7월"],
  [/7月/g, "7월"],
  [/3月/g, "3월"],
  [/6月/g, "6월"],
  [/本番3日間/g, "본편 3일간"],
  [/본番3日間/g, "본편 3일간"],
  [/본番3일간/g, "본편 3일간"],
  [/本番\s*3일간/g, "본편 3일간"],
  [/本番/g, "본편"],
  [/본番/g, "본편"],
  [/3日間/g, "3일간"],
  [/くじ券獲得期間/g, "추첨권 획득 기간"],
  [/くじ券獲得期/g, "추첨권 획득 기"],
  [/くじ券/g, "추첨권"],
  [/獲得期間/g, "획득 기간"],
  [/검색キーワード/g, "검색 키워드"],
  [/検索キーワード/g, "검색 키워드"],
  [/キーワード/g, "키워드"],
  [/商品タグ/g, "상품 태그"],
  [/상품タグ/g, "상품 태그"],
  [/タグ/g, "태그"],
  [/商品編集/g, "상품 편집"],
  [/プロモパッケージ/g, "프로모션 패키지"],
  [/プロモ션パッケージ/g, "프로모션 패키지"],
  [/プロモ션/g, "프로모션"],
  [/プロモーション/g, "프로모션"],
  [/アイテムリーチ/g, "아이템리치"],
  [/アイテムリッチ/g, "아이템리치"],
  [/Yahoo!ショッピング/g, "Yahoo! 쇼핑"],
  [/ショッピング/g, "쇼핑"],
  [/\[Yahoo!ショッピング 広告ダウンロード\]/g, "[Yahoo! 쇼핑 광고 다운로드]"],
  [/\[Yahoo!ショッピング キャンペーン\]/g, "[Yahoo! 쇼핑 캠페인]"],
  [/\[広告ダウンロード一覧\]/g, "[광고 다운로드 목록]"],
  [/付与上限/g, "지급 상한"],
  [/付与率/g, "지급률"],
  [/支払方法/g, "결제 방법"],
  [/기간한정/g, "기간 한정"],
  [/株式会社アイスタイル/g, "istyle(아이스타일)"],
  [/株式会社/g, ""],
  [/クーポン/g, "쿠폰"],
  [/友だち/g, "친구 추가"],
  [/広告ダウンロード一覧/g, "광고 다운로드 목록"],
  [/広告ダウンロード/g, "광고 다운로드"],
  [/キャンペーン/g, "캠페인"],
  [/エントリー/g, "참가 신청"],
  [/에ントリー/g, "참가 신청"],
  [/パッケージ/g, "패키지"],
  [/入札単価/g, "입찰 단가"],
  [/入札中/g, "입찰 중"],
  [/入札/g, "입찰"],
  [/加入/g, "가입"],
  [/特典/g, "특전"],
  [/ゲ재枠/g, "게재 슬롯"],
  [/専用枠/g, "전용 슬롯"],
  [/ゲ재/g, "게재"],
  [/枠/g, "슬롯"],
  [/ページ/g, "페이지"],
  [/ポイント/g, "포인트"],
  [/バズ離れ/g, "버즈 이탈"],
  [/納得感/g, "납득감"],
  [/口コミ/g, "후기"],
  [/悩み/g, "고민"],
  [/比較/g, "비교"],
  [/話題になったのに試してもらえない/g, "이슈는 됐는데 안 써본다"],
  [/話題にはなったのに、試してもらえない/g, "이슈는 됐는데 안 써본다"],
  [/試してもらえない/g, "안 써본다"],
  [/失敗したくない/g, "실패하고 싶지 않다"],
  [/自分に合うか/g, "나에게 맞는지"],
  [/なんとなく流行っているから/g, "막연히 유행해서"],
  [/バズで認知/g, "버즈로 인지"],
  [/@cosmeで検証/g, "@cosme로 검증"],
  [/Qoo10で購入/g, "Qoo10에서 구매"],
  [/100万円台から始める@cosme/g, "100만 엔대부터 시작하는 @cosme"],
  [/100万円台/g, "100만 엔대"],
  [/(\d+)万円/g, "$1만 엔"],
  [/(\d+)万엔/g, "$1만 엔"],
  [/\(月\)/g, "(월)"],
  [/\(火\)/g, "(화)"],
  [/\(水\)/g, "(수)"],
  [/\(木\)/g, "(목)"],
  [/\(金\)/g, "(금)"],
  [/\(土\)/g, "(토)"],
  [/\(日\)/g, "(일)"],
]

const ALLOWED_INLINE_JP = new Set([
  "超PayPay祭",
  "PayPay",
  "Yahoo",
  "Rakuten",
  "Amazon",
  "Qoo10",
  "LINE",
  "TikTok",
  "@cosme",
  "cosme",
  "ppf202607",
  "ppf202603",
])

function protectSegments(text) {
  const slots = []
  const protectedText = text.replace(/(`[^`]+`|https?:\/\/[^\s)]+)/g, (match) => {
    const key = `\x00PROT${slots.length}\x00`
    slots.push(match)
    return key
  })
  return { protectedText, slots }
}

function restoreSegments(text, slots) {
  return text.replace(/\x00PROT(\d+)\x00/g, (_, i) => slots[Number(i)] ?? "")
}

export function normalizeInsightKorean(text) {
  const { protectedText, slots } = protectSegments(text)
  let normalized = protectedText

  for (const [pattern, replacement] of KOREAN_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement)
  }

  normalized = normalized.replace(
    /초페이페이 마츠리\(超PayPay祭\)\s*초페이페이 마츠리\(超PayPay祭\)/g,
    "초페이페이 마츠리(超PayPay祭)",
  )

  return restoreSegments(normalized, slots)
}

function stripAllowedJapanese(fragment) {
  let stripped = fragment
  for (const term of ALLOWED_INLINE_JP) {
    stripped = stripped.split(term).join("")
  }
  stripped = stripped.replace(/`[^`]*`/g, "")
  stripped = stripped.replace(/「[^」]*」/g, "")
  stripped = stripped.replace(/[\u3040-\u9fff\u30a0-\u30ff]+(?:\s*[\u3040-\u9fff\u30a0-\u30ff]+)*\s*\([^)]*[\uac00-\ud7a3][^)]*\)/g, "")
  stripped = stripped.replace(/\[[^\]]*\]\([^)]*\)/g, "")
  stripped = stripped.replace(/[A-Za-z0-9_./:?#&=%+\-~]+/g, "")
  stripped = stripped.replace(/[『』（）()·・,.\s:：;；!?？~～\-]/g, "")
  return stripped
}

/** @param {string} text @param {{ slug?: string }} [options] */
export function scanInsightLanguageMix(text, options = {}) {
  const issues = []
  const lines = text.split("\n")
  const isKeywordMap = (options.slug ?? "").includes("keyword-map")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!HANGUL.test(line)) continue
    if (!JP_CHAR.test(line)) continue
    if (/^https?:\/\//.test(line.trim())) continue
    if (isKeywordMap && line.includes("|")) continue

    const remainder = stripAllowedJapanese(line)
    if (!JP_CHAR.test(remainder)) continue

    const jpMatches = remainder.match(JP_CHAR)
    issues.push({
      line: i + 1,
      snippet: line.trim().slice(0, 120),
      issue: `한국어 문장에 일본어 문자가 섞여 있습니다 (${jpMatches?.slice(0, 8).join("") ?? ""})`,
    })
  }

  return issues
}
