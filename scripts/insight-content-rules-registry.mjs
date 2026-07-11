/**
 * CollaboTicket 인사이트 콘텐츠 룰 마스터 레지스트리
 *
 * 생성 프롬프트·후처리·검증 스크립트의 단일 관리 지점입니다.
 * 새 룰 추가 시 이 파일을 먼저 갱신하고 CONTENT_RULES_VERSION을 올리세요.
 */

import { INSIGHT_LANGUAGE_RULES_PROMPT } from "../lib/insight-language-rules.mjs"
import { TITLE_YEAR_RULES_PROMPT } from "../lib/insight-title-year-rules.mjs"
import { MARKDOWN_HYGIENE_RULES_PROMPT } from "../lib/insight-markdown-hygiene.mjs"
import { OPERATIONAL_DATA_RULES } from "./insight-operational-data-rules.mjs"
import { CANONICAL_HUBS } from "./insight-unique-angles.mjs"

/** rewrite/import progress 파일과 맞춰야 재생성 트리거가 동작합니다 */
export const CONTENT_RULES_VERSION = "v3-managed"

/**
 * @typedef {Object} ContentRuleEntry
 * @property {string} id
 * @property {string} title
 * @property {string} summary
 * @property {string} [module] - 구현 파일 경로
 * @property {boolean} [generation] - AI 생성 프롬프트에 포함
 * @property {boolean} [runtime] - 사이트 렌더 시 적용
 * @property {string[]} [enforce] - npm script 이름 (인자 없음)
 * @property {string[]} [fix] - 위반 시 자동 수정 스크립트
 */

