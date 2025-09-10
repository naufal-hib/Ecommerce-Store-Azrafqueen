import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OrderClient } from "./order-client"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session || session.user?.role !== "ADMIN") {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      <OrderClient />
    </div>
  )
}