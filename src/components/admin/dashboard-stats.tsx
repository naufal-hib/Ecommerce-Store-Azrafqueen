import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Package, ShoppingCart } from "lucide-react"
import { prisma } from "@/lib/prisma"

export async function DashboardStats() {
  // Get stats from database
  const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
  ])

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue._sum.totalAmount || 0}`,
      icon: DollarSign,
      description: "+20.1% from last month",
    },
    {
      title: "Users",
      value: totalUsers,
      icon: Users,
      description: "+180.1% from last month",
    },
    {
      title: "Products",
      value: totalProducts,
      icon: Package,
      description: "+19% from last month",
    },
    {
      title: "Orders",
      value: totalOrders,
      icon: ShoppingCart,
      description: "+201 since last hour",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}