import {
  faqItems,
  serviceComparisonRows,
  knowledgeGuides,
} from "@/lib/aeo-content"

const SITE_URL = "https://collaboticket.com"

export function HomeJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "콜라보티켓",
    alternateName: "CollaboTicket",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description:
      "콜라보티켓은 한국 브랜드의 일본 시장 진출을 A부터 Z까지 실행하는 파트너입니다. 일본 오픈마켓 운영, 일본 SNS·인플루언서·리뷰 마케팅, 일본 광고, 일본 물류, 일본 법인 설립, 일본 상표 등록을 통합 지원하며, 브랜드와 장기 협업 가능한 일본 현지 인플루언서 연결이 핵심 차별점입니다.",
    foundingDate: "2020",
    address: {
      "@type": "PostalAddress",
      streetAddress: "서울시 마포구 포은로8길 29, 477",
      addressLocality: "서울",
      addressCountry: "KR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-70-8057-6518",
      email: "partner@collaboticket.com",
      contactType: "customer service",
      availableLanguage: ["Korean", "Japanese"],
    },
    sameAs: [SITE_URL],
    knowsAbout: [
      "일본 마케팅",
      "일본 시장 진출",
      "일본 SNS 마케팅",
      "일본 인플루언서 마케팅",
      "일본 리뷰 마케팅",
      "Qoo10",
      "Rakuten",
      "Amazon Japan",
      "Yahoo Shopping",
      "일본 물류",
      "일본 법인 설립",
      "일본 상표 등록",
    ],
  }

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "콜라보티켓",
    url: SITE_URL,
    inLanguage: "ko",
    description: "데이터로 설계하는 일본 시장 진출 전략",
    publisher: { "@type": "Organization", name: "콜라보티켓" },
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: SITE_URL,
      },
    ],
  }

  const services = serviceComparisonRows.map((row) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: row.service,
    description: row.support,
    provider: { "@type": "Organization", name: "콜라보티켓" },
    areaServed: { "@type": "Country", name: "Japan" },
    serviceOutput: row.deliverables,
  }))

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const articles = knowledgeGuides.map((guide) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${SITE_URL}${guide.href}`,
    author: { "@type": "Organization", name: "콜라보티켓" },
    publisher: { "@type": "Organization", name: "콜라보티켓" },
    inLanguage: "ko",
  }))

  const graph = [organization, webSite, breadcrumb, faqPage, ...services, ...articles]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  )
}
