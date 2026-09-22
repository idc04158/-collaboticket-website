import type { Metadata } from "next"

import { EnLanding } from "@/components/en/en-landing"

const title = "CollaboTicket | Japan E-commerce Launch and Growth Partner"
const description =
  "CollaboTicket helps brands launch and grow in Japan. One team runs Amazon Japan, Rakuten and Qoo10 operations, local content, influencer and review programs, ads and logistics."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/en",
    languages: {
      ko: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title,
    description,
    url: "/en",
    locale: "en_US",
  },
}

export default function EnglishLandingPage() {
  return <EnLanding />
}
