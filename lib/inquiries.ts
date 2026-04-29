import { promises as fs } from "fs"
import path from "path"

export const calendarBookingUrl = "https://calendar.app.google/AvDtsHt5273Xxchg9"
export const kakaoChannelUrl = "http://pf.kakao.com/_cRCVn"

export type InquiryInput = {
  name: string
  company: string
  email: string
  phone: string
  category: string
  services: string[]
  salesStatus: string
  monthlyRevenue: string
  budget: string
  startTiming: string
  channels?: string
  goal: string
  detail?: string
  source?: string
}

export type Inquiry = InquiryInput & {
  id: string
  createdAt: string
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "hold"
  priority: "high" | "medium" | "low"
  /** true if priority was set manually in CRM */
  priorityManual?: boolean
  memo?: string
  lastEmailAt?: string
  nextFollowUpAt?: string
  nextFollowUpSummary?: string
  emailLogs: EmailLog[]
  todos: CrmTodo[]
  /** relative path under /api/admin/uploads or public — stored filename only */
  businessCardFile?: string
}

export type EmailLog = {
  id: string
  sentAt: string
  subject: string
  summary: string
  body: string
  status: "sent" | "draft" | "failed"
  channel: "resend" | "gmail" | "manual"
}

export type CrmTodo = {
  id: string
  title: string
  dueDate: string
  type: "research" | "proposal" | "schedule" | "follow-up" | "internal"
  done: boolean
  memo?: string
}

const storagePath = path.join(process.cwd(), "data", "inquiries.json")

async function ensureStorage() {
  await fs.mkdir(path.dirname(storagePath), { recursive: true })

  try {
    await fs.access(storagePath)
  } catch {
    await fs.writeFile(storagePath, "[]", "utf8")
  }
}

export async function readInquiries() {
  await ensureStorage()
  const raw = await fs.readFile(storagePath, "utf8")
  const inquiries = JSON.parse(raw) as Inquiry[]
  return inquiries.map(normalizeInquiry)
}

export async function saveInquiry(input: InquiryInput) {
  const inquiries = await readInquiries()
  const inquiry: Inquiry = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    priority: getInitialPriority(input),
    priorityManual: false,
    nextFollowUpAt: getDateOffset(1),
    nextFollowUpSummary: "접수 내용 확인 후 1차 상담 가능 여부 안내",
    emailLogs: [],
    todos: [
      {
        id: crypto.randomUUID(),
        title: `${input.company} 문의 내용 검토`,
        dueDate: getDateOffset(1),
        type: "follow-up",
        done: false,
        memo: "매출 규모, 예산, 희망 서비스를 기준으로 상담 우선순위 판단",
      },
    ],
  }

  inquiries.unshift(inquiry)
  await writeInquiries(inquiries)

  return inquiry
}

export async function writeInquiries(inquiries: Inquiry[]) {
  await ensureStorage()
  await fs.writeFile(storagePath, JSON.stringify(inquiries.map(normalizeInquiry), null, 2), "utf8")
}

export async function updateInquiry(id: string, updates: Partial<Inquiry>) {
  const inquiries = await readInquiries()
  const index = inquiries.findIndex((inquiry) => inquiry.id === id)
  if (index === -1) return null

  inquiries[index] = normalizeInquiry({
    ...inquiries[index],
    ...updates,
  })
  await writeInquiries(inquiries)
  return inquiries[index]
}

export async function appendEmailLog(id: string, log: Omit<EmailLog, "id" | "sentAt">) {
  const inquiries = await readInquiries()
  const index = inquiries.findIndex((inquiry) => inquiry.id === id)
  if (index === -1) return null

  const emailLog: EmailLog = {
    ...log,
    id: crypto.randomUUID(),
    sentAt: new Date().toISOString(),
  }

  inquiries[index] = normalizeInquiry({
    ...inquiries[index],
    lastEmailAt: emailLog.sentAt,
    emailLogs: [emailLog, ...inquiries[index].emailLogs],
  })
  await writeInquiries(inquiries)
  return inquiries[index]
}

