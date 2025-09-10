"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onUpdated: () => void
}

export function OrderDialog({
  open,
  onOpenChange,
  order,
  onUpdated,
}: OrderDialogProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(order?.status || "")
  const { toast } = useToast()

  // Update status when order changes
  useEffect(() => {
    if (order) {
      setStatus(order.status)
    }
  }, [order])

  const updateOrderStatus = async () => {
    if (!order) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        })
        onUpdated()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
      hour: "2-digit",
      minute: "2-digit",
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

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {order.user.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.user.email}
              </p>
              <p>
                <span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Order Status</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Current Status:</span>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 font-medium border-b">
              <div>Product</div>
              <div>SKU</div>
              <div className="text-right">Price</div>
              <div className="text-right">Quantity</div>
              <div className="text-right">Total</div>
            </div>
            {order.orderItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border-b">
                <div>{item.product.name}</div>
                <div>{item.product.sku}</div>
                <div className="text-right">{formatCurrency(item.price)}</div>
                <div className="text-right">{item.quantity}</div>
                <div className="text-right">{formatCurrency(item.total)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div></div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.totalAmount - order.shippingCost - order.taxAmount + order.discountAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={updateOrderStatus}
            disabled={loading || status === order.status}
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}