import type { Metadata } from "next"

import { AdminInsightsClient } from "@/components/admin-insights-client"

export const metadata: Metadata = {
  title: "인사이트 관리자 | CollaboTicket",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminInsightsPage() {
  return <AdminInsightsClient />
}