export async function seedDemoInquiries() {
  const demo = getDemoInquiries()
  await writeInquiries(demo)
  return demo
}

export function formatInquiryMessage(inquiry: InquiryInput) {
  return [
    `이름: ${inquiry.name}`,
    `회사/브랜드: ${inquiry.company}`,
    `이메일: ${inquiry.email}`,
    `연락처: ${inquiry.phone}`,
    `제품/카테고리: ${inquiry.category}`,
    `필요 서비스: ${inquiry.services.join(", ")}`,
    `현재 판매 상태: ${inquiry.salesStatus}`,
    `최근 월 매출 규모: ${inquiry.monthlyRevenue}`,
    `일본 운영 가능 예산: ${inquiry.budget}`,
    `희망 시작 시점: ${inquiry.startTiming}`,
    `주요 판매 채널: ${inquiry.channels || "-"}`,
    `가장 중요한 목표: ${inquiry.goal}`,
    "",
    `추가 내용:`,
    inquiry.detail || "-",
  ].join("\n")
}

function normalizeInquiry(inquiry: Inquiry): Inquiry {
  return {
    ...inquiry,
    status: inquiry.status || "new",
    priority: inquiry.priority || getInitialPriority(inquiry),
    priorityManual: inquiry.priorityManual ?? false,
    emailLogs: inquiry.emailLogs || [],
    todos: inquiry.todos || [],
  }
}

const URGENCY_RE = /(긴급|ASAP|즉시|빠른|당일|오늘|내일|deadline|urgent)/i

function getInitialPriority(inquiry: InquiryInput): Inquiry["priority"] {
  const blob = `${inquiry.goal}\n${inquiry.detail || ""}\n${inquiry.company}`
  if (URGENCY_RE.test(blob)) return "high"
  if (inquiry.budget.includes("700") || inquiry.budget.includes("1,500") || inquiry.monthlyRevenue.includes("1억원")) {
    return "high"
  }
  if (inquiry.budget.includes("300") || inquiry.monthlyRevenue.includes("5,000")) {
    return "medium"
  }
  return "low"
}

export type ImportCustomerRow = {
  name: string
  company: string
  email: string
  phone: string
  memo?: string
}

export async function bulkImportInquiries(rows: ImportCustomerRow[]) {
  const inquiries = await readInquiries()
  const created: Inquiry[] = []
  for (const row of rows) {
    if (!row.email?.trim() || !row.name?.trim()) continue
    const input: InquiryInput = {
      name: row.name.trim(),
      company: (row.company || "-").trim(),
      email: row.email.trim(),
      phone: (row.phone || "-").trim(),
      category: "리스트 가져오기",
      services: ["상담 필요"],
      salesStatus: "국내 판매 중",
      monthlyRevenue: "",
      budget: "",
      startTiming: "일정 미정 / 정보 수집 단계",
      channels: "",
      goal: row.memo?.trim() || "CSV/Excel 가져오기",
      detail: row.memo?.trim() || "",
      source: "import",
    }
    const inquiry: Inquiry = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new",
      priority: getInitialPriority(input),
      priorityManual: false,
      nextFollowUpAt: getDateOffset(3),
      nextFollowUpSummary: "가져온 리드 — 첫 연락 일정 확인",
      emailLogs: [],
      todos: [],
      memo: row.memo?.trim(),
    }
    inquiries.unshift(normalizeInquiry(inquiry))
    created.push(inquiry)
  }
  await writeInquiries(inquiries)
  return created
}

