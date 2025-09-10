import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ReportsClient } from "./reports-client"

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session || session.user?.role !== "ADMIN") {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download business reports
        </p>
      </div>

      <ReportsClient />
    </div>
  )
}