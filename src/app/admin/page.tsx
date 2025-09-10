import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { SalesChart } from "@/components/admin/sales-chart"
import { TopProducts } from "@/components/admin/top-products"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard
        </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<div>Loading chart...</div>}>
                  <SalesChart />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Your best selling products this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading products...</div>}>
                  <TopProducts />
                </Suspense>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading orders...</div>}>
                  <RecentOrders />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2">
                  <button className="p-3 text-left border rounded-lg hover:bg-muted">
                    Add New Product
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-muted">
                    View Pending Orders
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-muted">
                    Generate Report
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-muted">
                    Manage Users
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics components will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and download reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Report generation will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}