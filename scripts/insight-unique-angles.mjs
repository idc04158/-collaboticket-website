/** One unique focus angle per insight — prevents corpus-wide duplication */

export const CANONICAL_HUBS = {
  marketData: "japan-ecommerce-2025",
  platformRoles: "japan-ec-channel-entry-strategy",
  kpiOps: "japan-ec-kpi-dashboard",
  faq: "japan-ecommerce-faq-50",
}

export const UNIQUE_ANGLES = {
  "japan-ecommerce-2025":
    "일본 EC 거시 시장 단일 기준 데이터(TAM·CAGR·플랫폼 점유). 다른 글에서 시장 규모 표 반복 금지 — 이 글만 상세 표.",
  "japan-ec-consumer-behavior-search-insight":
    "구매 전 신뢰·검색 행동(成分·返品·配送). 시장 규모·플랫폼 비교 표 금지.",
  "japan-ec-channel-entry-strategy":
    "Qoo10→Rakuten→Amazon→LINE 진입 순서와 역할 매트릭스. 유일하게 4플랫폼 역할 표 풀버전 허용.",
  "japan-entry-consulting-agenda":
    "90분 컨설팅 워크숍 아젠다·준비 자료. 사례·플랫폼 표 최소화.",
  "kbeauty-japan-entry-roadmap":
    "K-Beauty 0→6→12개월 단계별 로드맵. 범용 5단계 ACTION 금지.",
  "k-beauty-japan-seo-launch-playbook":
    "K-Beauty 일본어 SEO 키워드→콘텐츠 매핑. 시장 규모·B/D 사례 금지.",
  "lifestyle-brand-japan-launch-order":
    "비뷰티 라ifestyle 브랜드 런칭 순서·채널 우선순위.",
  "snack-brand-japan-channel-strategy":
    "식품/F&B(賞味期限·通関·常温) 채널 특수성만.",
  "japan-brand-trust-signals":
    "일본 소비자 신뢰 배지·표기(@cosme·医薬部外品·返品保証) 계층.",
  "product-localization-checklist-jp":
    "제품 단위 현지화 체크(라벨·클레임·사이즈).",
  "ec-detail-page-localization":
    "PDP 12포인트 현지화(비주얼·카피·FAQ).",
  "japan-price-policy-framework":
    "채널 간 MAP·할인·포인트 충돌 규칙.",
  "rakuten-amazon-launch-basics":
    "라쿠텐·아마존 듀얼 입점 전 체크리스트(계정·카탈로그·컴플라이언스).",
  "rakuten-vs-amazon":
    "카테고리·가격·물류 기준 플랫폼 선택 의사결정 트리.",
  "qoo10-launch-checklist-30days":
    "Qoo10 입점 30일 일별·주별 마일스톤. 유일하게 30일 타임라인.",
  "amazon-japan-fba-onboarding":
    "FBA 입고·라벨·JAN 등록 단계별 가이드.",
  "marketplace-content-reuse-system":
    "마스터 에셋 1개→4마켓플레이스 변형 워크플로.",
  "japan-ec-kpi-dashboard":
    "ROAS·CVR·LTV 정의·목표·대시보드. 운영 KPI 집계 사례는 이 글만.",
  "search-to-conversion-flow-japan":
    "노출→PDP→장바구니→구매 단계별 이탈 설계.",
  "rakuten-seo-title-structure":
    "라쿠텐 상품명 글자수·키워드 적층 규칙.",
  "rakuten-super-sale-ops":
    "슈퍼세일 운영 런북(포인트 배율·배너·재고).",
  "qoo10-megawari-prep-plan":
    "메가와리 8주 전 준비 타임라인(재고·가격·광고).",
  "qoo10-megawari-live-commerce-strategy":
    "메가와리×라이브커머스 스크립트·CVR 메커니즘.",
  "amazon-japan-review-velocity":
    "리뷰 속도 30/60/90일 목표·TOS 준수 전술.",
  "japan-review-structure":
    "일본 리뷰 글 구조(長文·写真·使用期間·肌質).",
  "cosme-lips-review-operations":
    "@cosme·LIPS 전용 운영(플랫폼 MAU는 이 글만).",
  "review-proof-report-format":
    "리뷰 감사·증빙 리포트 템플릿.",
  "japan-ec-ad-creative-patterns":
    "일본 EC 광고 크리에이티브 포맷(縦型·Before-After).",
  "japan-sns-brand-trust":
    "SNS→매출 귀속 모델(공식 계정).",
  "japan-sns-content-calendar":
    "플랫폼×퍼널 단계 월간 콘텐츠 매트릭스.",
  "japan-ugc-conversion-playbook":
    "UGC 수집→배치→측정 실행 플레이북.",
  "ugc-ec-conversion-japan":
    "UGC가 JP CVR에 미치는 심리·근거(전술은 playbook 글 참조).",
  "line-official-account-funnel":
    "LINE OA 퍼널(友だち→クーポン→購入).",
  "line-x-crm-fan-marketing-japan":
    "LINE vs X CRM 역할 분담. B/D 대신 A/B/C 라벨.",
  "influencer-matching-metrics":
    "인플루언서 매칭 스코어카드(ER·가짜팔로워·카테고리).",
  "influencer-brief-template-jp":
    "인플루언서 브리프 템플릿(표기·법적 문구).",
  "influencer-performance-metrics-jp":
    "인플루언서 캠페인 KPI 정의(ER·CPA·ROAS). B/D EC 사례 금지.",
  "japan-influencer-marketing-case-framework":
    "인플루언서 사례→실행 전략 변환 프레임.",
  "case-study-experience-influencer-43":
    "체험단+인플루언서 단일 딥케이스(43% 매출). B/D 템플릿 금지.",
  "fba-vs-3pl-japan":
    "FBA vs 3PL 비용 모델 비교.",
  "cross-border-shipping-cost-model":
    "크로스보더 배송비 계산 입력(중량·관세·라스트마일).",
  "customs-risk-checklist-japan":
    "통관 리스크 체크(HS·成分·表示).",
  "logistics-corporate-ecommerce":
    "法人設立→EC→물류 연결.",
  "jp-customer-support-sop":
    "일본 CS SOP(返品·お詫び·SLA).",
  "crm-followup-template-japan":
    "리드 팔로업 시퀀스(1/3/7/14일).",
  "japan-ec-market-trends-2026":
    "2026 채널별 전환율·전략 차이. 시장 규모 표 금지 — japan-ecommerce-2025 링크.",
  "japan-ec-keyword-map-2026":
    "카테고리×검색 의도 맵(悩み/比較/口コミ). 사례 1개만.",
  "japan-sns-marketing-case-patterns-2026":
    "2026 JP SNS 성공 패턴 라이브러리(포맷 중심).",
  "ai-shopping-commerce-japan-2026":
    "AI·질문형 쇼핑 검색 전환(75% 등). 전통 EC 시장 표 금지.",
  "japan-ecommerce-faq-50":
    "범용 FAQ 허브 50선. 다른 글의 제네릭 FAQ 금지 — 여기만.",
  "japan-tiktok-shop-entry-ops":
    "TikTok Shop JP 채널 진입·숏폼→PDP→전환. 아마존/큐텐 비교표 금지.",
  "japan-logistics-regulation-2026":
    "2026 Q2 일본 물류·통관 규제 변화가 EC SLA·마진에 미치는 영향.",
  "megawari-kpi-seven-metrics":
    "메가와리 7 KPI 정의·대시보드. 유일하게 7지표 표.",
  "qoo10-megafor-cart-conversion":
    "메가포 장바구니→결제 전환(쿠폰·PDP·리마인드).",
  "megawari-closing-week-ops":
    "메가와리 종료 7일 집중 운영 런북.",
  "japan-effortless-consumer-2026":
    "2026 일본 ‘고생 취소’ 소비→PDP·번들·CRM 포지셔닝.",
  "japan-awareness-to-purchase-3step":
    "SNS→검색→마켓 구매 3단계 퍼널.",
  "megawari-demand-forecast-playbook":
    "메가와리 수요 예측·광고·재고 시뮬레이션.",
  "japan-customs-acp-margin-guide":
    "ACP·관세·메가와리 할인 마진 설계.",
  "kbeauty-japan-ingredient-compliance":
    "K-Beauty 성분·표시·医薬部外品 컴플라이언스.",
  "yahoo-chou-paypay-festival-2026-july":
    "2026년 7月 Yahoo 超PayPay祭 태그·키워드·아이템리치 세팅. 유일하게 ppf202607 체크리스트.",
}