/** @type {ContentRuleEntry[]} */
export const CONTENT_RULE_REGISTRY = [
  {
    id: "structure-fact-insight-action",
    title: "FACT / INSIGHT / ACTION 3층 구조",
    summary:
      "외부 팩트·운영 사례·실행 단계를 섞지 않고 분리합니다. INSIGHT는 CollaboTicket 운영 데이터 접두어를 사용합니다.",
    module: "scripts/insight-content-rules.mjs",
    generation: true,
  },
  {
    id: "optional-insight-section",
    title: "INSIGHT 섹션 선택적 포함",
    summary:
      "체크리스트·컴플라이언스·시장 허브 글에는 INSIGHT를 넣지 않습니다. KPI·메가와리·채널 운영·타임리 이벤트 글에만 1건 포함합니다.",
    module: "scripts/insight-ops-slugs.mjs",
    generation: true,
    enforce: ["prune:insight-ops"],
    fix: ["prune:insight-ops"],
  },
  {
    id: "no-generic-ad-metrics",
    title: "주제 무관 CTR/CVR/ROAS 표 금지",
    summary:
      "관세·물류·현지화·CS 글에 광고 지표 표를 넣지 않습니다. 광고·전환·KPI 주제 글에만 사용합니다.",
    module: "scripts/insight-ops-slugs.mjs",
    generation: true,
    enforce: ["prune:insight-ops"],
  },
  {
    id: "operational-data-bounds",
    title: "운영 사례 수치 현실성",
    summary:
      "익명 B/D 사례의 CTR·CVR·ROAS·광고비·리뷰 수를 허용 범위 내에서만 사용합니다. FACT 외부 통계는 변경하지 않습니다.",
    module: "scripts/insight-operational-data-rules.mjs",
    generation: true,
    enforce: ["fix:operational-data"],
    fix: ["fix:operational-data"],
  },
  {
    id: "case-label-assignment",
    title: "사례 브랜드 라벨 슬러그별 1건",
    summary:
      "헤어케어 B·스킨케어 D 보일러플레이트를 모든 글에 반복하지 않습니다. 슬러그별 할당 라벨만 사용합니다.",
    module: "scripts/insight-unique-angles.mjs",
    generation: true,
    enforce: ["enforce:case-labels"],
    fix: ["enforce:case-labels"],
  },
  {
    id: "language-korean-only",
    title: "한국어 전용 (한·일 혼용 금지)",
    summary:
      "제목·설명·본문·FAQ는 한국어로 작성합니다. 일본어는 백틱 UI 리터럴·공식 행사명 괄호 표기·URL·References에만 허용합니다.",
    module: "lib/insight-language-rules.mjs",
    generation: true,
    runtime: true,
    enforce: ["scan:insight-language"],
    fix: ["fix:insight-language"],
  },
  {
    id: "plaintext-polish",
    title: "플레인텍스트 정리 (**·일본 조사 누수)",
    summary:
      "제목·요약·본문에 ** 마크다운이 그대로 노출되거나 한국어 문장에 を·バズ離れ 등 일본어 조사·표현이 섞이지 않게 정리합니다.",
    module: "lib/insight-plaintext-polish.mjs",
    generation: true,
    runtime: true,
    enforce: ["scan:insight-language"],
    fix: ["fix:insight-language"],
  },
  {
    id: "title-publish-year-alignment",
    title: "제목·업로드 날짜·본문 연도 정합",
    summary:
      "업로드 연도와 FACT 데이터 연도에 맞춰 제목 연도를 씁니다. 2024년 게시·2024년 데이터인데 제목만 2025년인 오류를 금지합니다.",
    module: "lib/insight-title-year-rules.mjs",
    generation: true,
    enforce: ["scan:insight-title-years"],
    fix: ["fix:insight-title-years"],
  },
  {
    id: "markdown-hygiene",
    title: "마크다운 노출 기호·FAQ 형식",
    summary:
      "본문에 ### 가 텍스트로 노출되거나 FAQ 답변이 빠진 채 다음 질문이 이어지는 오류를 금지합니다. 범용 FAQ 보일러플레이트 반복도 제거합니다.",
    module: "lib/insight-markdown-hygiene.mjs",
    generation: true,
    runtime: true,
    enforce: ["scan:insight-markdown"],
    fix: ["fix:insight-markdown"],
  },
  {
    id: "heading-faq-single-line",
    title: "제목·소제목·FAQ 질문 자연 줄바꿈",
    summary:
      "기사 H1(title)·FACT/INSIGHT/ACTION ## 제목·FAQ ### 질문은 한 줄로 작성합니다. 렌더 시 em max-width·pretty wrap으로 불필요하게 줄바꿈되지 않도록 CSS를 적용합니다.",
    module: "app/globals.css",
    generation: true,
    runtime: true,
    enforce: ["scan:insight-markdown"],
    fix: ["fix:insight-markdown"],
  },
  {
    id: "sanitize-output-hygiene",
    title: "본문 후처리·누수 제거",
    summary:
      "JSON description 누수, ## 관련 리포트, 영문 boilerplate, Mega Warí 오타, 잘못된 FAQ 제목을 렌더 전 제거합니다.",
    module: "lib/sanitize-insight-content.ts",
    runtime: true,
    generation: true,
  },
  {
    id: "toss-tone",
    title: "토스형 한국어 톤",
    summary: "~합니다/~해요 체를 사용하고 ~한다/~함 등 보고서체는 금지합니다.",
    module: "scripts/insight-content-rules.mjs",
    generation: true,
    fix: ["retone:insights"],
  },
  {
    id: "anti-duplication",
    title: "코퍼스 중복 방지",
    summary:
      "허브 글 링크로 대체하고, 플랫폼 역할 표·FAQ·INSIGHT 블록을 글마다 복붙하지 않습니다.",
    module: "scripts/insight-unique-angles.mjs",
    generation: true,
    fix: ["dedup:insights", "strip:insight-duplicates"],
  },
  {
    id: "insight-cover-images",
    title: "커버 이미지 URL 유효성",
    summary: "깨진 Unsplash·잘못된 이미지 ID를 스캔하고 대체합니다.",
    module: "scripts/fix-broken-insight-images.mjs",
    enforce: ["scan:insight-images"],
    fix: ["fix:insight-images"],
  },
  {
    id: "home-briefing-diversity",
    title: "메인 주간 브리핑 카테고리 다양화",
    summary:
      "최신 5개 단순 노출 대신 플랫폼·주제·산업 버킷별 1건씩 선정합니다. 라벨은 platforms[0] 대신 제목·슬러그 기반 버킷을 사용합니다.",
    module: "lib/home-weekly-briefing.ts",
    runtime: true,
  },
]

/** 생성 프롬프트: INSIGHT 포함 여부 */
export const OPTIONAL_INSIGHT_RULES_PROMPT = `INSIGHT section policy (critical — prevents generic ops tables everywhere):
- Include "## INSIGHT: CollaboTicket 운영 데이터" ONLY when this topic needs an execution case study.
- OMIT INSIGHT entirely for: compliance checklists, localization templates, CS SOP, customs guides without ad ops, market overview hubs, FAQ hubs.
- INCLUDE INSIGHT for: KPI dashboards, megawari/sale runbooks, channel launch execution, influencer performance, timed platform events (PayPay祭, Super Sale).
- Never paste generic B/D CTR·CVR·ROAS tables into unrelated topics (customs, logistics, labeling).
- If INSIGHT is omitted, link /insights/${CANONICAL_HUBS.kpiOps} in ## 다음 단계 instead.`

