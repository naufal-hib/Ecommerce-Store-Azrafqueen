"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { OrderDialog } from "@/components/admin/order-dialog"

interface Order {
  id: string
  orderNumber: string
  userId: string
  status: string
  totalAmount: number
  paymentStatus: string
  shippingCost: number
  taxAmount: number
  discountAmount: number
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface OrderDetail extends Order {
  orderItems: {
    id: string
    productId: string
    quantity: number
    price: number
    total: number
    product: {
      id: string
      name: string
      sku: string
    }
  }[]
}

export function OrderClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingOrder, setViewingOrder] = useState<OrderDetail | null>(null)
  const { toast } = useToast()

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(status !== "all" && { status }),
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
        setTotalPages(data.pagination.pages)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [page, search, status, toast])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleViewOrder = async (order: Order) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`)
      const data = await response.json()

      if (response.ok) {
        setViewingOrder(data)
        setIsDialogOpen(true)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      })
    }
  }

  const handleOrderUpdated = () => {
    setIsDialogOpen(false)
    setViewingOrder(null)
    fetchOrders()
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "processing":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Get payment status badge variant
  const getPaymentStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Filters</CardTitle>
          <CardDescription>
            Search and filter customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>
            {orders.length} orders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.orderNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.user.name || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {viewingOrder && (
        <OrderDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          order={viewingOrder}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  )
}