import { Lightbulb } from "lucide-react"
import { ArticleAlert } from "./_shell"

type Props = {
  title?: string
  children?: React.ReactNode
  body?: string
}

export function InsightBox({ title = "?? ????", body, children }: Props) {
  return (
    <ArticleAlert icon={Lightbulb} title={title} tone="brand" body={body}>
      {children}
    </ArticleAlert>
  )
}
