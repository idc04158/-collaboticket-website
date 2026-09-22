import { AlertTriangle } from "lucide-react"
import { ArticleAlert } from "./_shell"

type Props = {
  title?: string
  children?: React.ReactNode
  body?: string
}

export function WarningBox({ title = "주의해야 하는 이유", body, children }: Props) {
  return (
    <ArticleAlert icon={AlertTriangle} title={title} tone="warning" body={body}>
      {children}
    </ArticleAlert>
  )
}
