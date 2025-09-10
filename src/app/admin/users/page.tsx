import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserClient } from "./user-client"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session || session.user?.role !== "ADMIN") {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage and view customer accounts
        </p>
      </div>

      <UserClient />
    </div>
  )
}