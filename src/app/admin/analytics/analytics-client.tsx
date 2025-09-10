"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

// Mock data for analytics
const salesData = [
  { date: "2023-01", sales: 4000, orders: 240 },
  { date: "2023-02", sales: 3000, orders: 139 },
  { date: "2023-03", sales: 2000, orders: 180 },
  { date: "2023-04", sales: 2780, orders: 190 },
  { date: "2023-05", sales: 1890, orders: 120 },
  { date: "2023-06", sales: 2390, orders: 170 },
  { date: "2023-07", sales: 3490, orders: 210 },
]

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Home & Garden", value: 300 },
  { name: "Sports", value: 200 },
  { name: "Books", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const topProducts = [
  { name: "Wireless Headphones", sales: 120, revenue: 12000 },
  { name: "Smart Watch", sales: 95, revenue: 19000 },
  { name: "Bluetooth Speaker", sales: 80, revenue: 6400 },
  { name: "Gaming Keyboard", sales: 70, revenue: 6300 },
  { name: "Smartphone", sales: 65, revenue: 32500 },
]

export function AnalyticsClient() {
  // In a real application, you would fetch data from an API
  // const fetchAnalyticsData = async () => {
  //   try {
  //     const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
  //     const data = await response.json()
  //     // Update state with fetched data
  //   } catch (error) {
  //     // Handle error
  //   }
  // }

  // useEffect(() => {
  //   fetchAnalyticsData()
  // }, [timeRange])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Now</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Showing total sales and orders for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>
              Showing total sales by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Best selling products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest user actions and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New Order</p>
                  <p className="text-sm text-muted-foreground">
                    Order #12345 placed by John Doe
                  </p>
                </div>
                <div className="ml-auto font-medium">+1</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New User</p>
                  <p className="text-sm text-muted-foreground">
                    Jane Smith registered
                  </p>
                </div>
                <div className="ml-auto font-medium">+1</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Product Review</p>
                  <p className="text-sm text-muted-foreground">
                    New review for Wireless Headphones
                  </p>
                </div>
                <div className="ml-auto font-medium">+1</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Payment received for order #12344
                  </p>
                </div>
                <div className="ml-auto font-medium">+$250.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}