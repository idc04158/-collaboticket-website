import type { ReactNode } from "react"

import { articleMdxComponents } from "@/components/article"
import { renderInsightMdx } from "@/lib/render-insight-mdx"

type Props = {
  source: string
  className?: string
  midCta?: ReactNode
}

/**
 * Renders insight MDX (markdown + article visual components).
 * Place <InsightMidCta /> in the source to inject the mid-article CTA.
 */
export async function InsightMdxBody({ source, className, midCta }: Props) {
  const { content } = await renderInsightMdx({
    source,
    components: {
      ...articleMdxComponents,
      InsightMidCta: () => <>{midCta}</>,
    },
  })

  return <div className={className || "insight-body"}>{content}</div>
}
