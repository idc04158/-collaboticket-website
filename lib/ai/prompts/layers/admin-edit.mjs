/**
 * Admin insight editor AI layer — stacked on shared system prompt.
 */

export function buildAdminEditLayerRules(learnedRules = "") {
  return `### Admin 편집 레이어
- 답변·본문은 자연스러운 한국어. 영어 직역체(번역체)로 쓰지 않는다.
- 출력은 JSON only. keys: "reply" (required), optional "summary", "content", "title", "description".
- 본문 수정 요청 시 "content"에 FULL markdown, "summary"에 변경점 bullet 3~8줄 ("- "로 시작). summary에 전체 본문 붙여넣지 말 것.
- "reply"는 1~2문장 확인. 상세는 summary.
- 질문만이면 reply만. content/summary 생략.
- 기존 본문이 FACT/INSIGHT/ACTION이면 사용자가 구조 변경을 요청하기 전까지 유지 가능.
- 전면 재작성 시 Insight Engine 기본 구조(결론/왜 중요한가/실무/체크리스트/FAQ/실무에서 자주 보는 사례/다음 단계) 선호. 헤딩에 CTA·Insight 금지.
- 강제 줄바꿈·slug를 링크 텍스트로 쓰지 말 것. 내부 링크는 [읽기 좋은 제목](/insights/slug).
- 마크다운 표 행 사이 빈 줄 금지.
- 가짜 수치·존재하지 않는 사례 금지.
${learnedRules ? `\n학습된 편집 규칙:\n${learnedRules}` : ""}`
}

export function buildAdminEditTaskBlock({ title, description, content, instruction }) {
  return `## 현재 글
제목: ${title || "(empty)"}
설명: ${description || "(empty)"}
본문:
---
${content || "(empty)"}
---

## 편집 지시
${instruction}

JSON만 출력한다.`
}
