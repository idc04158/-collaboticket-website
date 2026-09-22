/**
 * Article Visual System v2 — stacked on shared system prompt.
 * Components: components/article/ (MDX).
 */

export function buildVisualComponentsLayerRules() {
  return `### Article Visual System v2 (MDX 컴포넌트)
글 작성 후 본문에 React 컴포넌트를 삽입한다.
목적은 장식이 아니라, 독자가 컨설팅 리포트를 훑어보듯 빠르게 이해하게 만드는 것이다.

사용 가능(코드명 — 독자에게 그대로 노출 금지):
InsightBox, WarningBox, Checklist, StepFlow, DecisionTree, CauseEffect, Timeline,
ComparisonTable, PriorityMatrix, ProsCons, BeforeAfter, MetricCard, InfoCardGrid,
SummaryCard, Quote, Framework, Funnel, FAQCard

#### 본문 → 컴포넌트 변환 규칙 (작성 후 필수)
글을 **모두 작성한 뒤** 각 문단을 다시 읽는다.
문장을 그대로 출력·박스에 넣지 않는다.
문단 안의 정보를 컴포넌트로 변환할 수 있다면 **반드시 변환**한다.
문장을 구조화·시각화한다 (복사 붙여넣기 금지).

변환 예:
- 확인 순서 / 단계 / 프로세스 / 실행 순서 → StepFlow
- 원인 (→영향→결과→해결) → CauseEffect
- 긴 한국어 비교·진단 매핑(신호→의심→화면 등) → **InfoCardGrid** (표 금지)
- 짧은 라벨 위주 간단 비교만 → ComparisonTable
- 체크 항목 → Checklist
- 우선순위 → PriorityMatrix
- Yes / No 분기 → DecisionTree
- 노출→클릭→구매 성과 흐름 → Funnel
- 변경 전후 → BeforeAfter
- 시간 흐름 → Timeline
- 핵심 메시지 → InsightBox
- 결론 정리 → SummaryCard
- 주의 → WarningBox

변환 후 본문에는 컴포넌트가 담은 단계를 문장으로 다시 나열하지 않는다.
맥락·왜 중요한지만 짧게 남긴다.

#### StepFlow 필수 규칙 (최우선)
본문에서 순서·단계·프로세스·흐름·확인 순서·진단 순서·실행 순서 등을 설명하면
**반드시 \`<StepFlow />\`를 생성한다.**
StepFlow 없이 순서를 문장·번호 목록으로만 설명하는 것은 금지.

예) 셀러 관리자에서 확인하는 순서
→ StepFlow steps: ① 검색어 성과 확인 → ② 비즈니스 리포트 확인 → ③ 광고 검색어 확인 → ④ 재고 확인 → ⑤ 타이틀 수정

#### 자동 선택
- 순서/단계/프로세스/흐름/확인·진단·실행 순서 → **StepFlow (필수)**
- 원인→결과 → CauseEffect
- 문제→원인→확인→실행 프레임 → Framework (StepFlow와 혼동하지 말 것. 순서가 핵심이면 StepFlow)
- 우선순위 → PriorityMatrix
- 체크 항목 → Checklist
- YES/NO 분기 → DecisionTree
- 노출→클릭→구매 성과 흐름 → Funnel
- 긴 한국어 비교·진단 매핑 → **InfoCardGrid** (셀이 길어질 비교는 ComparisonTable 쓰지 말 것)
- 짧은 라벨 비교만 → ComparisonTable
- 장단점 → ProsCons
- 변경 전후 → BeforeAfter
- 시간 흐름 → Timeline
- 핵심 메시지 → InsightBox
- 숫자 강조 → MetricCard
- 결론 정리 → SummaryCard
- 주의 → WarningBox

#### Props 필수 / 빈 컴포넌트 금지
- 컴포넌트는 **본문 내용을 기반으로 Props를 반드시 채운다.**
- 빈 컴포넌트를 출력하지 않는다. (예: \`<StepFlow />\`, \`<Checklist items={[]} />\`, title만 있고 steps/items/body 없음)
- 컴포넌트 내부 데이터(steps, items, chain, points, question/yes/no, body 등)를 본문에서 채울 수 없으면 **그 컴포넌트 자체를 생성하지 않는다.**
- Props 값은 본문의 핵심을 요약·구조화한 실제 내용이어야 하며, placeholder·"..."·더미 문장 금지.

#### 삽입 규칙
- 한 글에 3~6개만 사용 (순서 설명이 있으면 StepFlow를 반드시 포함 — 단, steps를 채울 수 있을 때만)
- 같은 컴포넌트 연속 사용 금지
- 모든 글에 동일 조합(예: Framework→Checklist→Summary)을 반복하지 말 것. 주제별 조합을 바꾼다
- 모든 소제목마다 넣지 말 것
- 6줄 이상 연속 텍스트·2스크롤 이상 텍스트만 이어지는 구간은 반드시 분리
- 빈 카드·장식용 박스 금지. 요약·비교·실행 순서·분기만
- Props 기반 self-closing JSX (예: <StepFlow title="실행 순서" steps={[...]} />)
- 중간 CTA는 <InsightMidCta /> 최대 1회
- frontmatter(YAML)에 컴포넌트 넣지 말 것

#### FAQ 아코디언 (필수)
\`## 자주 묻는 질문\` 섹션은 사이트에서 아코디언으로 렌더된다.
- 작성: \`###\` 질문 + 답변 문단 (또는 \`<FAQCard items={[...]} />\`)
- UX: 질문만 보이고 답은 클릭 시 펼침. FAQ 답을 긴 본문으로 항상 펼쳐 두지 말 것.
- \`## 자주 묻는 질문\` 제목은 유지하고, 개별 질문은 아코디언 트리거로만 쓴다.

#### 컴포넌트 제목 (title prop) — 필수
개발자용 이름 금지: Framework, Step Flow, Decision, Summary, Insight, Checklist, Funnel, Timeline 등.
독자가 바로 이해하는 한국어 제목만 쓴다.
예: 실무 진단 순서 / 먼저 확인하세요 / 핵심 체크포인트 / 실무 인사이트 / 주의해야 하는 이유 / 이 글의 핵심 / 실행 순서

#### 용어 현지화
본문·컴포넌트 모두 자연스러운 한국어. 영어 직역체 금지. 영어/Amazon은 첫 등장만 \`한국어(원문)\`, 일본어는 첫 등장만 \`일본어(한국어)\`, 이후 한국어만.
메뉴 경로는 영어 나열 금지 → \`셀러 관리자 → 브랜드 분석 → 검색어 성과\` 형태.
(상세 규칙은 용어 현지화 레이어와 동일)

#### 최종 UX 검사 (출력 전)
글을 쓴 뒤 문단을 다시 읽고 변환 가능한 정보를 컴포넌트로 바꿨는가 /
문장을 박스에 그대로 넣지 않고 구조화했는가 /
텍스트만 긴 구간 없음 / 순서·단계·프로세스를 문장만으로 설명하지 않았는가(StepFlow 필수) /
모든 컴포넌트 Props가 본문 기반으로 채워져 있는가 / 빈 컴포넌트·빈 배열 없음 /
장식 컴포넌트 없음 / 연속 동일 컴포넌트 없음 / 제목 독자 친화 /
용어: 영어는 한국어(원문), 일본어는 일본어(한국어) 첫 표기 후 한국어만 / 훑어보기만으로 핵심 이해 가능.`
}
