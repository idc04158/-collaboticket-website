const SITE_URL = "https://collaboticket.com"

type Props = {
  posts: Array<{ slug: string; title: string; description: string; date: string }>
  stats: {
    totalInsights: number
    lastUpdated: string
  }
}

export function InsightsHubJsonLd({ posts, stats }: Props) {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "일본 시장 인사이트",
    description:
      "일본 EC, SNS, 소비자 트렌드, 광고 데이터, 플랫폼 변화, 성공 사례를 분석한 CollaboTicket 데이터 센터",
    url: `${SITE_URL}/insights`,
    inLanguage: "ko-KR",
    numberOfItems: stats.totalInsights,
    dateModified: stats.lastUpdated,
    publisher: {
      "@type": "Organization",
      name: "CollaboTicket",
      url: SITE_URL,
    },
    hasPart: posts.slice(0, 12).map((post) => ({
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_URL}/insights/${post.slug}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
    />
  )
}
