import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sales Operating System Dashboard",
  description: "A comprehensive sales dashboard with momentum tracking and AI insights",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}
