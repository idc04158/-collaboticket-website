/**
 * Rewrite / Poomgo import layer — stacked on shared system prompt.
 */

import { GOLD_STANDARD_STYLE_NOTES } from "../collaboticket-system-prompt.mjs"

export function buildRewriteLayerRules() {
  return `### Rewrite 레이어
- 기존 초고·외부 소스는 참고용이다. 그대로 번역·요약하지 말고 컨설팅 인사이트로 재작성한다.
- 영어·일본어 원문을 직역한 번역체로 쓰지 않는다. 문장 전체를 자연스러운 한국어 상담 말투로 다시 쓴다.
- 기본 출력 구조(결론 / 왜 중요한가 / 실무 / 체크리스트 / FAQ / 실무에서 자주 보는 사례 / 다음 단계)를 따른다. 헤딩에 CTA·Insight 등 내부 용어 금지.
- 사용자가 명시적으로 요청하지 않는 한 FACT/INSIGHT/ACTION 템플릿으로 돌아가지 않는다.
- 고유 각도(unique angle)를 지키며 다른 글과 내용을 중복하지 않는다.
- 내부 링크는 [읽기 좋은 제목](/insights/slug) 형식으로 본문에 자연스럽게 2~3개.
- 가짜 METI/JETRO 수치·존재하지 않는 사례를 만들지 않는다.
- 풀필먼트/물류 벤더 홍보 톤으로 쓰지 않는다. 물류는 구매 전환·신뢰·배송에 영향을 줄 때만 짧게.`
}

export function buildRewriteTaskBlock({
  meta = {},
  publishDate = "",
  relatedSlugs = [],
  existingExcerpt = "",
  uniqueAngle = "",
  sourceBrief = "",
  includeGoldNotes = true,
}) {
  const links = relatedSlugs.slice(0, 8).map((s) => `/insights/${s}`).join(", ")

  return `## 1) 주제
- slug: ${meta.slug || ""}
- 제목: ${meta.title || ""}
- 카테고리: ${meta.category || ""}
- 태그: ${Array.isArray(meta.tags) ? meta.tags.join(", ") : ""}
- 발행일 맥락: ${publishDate}

## 2) 독자의 문제
브랜드 담당자가 이 주제로 검색/상담할 때 막히는 지점을 중심에 둔다.
고유 각도: ${uniqueAngle || "(slug 기준 고유 초점)"}

## 3) 검색 의도
제목이 암시하는 검색 의도에 먼저 답한 뒤 실행 순서를 제시한다.

## 4) CollaboTicket 관점
실무 상담 톤으로 재작성한다.
내부 링크 힌트: ${links || "없음"}

## 5) 참고 소재 (주제 아님)
소스/기존 초고는 소재다. 순서 요약 금지.

${sourceBrief ? `소스 브리프:\n${sourceBrief}\n` : ""}
기존 초고(전면 교체 대상):
${existingExcerpt || "(없음)"}

${includeGoldNotes ? `${GOLD_STANDARD_STYLE_NOTES}\n` : ""}
## 6) 작성
출력 형식의 한국어 Markdown 본문만 출력. 사고·검수 메모 금지.`
}
