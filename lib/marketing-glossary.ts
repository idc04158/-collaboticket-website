export const MARKETING_GLOSSARY_SLUG = "japan-ecommerce-marketing-glossary"

export type MarketingGlossaryTerm = {
  id: string
  label: string
  aliases?: string[]
  shortDefinition: string
  category: "광고·성과" | "전환·고객" | "플랫폼·운영" | "물류·커머스"
}

export const MARKETING_GLOSSARY_TERMS: MarketingGlossaryTerm[] = [
  {
    id: "roas",
    label: "ROAS",
    shortDefinition: "광고비 대비 매출 비율. ROAS 300%면 광고 100만 원으로 300만 원 매출을 뜻합니다.",
    category: "광고·성과",
  },
  {
    id: "roi",
    label: "ROI",
    shortDefinition: "투자 대비 수익률. 마케팅·물류 등 투입 비용 대비 얼마나 이익이 났는지 보는 지표입니다.",
    category: "광고·성과",
  },
  {
    id: "ltv",
    label: "LTV",
    aliases: ["고객 생애 가치"],
    shortDefinition: "한 고객이 브랜드와 거래하는 동안 만들어내는 총 매출·이익. 재구매·CRM 전략의 핵심 지표입니다.",
    category: "전환·고객",
  },
  {
    id: "cvr",
    label: "CVR",
    shortDefinition: "방문·노출 대비 구매 등 목표 행동이 일어난 비율. 상세페이지·광고 효율을 볼 때 자주 씁니다.",
    category: "전환·고객",
  },
  {
    id: "ctr",
    label: "CTR",
    shortDefinition: "노출 대비 클릭 비율. 광고 소재·상품명·썸네일이 끌리는지 먼저 확인하는 지표입니다.",
    category: "광고·성과",
  },
  {
    id: "cpc",
    label: "CPC",
    shortDefinition: "클릭 한 번당 지불한 광고비. 검색·디스플레이 광고 입찰 경쟁을 비교할 때 씁니다.",
    category: "광고·성과",
  },
  {
    id: "cpa",
    label: "CPA",
    shortDefinition: "전환(구매·가입 등) 한 건당 비용. 광고가 실제 판매로 이어질 때 비용 효율을 봅니다.",
    category: "광고·성과",
  },
  {
    id: "cac",
    label: "CAC",
    shortDefinition: "신규 고객 한 명을 확보하는 데 든 비용. LTV와 함께 보면 장기 수익성을 판단할 수 있습니다.",
    category: "전환·고객",
  },
  {
    id: "aov",
    label: "AOV",
    shortDefinition: "주문 한 건당 평균 결제 금액. 세트 구성·업셀·무료배송 기준을 잡을 때 참고합니다.",
    category: "전환·고객",
  },
  {
    id: "kpi",
    label: "KPI",
    shortDefinition: "핵심 성과 지표. 팀이 주간·월간으로 반드시 추적하기로 한 숫자(ROAS, CVR, 리뷰 수 등)입니다.",
    category: "광고·성과",
  },
  {
    id: "crm",
    label: "CRM",
    shortDefinition: "고객 관계 관리. LINE·메일 등으로 재구매·쿠폰·팬을 관리하는 마케팅·운영 체계입니다.",
    category: "전환·고객",
  },
  {
    id: "ugc",
    label: "UGC",
    shortDefinition: "사용자 생성 콘텐츠. 리뷰·SNS 후기·체험단 콘텐츠처럼 고객이 만든 신뢰 자료입니다.",
    category: "플랫폼·운영",
  },
  {
    id: "seo",
    label: "SEO",
    shortDefinition: "검색 엔진 최적화. 상품명·키워드·리뷰를 다듬어 검색·마켓 내 노출을 높이는 작업입니다.",
    category: "플랫폼·운영",
  },
  {
    id: "pdp",
    label: "PDP",
    shortDefinition: "상품 상세 페이지. 이미지·FAQ·리뷰·배송 정보가 모여 전환을 결정하는 핵심 페이지입니다.",
    category: "플랫폼·운영",
  },
  {
    id: "sku",
    label: "SKU",
    shortDefinition: "판매 단위(품목) 코드. 옵션·세트·재고를 구분하는 최소 상품 단위입니다.",
    category: "물류·커머스",
  },
  {
    id: "fba",
    label: "FBA",
    shortDefinition: "Amazon이 보관·배송·반품을 대신하는 물류 서비스. Buy Box·배송 속도 경쟁에 유리합니다.",
    category: "물류·커머스",
  },
  {
    id: "3pl",
    label: "3PL",
    shortDefinition: "외부 물류 대행. 일본 현지 창고·배송·반품을 파트너사가 처리하는 방식입니다.",
    category: "물류·커머스",
  },
  {
    id: "sla",
    label: "SLA",
    shortDefinition: "서비스 수준 약속. 배송·고객 응대 등 반드시 지켜야 하는 운영 기준(예: 48시간 내 출고)입니다.",
    category: "물류·커머스",
  },
  {
    id: "gmv",
    label: "GMV",
    shortDefinition: "총 거래액. 할인·환불 전 기준으로 플랫폼에서 발생한 매출 규모를 봅니다.",
    category: "물류·커머스",
  },
  {
    id: "buy-box",
    label: "Buy Box",
    shortDefinition: "Amazon에서 ‘장바구니 담기’가 노출되는 판매 슬롯. 가격·배송·평점이 좋은 셀러가 가져갑니다.",
    category: "플랫폼·운영",
  },
  {
    id: "megawari",
    label: "메가와리",
    shortDefinition: "Qoo10 대형 할인 이벤트. 시즌별 최대 프로모션 기간으로 재고·광고·리뷰를 미리 준비합니다.",
    category: "플랫폼·운영",
  },
  {
    id: "sns",
    label: "SNS",
    shortDefinition: "소셜 네트워크 서비스. Instagram·TikTok·X·LINE 등 일본 소비자 접점 채널을 통칭합니다.",
    category: "플랫폼·운영",
  },
  {
    id: "ec",
    label: "EC",
    shortDefinition: "전자상거래. 온라인 몰·오픈마켓·자사몰 등 인터넷 판매 채널 전반을 뜻합니다.",
    category: "물류·커머스",
  },
  {
    id: "d2c",
    label: "D2C",
    shortDefinition: "소비자 직접 판매. 중간 유통 없이 브랜드가 자사몰·SNS로 바로 판매하는 모델입니다.",
    category: "물류·커머스",
  },
  {
    id: "b2c",
    label: "B2C",
    shortDefinition: "기업이 일반 소비자에게 직접 판매하는 구조. 일본 오픈마켓·자사몰 대부분이 여기에 해당합니다.",
    category: "물류·커머스",
  },
  {
    id: "cs",
    label: "CS",
    shortDefinition: "고객 지원(Customer Service). 문의·반품·리뷰 응대 품질이 전환·재구매에 직결됩니다.",
    category: "전환·고객",
  },
  {
    id: "nps",
    label: "NPS",
    shortDefinition: "순추천지수. 고객이 브랜드를 추천할 의향이 얼마나 높은지 묻는 만족도 지표입니다.",
    category: "전환·고객",
  },
]

export function getGlossaryTermById(id: string) {
  return MARKETING_GLOSSARY_TERMS.find((term) => term.id === id)
}

export function getGlossaryHref(termId?: string) {
  const base = `/insights/${MARKETING_GLOSSARY_SLUG}`
  return termId ? `${base}#${termId}` : base
}
