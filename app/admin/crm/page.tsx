import type { Metadata } from "next"

import { AdminCrmClient } from "@/components/admin-crm-client"

export const metadata: Metadata = {
  title: "CRM 관리자 | CollaboTicket",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminCrmPage() {
  return <AdminCrmClient />
}
