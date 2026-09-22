import { InsightNextStepCta } from "@/components/insights/insight-next-step-cta"

type Props = {
  slug?: string
  title?: string
}

/** Mid-article CTA — same card language as Next Step */
export function InsightMidCta({ slug, title }: Props) {
  return (
    <InsightNextStepCta
      slug={slug}
      title={title}
      heading="실행 순서 확인하기"
      body="이 글의 체크 항목을 우리 상품 기준으로 다시 정리해 드립니다. 광고처럼 보이지 않게, 다음 단계만 제안합니다."
      ctaLabel="우선순위 받기"
    />
  )
}
