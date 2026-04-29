export type Webinar = {
  id: string
  date: string
  endAt: string
  dateLabel: string
  title: string
  summary: string
  image: string
}

export const webinars: Webinar[] = [
  {
    id: "instagram-strategy-2026-04",
    date: "2026-04-28",
    endAt: "2026-04-29T00:00:00+09:00",
    dateLabel: "2026년 4월 28일 (화) 14:00 LIVE",
    title: "일본에서 팔리는 브랜드는 인스타그램 전략부터 다릅니다",
    summary:
      "일본 시장에서 브랜드 신뢰를 만드는 인스타그램 운영 구조와 판매 전환 전 단계의 콘텐츠 전략을 다룹니다.",
    image: "/webinars/webinar-2026-04.png",
  },
  {
    id: "trusted-brand-2026-02",
    date: "2026-02-24",
    endAt: "2026-02-25T00:00:00+09:00",
    dateLabel: "2026년 2월 24일 (화) 14:00 LIVE",
    title: "일본 시장에서 '신뢰받는 브랜드' 만들기",
    summary:
      "일본 SNS 기본 정보부터 SNS 상시 페이지, 체험단, 물류·대금처리까지 일본 브랜딩 실행 구조를 정리했습니다.",
    image: "/webinars/webinar-2026-02.png",
  },
  {
    id: "k-cosmetic-entry-2026-01",
    date: "2026-01-27",
    endAt: "2026-01-28T00:00:00+09:00",
    dateLabel: "2026년 1월 27일 (화) 14:00 ONLINE LIVE",
    title: "K-코스메틱, 일본시장 성공진출전략",
    summary:
      "인증, 물류, 마케팅, 해외송금 등 K-코스메틱 일본 판매에 필요한 정보를 한 자리에서 정리한 세션입니다.",
    image: "/webinars/webinar-2026-01.png",
  },
]

export function splitWebinars(now = new Date()) {
  const upcoming = webinars
    .filter((webinar) => now < new Date(webinar.endAt))
    .sort((a, b) => a.date.localeCompare(b.date))

  const past = webinars
    .filter((webinar) => now >= new Date(webinar.endAt))
    .sort((a, b) => b.date.localeCompare(a.date))

  return { upcoming, past }
}
