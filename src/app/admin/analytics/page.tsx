import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AnalyticsClient } from "./analytics-client"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session || session.user?.role !== "ADMIN") {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          View business insights and performance metrics
        </p>
      </div>

      <AnalyticsClient />
    </div>
  )
}