/** Case study labels assigned per slug — no B+D pair reuse */
export const ASSIGNED_CASE_LABELS = {
  "japan-ecommerce-2025": ["시장 벤치마크 집계"],
  "japan-ec-channel-entry-strategy": ["패션 브랜드 F", "건강기능식품 G"],
  "qoo10-launch-checklist-30days": ["스킨케어 D", "건강기능식품 G"],
  "rakuten-seo-title-structure": ["헤어케어 B"],
  "amazon-japan-fba-onboarding": ["생활용품 H"],
  "case-study-experience-influencer-43": ["뷰티 브랜드 A", "헤어케어 C"],
  "line-x-crm-fan-marketing-japan": ["브랜드 A", "브랜드 B", "브랜드 C"],
  "japan-ec-kpi-dashboard": ["헤어케어 B", "스킨케어 D"],
  "cosme-lips-review-operations": ["더마코스메틱 C", "스킨케어 D"],
  "fba-vs-3pl-japan": ["패션 F", "식품 G"],
  "japan-ec-keyword-map-2026": ["스킨케어 D"],
  "japan-ec-market-trends-2026": ["헤어케어 B", "스킨케어 D"],
  "influencer-performance-metrics-jp": ["뷰티 인플루언서 캠페인 A", "F&B 인플루언서 캠페인 G"],
  "rakuten-vs-amazon": ["헤어케어 B", "스킨케어 D"],
  "japan-brand-trust-signals": ["더마코스메틱 C"],
  "japan-ec-ad-creative-patterns": ["헤어케어 B"],
  "japan-ugc-conversion-playbook": ["스킨케어 D"],
  "lifestyle-brand-japan-launch-order": ["패션 F"],
  "product-localization-checklist-jp": ["생활용품 H"],
  "japan-sns-marketing-case-patterns-2026": ["패션 F"],
  "influencer-matching-metrics": ["뷰티 인플루언서 A"],
  "kbeauty-japan-ingredient-compliance": ["더마코스메틱 C"],
  "japan-customs-acp-margin-guide": ["건강기능식품 G"],
  "megawari-demand-forecast-playbook": ["스킨케어 D"],
  "japan-awareness-to-purchase-3step": ["패션 F"],
  "japan-effortless-consumer-2026": ["생활용품 H"],
  "megawari-closing-week-ops": ["헤어케어 B"],
  "qoo10-megafor-cart-conversion": ["스킨케어 D"],
  "megawari-kpi-seven-metrics": ["헤어케어 B"],
  "japan-logistics-regulation-2026": ["패션 F"],
  "japan-tiktok-shop-entry-ops": ["뷰티 브랜드 A"],
  "yahoo-chou-paypay-festival-2026-july": ["건강기능식품 G"],
}

export function getUniqueAngle(slug) {
  return UNIQUE_ANGLES[slug] || `Topic-specific deep dive for ${slug}. Avoid generic platform/market boilerplate.`
}

export function getAssignedCases(slug) {
  return ASSIGNED_CASE_LABELS[slug] || [`${slug.includes("qoo10") ? "스킨케어 D" : slug.includes("rakuten") ? "헤어케어 B" : slug.includes("amazon") ? "생활용품 H" : "패션 F"} 제품`]
}

export function allowsFullPlatformTable(slug) {
  return slug === CANONICAL_HUBS.platformRoles
}

export function allowsMarketSizeTable(slug) {
  return slug === CANONICAL_HUBS.marketData || slug === CANONICAL_HUBS.faq
}

export function getNeighborAngles(slug, allSlugs, count = 4) {
  const idx = allSlugs.indexOf(slug)
  if (idx < 0) return []
  const neighbors = []
  for (let i = Math.max(0, idx - 2); i <= Math.min(allSlugs.length - 1, idx + 2); i++) {
    if (i !== idx) neighbors.push({ slug: allSlugs[i], angle: getUniqueAngle(allSlugs[i]) })
  }
  return neighbors.slice(0, count)
}
