export type SelfDiagnosisResult = {
  enteredJapan: boolean | null
  concern?: string
  preStage?: string
  preInterest?: string
  completedAt: string
}

const STORAGE_KEY = "ct_self_diagnosis"

export function saveSelfDiagnosis(result: Omit<SelfDiagnosisResult, "completedAt">) {
  if (typeof window === "undefined") return

  const payload: SelfDiagnosisResult = {
    ...result,
    completedAt: new Date().toISOString(),
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota errors */
  }
}

export function loadSelfDiagnosis(): SelfDiagnosisResult | null {
  if (typeof window === "undefined") return null

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SelfDiagnosisResult
  } catch {
    return null
  }
}

export function clearSelfDiagnosis() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(STORAGE_KEY)
}

export function formatSelfDiagnosisSummary(result: SelfDiagnosisResult | null | undefined) {
  if (!result) return ""

  const lines: string[] = []

  if (result.enteredJapan === true) lines.push("일본 진출: 진행 중")
  if (result.enteredJapan === false) lines.push("일본 진출: 준비/검토 단계")
  if (result.concern) lines.push(`주요 고민: ${result.concern}`)
  if (result.preStage) lines.push(`현재 단계: ${result.preStage}`)
  if (result.preInterest) lines.push(`관심 영역: ${result.preInterest}`)
  if (result.completedAt) lines.push(`진단 완료: ${result.completedAt}`)

  return lines.join("\n")
}