/** 생성 프롬프트: 출력 후 금지 패턴 */
export const SANITIZE_OUTPUT_RULES_PROMPT = `Output hygiene (never put these in markdown body):
- No trailing {"description": "..."} JSON lines from prompts
- No "## 관련 리포트" section — related posts are shown in the page UI
- No English footers: "For more insights...", "Explore further...", "This report leverages..."
- FAQ ### headings must be the actual question text — not "질문?" or "Q1:"
- Spell megawari as 메가와리 — never "Mega Warí" or "Mega Wari"
- No <aside> or <script> HTML blocks in markdown source`

/** 생성 프롬프트: 중복·허브 */
export function buildAntiDuplicationPrompt() {
  return `Anti-duplication (corpus of 50+ reports — each must feel distinct):
- Every article has ONE unique focus angle — never copy FACT/INSIGHT/FAQ blocks from sibling posts
- Canonical hubs (link instead of repeating):
  · Market TAM/CAGR: /insights/${CANONICAL_HUBS.marketData}
  · Platform role matrix: /insights/${CANONICAL_HUBS.platformRoles}
  · Generic FAQ hub: /insights/${CANONICAL_HUBS.faq}
  · KPI definitions + aggregate ops: /insights/${CANONICAL_HUBS.kpiOps}
- INSIGHT: ONE primary anonymized case (max 2 if this article compares channels). Do NOT default to "헤어케어 B + 스킨케어 D" in every post
- "## 플랫폼별 역할 정리": ONLY on channel-entry-strategy hub; other posts use "## 다음 단계" with 2-3 sentences + link to channel strategy
- FAQ: 4-5 questions answerable ONLY from this article's topic — no generic "시장 규모/어떤 플랫폼/리뷰 중요성" unless this IS the FAQ hub
- Tables must be topic-specific (not the same 4-platform boilerplate row text)`
}

/** npm run check:content-rules 에서 실행할 검증 목록 */
export const CONTENT_RULE_CHECKS = [
  { id: "language-korean-only", script: "scan:insight-language", strict: true },
  { id: "title-publish-year-alignment", script: "scan:insight-title-years", strict: true },
  { id: "markdown-hygiene", script: "scan:insight-markdown", strict: true },
  { id: "insight-cover-images", script: "scan:insight-images", strict: false },
]

/** 버전별 변경 이력 (운영 참고용) */
export const CONTENT_RULES_CHANGELOG = [
  {
    version: "v3-managed",
    date: "2026-07-09",
    changes: [
      "마스터 레지스트리(scripts/insight-content-rules-registry.mjs) 도입",
      "한·일 혼용 방지 룰 + scan/fix 파이프라인",
      "제목·업로드 날짜·본문 연도 정합 룰 + scan/fix 파이프라인",
      "INSIGHT 선택적 포함·광고 지표 표 제한 명문화",
      "sanitize 후처리 룰 생성 프롬프트 반영",
      "메인 브리핑 카테고리 다양화(런타임) 문서화",
      "check:content-rules 일괄 검증 스크립트",
    ],
  },
  {
    version: "v2-report",
    date: "2026-03",
    changes: [
      "FACT/INSIGHT/ACTION 리포트 구조",
      "토스형 톤·운영 데이터 범위·중복 방지",
    ],
  },
]

export function listContentRules() {
  return CONTENT_RULE_REGISTRY.map((rule) => ({
    id: rule.id,
    title: rule.title,
    generation: Boolean(rule.generation),
    runtime: Boolean(rule.runtime),
    enforce: rule.enforce ?? [],
    fix: rule.fix ?? [],
  }))
}

/** AI 생성 system prompt에 합칠 룰 블록 */
export function buildManagedRulePromptBlocks() {
  return {
    operationalData: OPERATIONAL_DATA_RULES,
    optionalInsight: OPTIONAL_INSIGHT_RULES_PROMPT,
    language: INSIGHT_LANGUAGE_RULES_PROMPT,
    titleYear: TITLE_YEAR_RULES_PROMPT,
    markdownHygiene: MARKDOWN_HYGIENE_RULES_PROMPT,
    sanitizeOutput: SANITIZE_OUTPUT_RULES_PROMPT,
    antiDuplication: buildAntiDuplicationPrompt(),
  }
}