function getDateOffset(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function getDemoInquiries(): Inquiry[] {
  const now = new Date().toISOString()
  return [
    {
      id: "demo-kirei-beauty",
      createdAt: now,
      status: "qualified",
      priority: "high",
      priorityManual: false,
      name: "김지현",
      company: "Kirei Beauty",
      email: "jihyun@example.com",
      phone: "010-1111-2222",
      category: "스킨케어",
      services: ["오픈마켓 운영대행", "리뷰 체험단/커뮤니티 리뷰"],
      salesStatus: "국내에서 매출 검증 완료",
      monthlyRevenue: "월 5,000만~1억원",
      budget: "월 700만~1,500만원",
      startTiming: "1개월 이내",
      channels: "Qoo10",
      goal: "라쿠텐/Qoo10/Amazon 매출 확대",
      detail: "Qoo10 메가와리 전 리뷰와 상세페이지를 먼저 정리하고 싶습니다.",
      source: "demo",
      memo: "예산과 시작 시점이 명확해 우선 상담 대상. Qoo10 행사 일정 확인 필요.",
      lastEmailAt: getDateOffset(-1),
      nextFollowUpAt: getDateOffset(1),
      nextFollowUpSummary: "Qoo10 메가와리 준비 일정과 리뷰 운영 가능 범위 안내",
      emailLogs: [
        {
          id: "demo-email-1",
          sentAt: getDateOffset(-1),
          subject: "일본 판매 운영 상담 접수 안내",
          summary: "상담 접수 확인 및 Qoo10 운영 자료 요청",
          body: "Qoo10 입점 상태, 대표 SKU, 최근 리뷰 현황을 공유해달라고 안내했습니다.",
          status: "sent",
          channel: "manual",
        },
      ],
      todos: [
        {
          id: "demo-todo-1",
          title: "Qoo10 메가와리 일정 확인",
          dueDate: getDateOffset(1),
          type: "schedule",
          done: false,
          memo: "행사 3주 전 리뷰 확보 가능 여부 체크",
        },
        {
          id: "demo-todo-2",
          title: "리뷰 체험단 견적 초안 작성",
          dueDate: getDateOffset(2),
          type: "proposal",
          done: false,
        },
      ],
    },
    {
      id: "demo-sora-food",
      createdAt: getDateOffset(-2),
      status: "contacted",
      priority: "medium",
      priorityManual: false,
      name: "박민수",
      company: "Sora Food",
      email: "mins@example.com",
      phone: "010-3333-4444",
      category: "건강식품",
      services: ["SNS 마케팅/계정 운영", "일본 진출 전체 설계"],
      salesStatus: "국내 판매 중",
      monthlyRevenue: "월 1,000만~5,000만원",
      budget: "월 300만~700만원",
      startTiming: "3개월 이내",
      channels: "상담 필요",
      goal: "일본 시장 진입 가능성 검토",
      detail: "일본 판매 가능성과 초기 채널 선택을 상담받고 싶습니다.",
      source: "demo",
      memo: "식품 카테고리라 법규/물류 확인 필요. 판매 가능 품목인지 사전 조사.",
      lastEmailAt: getDateOffset(-2),
      nextFollowUpAt: getDateOffset(3),
      nextFollowUpSummary: "건강식품 카테고리 진입 리스크와 필요 자료 안내",
      emailLogs: [],
      todos: [
        {
          id: "demo-todo-3",
          title: "건강식품 일본 판매 규제 확인",
          dueDate: getDateOffset(3),
          type: "research",
          done: false,
        },
      ],
    },
    {
      id: "demo-nami-goods",
      createdAt: getDateOffset(-5),
      status: "proposal",
      priority: "low",
      priorityManual: false,
      name: "이서연",
      company: "Nami Goods",
      email: "seoyeon@example.com",
      phone: "010-5555-6666",
      category: "생활잡화",
      services: ["물류/정산/법인 설립"],
      salesStatus: "일본 입점 준비 중",
      monthlyRevenue: "",
      budget: "",
      startTiming: "일정 미정 / 정보 수집 단계",
      channels: "Amazon Japan",
      goal: "물류·정산·법인 등 운영 기반 구축",
      detail: "Amazon Japan 판매 전 물류 구조를 확인하고 싶습니다.",
      source: "demo",
      memo: "정보 수집 단계. 장기 리드로 관리.",
      nextFollowUpAt: getDateOffset(7),
      nextFollowUpSummary: "물류/정산 준비 체크리스트 전달",
      emailLogs: [],
      todos: [
        {
          id: "demo-todo-4",
          title: "물류 체크리스트 메일 발송",
          dueDate: getDateOffset(7),
          type: "follow-up",
          done: false,
        },
      ],
    },
  ]
}
