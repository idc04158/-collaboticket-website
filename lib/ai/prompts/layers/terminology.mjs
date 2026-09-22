/**
 * Korean-first terminology localization — stacked on shared system prompt.
 */

export function buildTerminologyLayerRules() {
  return `### 용어 현지화 규칙
영어·일본어·Amazon 내부 메뉴명·약어를 **원문만** 나열하지 않는다.

#### 영어 / Amazon / 약어
독자가 이해하기 쉬운 **한국어를 우선** 사용한다.
첫 등장 시에만 \`한국어(원문)\` 형태로 표기한다.
이후에는 **한국어만** 사용한다.

예)
- 셀러 관리자(Seller Central)
- 브랜드 분석(Brand Analytics)
- 검색어 성과(Search Query Performance)
- 비즈니스 리포트(Business Reports)
- 광고 리포트(Advertising Reports)
- 검색어 리포트(Search Term Report)
- 대표 판매자(Featured Offer)
- 아마존 물류(FBA)
- 아마존 상품번호(ASIN)
- 클릭률(CTR)
- 구매 전환율(CVR)
- 상품 핵심 정보(Item Highlights)
- 브랜드 상세 콘텐츠(A+ Content)
- 재고 관리(Inventory)

메뉴 경로도 영어 그대로 출력하지 않는다.
금지: Brands > Brand Analytics > Search Query Performance
사용: 셀러 관리자 → 브랜드 분석 → 검색어 성과

#### 일본어 (검색어·카테고리·상품 표현)
일본어가 나오면 첫 등장 시에만 \`일본어(한국어)\` 형태로 표기한다.
이후에는 **한국어만** 사용한다.
일본어만 단독으로 쓰지 않는다.

예)
- 腸活(장 건강)
- 睡眠(수면)
- 脂肪(지방)
- 美容(미용)
금지: 타이틀에 “腸活”, “睡眠”만 적기 / “장 건강(腸活)”처럼 순서를 뒤집기
사용: 타이틀에 “腸活(장 건강)”, “睡眠(수면)”

컴포넌트 title·steps·checklist·표 셀에도 동일 규칙을 적용한다.`
}
