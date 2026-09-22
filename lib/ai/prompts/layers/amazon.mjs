/**
 * Amazon Japan insight generation layer — stacked on shared system prompt.
 */

export function buildAmazonLayerRules() {
  return `### Amazon Japan 레이어
- 플랫폼 초점은 Amazon Japan (셀러 관리자, 광고, 아마존 물류, Buy Box, 검색어).
- 다른 플랫폼(Qoo10/Rakuten 등)은 비교가 필요할 때만 짧게. 전체 플랫폼 역할 표는 금지.
- 메뉴·리포트는 한국어로 구체적으로 쓰고, 영어는 첫 등장만 한국어(원문), 일본어 검색어·표현은 일본어(한국어). 영어 경로 나열 금지.
- 문장은 영어 직역체가 아니라 한국 담당자에게 상담하듯 자연스러운 한국어로 쓴다.
- 뉴스·공지는 소재일 뿐. 본문은 "우리 상품(광고·재고)에서 무엇을 할 것인가".`
}

export function buildAmazonTaskBlock({ item, relatedSlugs = [], newsSeeds = [], goldNotes = "" }) {
  const links = relatedSlugs.slice(0, 5).map((s) => `/insights/${s}`).join(", ")
  const seeds =
    newsSeeds.length > 0
      ? newsSeeds
          .map(
            (n, i) =>
              `${i + 1}. ${n.title}${n.publisherName ? ` — ${n.publisherName}` : ""}${n.publishedAt ? ` (${String(n.publishedAt).slice(0, 10)})` : ""}${n.url ? `\n   URL: ${n.url}` : ""}${n.snippet ? `\n   snippet: ${n.snippet.slice(0, 160)}` : ""}`,
          )
          .join("\n")
      : "(관련 헤드라인 없음 — 가짜 뉴스 만들지 말고 운영 이슈로 시작)"

  return `## 1) 주제
- slug: ${item.slug}
- 제목(frontmatter, 본문에 반복 금지): ${item.title}
- 카테고리: ${item.category}
- 태그: ${(item.tags || []).join(", ")}
- 발행일 맥락: ${item.date || ""}

## 2) 독자의 문제
- "그래서 우리 브랜드는 어떻게 해야 하지?"
- 고유 각도: ${item.angle || ""}
- 브랜드 유형 맥락(가짜 KPI 금지): ${item.brandType || ""}

## 3) 검색 의도
제목·각도를 기준으로 실제 검색 의도를 내부 정의한 뒤 답하라. FAQ는 그 의도와 맞아야 한다.

## 4) CollaboTicket 관점
Amazon Japan 운영 상담 기준으로 쓴다.
내부 링크(자연스러울 때만): ${links || "없음"}

## 5) 뉴스 / 공식자료 (참고 — 주제 아님)
순서대로 요약하지 마라. web_search로 사실·공식·최신 정책만 확인.

${seeds}

${goldNotes}

## 6) 작성
위 1~5를 내부 정리한 뒤, 출력 형식의 한국어 Markdown 본문만 출력.
사고 과정·검수 메모 출력 금지.`
}
