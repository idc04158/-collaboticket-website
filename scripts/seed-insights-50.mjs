import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

const baseImage =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80"

const tagByCategory = {
  "Market Analysis": ["시장분석", "일본EC", "데이터"],
  "Open Market": ["라쿠텐", "Qoo10", "Amazon"],
  "SNS Marketing": ["SNS", "인플루언서", "콘텐츠"],
  "Review Strategy": ["리뷰", "전환", "신뢰"],
  Logistics: ["물류", "통관", "운영"],
  "Execution Guide": ["실행가이드", "체크리스트", "운영"],
}

function inferCategory(slug) {
  if (/(rakuten|qoo10|amazon|open-market|marketplace)/.test(slug)) return "Open Market"
  if (/(sns|influencer|ugc|line|youtube|tiktok|instagram)/.test(slug)) return "SNS Marketing"
  if (/(review|trust|lips|cosme)/.test(slug)) return "Review Strategy"
  if (/(logistics|fba|shipping|customs)/.test(slug)) return "Logistics"
  if (/(guide|playbook|checklist|framework|launch)/.test(slug)) return "Execution Guide"
  return "Market Analysis"
}

function updateExistingTags() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file)
    const raw = fs.readFileSync(fullPath, "utf8")
    const parsed = matter(raw)
    const slug = file.replace(/\.md$/, "")
    const category = parsed.data.category || inferCategory(slug)
    const tags = Array.isArray(parsed.data.tags) && parsed.data.tags.length > 0 ? parsed.data.tags : tagByCategory[category] || ["일본진출", "실행"]
    parsed.data.category = category
    parsed.data.tags = tags
    if (!parsed.data.date) parsed.data.date = "2026-04-01"
    if (!parsed.data.image) parsed.data.image = baseImage
    fs.writeFileSync(fullPath, matter.stringify(parsed.content, parsed.data), "utf8")
  }
}

const newPosts = [
  ["japan-ec-keyword-map-2026", "일본 EC 키워드 맵 2026: 카테고리별 검색 의도 정리", "Market Analysis"],
  ["qoo10-launch-checklist-30days", "Qoo10 입점 30일 체크리스트", "Open Market"],
  ["rakuten-seo-title-structure", "라쿠텐 상품명 SEO 구조 실전 가이드", "Open Market"],
  ["amazon-japan-review-velocity", "Amazon Japan 리뷰 속도 관리 프레임", "Review Strategy"],
  ["japan-sns-content-calendar", "일본 SNS 월간 콘텐츠 캘린더 설계", "SNS Marketing"],
  ["influencer-brief-template-jp", "일본 인플루언서 브리프 템플릿", "SNS Marketing"],
  ["line-official-account-funnel", "LINE 공식계정 퍼널 설계 가이드", "SNS Marketing"],
  ["ec-detail-page-localization", "일본 상세페이지 현지화 포인트 12가지", "Execution Guide"],
  ["japan-price-policy-framework", "일본 가격 정책 프레임워크", "Execution Guide"],
  ["cross-border-shipping-cost-model", "역직구 배송비 모델링 가이드", "Logistics"],
  ["fba-vs-3pl-japan", "FBA vs 3PL: 일본 판매 물류 선택 기준", "Logistics"],
  ["customs-risk-checklist-japan", "일본 통관 리스크 체크리스트", "Logistics"],
  ["kbeauty-japan-entry-roadmap", "K-Beauty 일본 진출 로드맵", "Execution Guide"],
  ["snack-brand-japan-channel-strategy", "식품 브랜드 일본 채널 전략", "Market Analysis"],
  ["lifestyle-brand-japan-launch-order", "라이프스타일 브랜드 일본 론칭 순서", "Execution Guide"],
  ["review-proof-report-format", "리뷰 인증 리포트 포맷 샘플", "Review Strategy"],
  ["cosme-lips-review-operations", "@cosme/LIPS 리뷰 운영 기준", "Review Strategy"],
  ["qoo10-megawari-prep-plan", "Qoo10 메가와리 준비 플랜", "Open Market"],
  ["rakuten-super-sale-ops", "라쿠텐 슈퍼세일 운영 체크포인트", "Open Market"],
  ["amazon-japan-fba-onboarding", "Amazon Japan FBA 온보딩 가이드", "Open Market"],
  ["japan-ugc-conversion-playbook", "UGC 전환 플레이북: 일본 이커머스편", "SNS Marketing"],
  ["crm-followup-template-japan", "일본 리드 CRM 팔로업 템플릿", "Execution Guide"],
  ["japan-ec-kpi-dashboard", "일본 EC KPI 대시보드 설계", "Market Analysis"],
  ["search-to-conversion-flow-japan", "검색 유입에서 구매 전환까지 흐름 설계", "Market Analysis"],
  ["japan-ecommerce-faq-50", "일본 이커머스 FAQ 50선", "Execution Guide"],
  ["marketplace-content-reuse-system", "오픈마켓 콘텐츠 재활용 시스템", "Execution Guide"],
  ["jp-customer-support-sop", "일본 고객응대 SOP 기본안", "Execution Guide"],
  ["japan-brand-trust-signals", "일본 소비자가 보는 신뢰 시그널", "Review Strategy"],
  ["influencer-performance-metrics-jp", "일본 인플루언서 성과 지표 표준", "SNS Marketing"],
  ["japan-ec-ad-creative-patterns", "일본 EC 광고 크리에이티브 패턴", "SNS Marketing"],
  ["product-localization-checklist-jp", "제품 현지화 체크리스트 (일본)", "Execution Guide"],
  ["japan-entry-consulting-agenda", "일본 진출 컨설팅 아젠다 샘플", "Execution Guide"],
]

function createPost(slug, title, category, index) {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`)
  if (fs.existsSync(fullPath)) return false
  const date = new Date(2026, 0, 1 + index).toISOString().slice(0, 10)
  const tags = tagByCategory[category] || ["일본진출", "실행"]
  const body = `## 요약

${title} 관련 핵심 실행 포인트를 빠르게 확인할 수 있도록 정리했습니다.

## 핵심 포인트

- 일본 시장 기준으로 우선순위를 정합니다.
- 채널별 실행 과제를 분리합니다.
- 4주 단위로 성과를 점검합니다.

## 실행 가이드

1. 현재 상태 진단
2. 채널 우선순위 설정
3. 운영 액션 실행
4. 리포트 기반 개선

## 결론

이 글은 실무팀이 바로 적용할 수 있는 기준을 제공합니다.`

  const fm = {
    title,
    description: `${title}에 대한 실무형 인사이트입니다.`,
    category,
    tags,
    date,
    image: baseImage,
  }
  fs.writeFileSync(fullPath, matter.stringify(body, fm), "utf8")
  return true
}

updateExistingTags()

let created = 0
newPosts.forEach(([slug, title, category], idx) => {
  if (createPost(slug, title, category, idx)) created += 1
})

const total = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).length
console.log(JSON.stringify({ created, total }, null, 2))
