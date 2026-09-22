import { InsightNextStepCta } from "@/components/insights/insight-next-step-cta"

type Props = {
  slug?: string
  title?: string
}

export function InsightDiagnosisCta({ slug, title }: Props) {
  return (
    <div className="pt-[var(--article-space-8)]">
      <InsightNextStepCta
        slug={slug}
        title={title}
        heading="우리 상품에도 적용해보기"
        body="현재 상품·채널·예산만 알려주시면, 이 글의 실행 순서를 기준으로 우선 과제를 정리해 드립니다."
        ctaLabel="무료로 우선순위 받기"
        href={
          slug
            ? `/contact?topic=diagnosis&source=insight-end&slug=${encodeURIComponent(slug)}${
                title ? `&title=${encodeURIComponent(title)}` : ""
              }&step=diagnosis`
            : "/contact?topic=diagnosis"
        }
      />
    </div>
  )
}