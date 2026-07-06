const SITE_URL = "https://collaboticket.com"

type Props = {
  title: string
  description: string
  date: string
  slug: string
  image?: string
  aiSummary: string
}

export function InsightArticleJsonLd({ title, description, date, slug, image, aiSummary }: Props) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    abstract: aiSummary,
    datePublished: date,
    dateModified: date,
    inLanguage: "ko-KR",
    mainEntityOfPage: `${SITE_URL}/insights/${slug}`,
    url: `${SITE_URL}/insights/${slug}`,
    image: image ? [image] : undefined,
    author: {
      "@type": "Organization",
      name: "CollaboTicket",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "CollaboTicket",
      url: SITE_URL,
    },
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
  )
}
