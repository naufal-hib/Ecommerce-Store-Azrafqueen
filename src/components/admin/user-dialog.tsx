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

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  emailVerified: Date | null
  orders: {
    id: string
    orderNumber: string
    totalAmount: number
    status: string
    createdAt: Date
  }[]
  reviews: {
    id: string
    rating: number
    comment: string | null
    createdAt: Date
  }[]
}

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onUpdated: () => void
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  onUpdated,
}: UserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState(user?.role || "")
  const { toast } = useToast()

  // Update role when user changes
  useEffect(() => {
    if (user) {
      setRole(user.role)
    }
  }, [user])

  const updateUserRole = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        })
        onUpdated()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update user role",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user role",
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
    })
  }

  // Format datetime
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get role badge variant
  const getRoleVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "default"
      case "SUPER_ADMIN":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Get order status badge variant
  const getOrderStatusVariant = (status: string) => {
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

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            {user.name || "N/A"} ({user.email})
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {user.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Role:</span>
                <Badge variant={getRoleVariant(user.role)} className="ml-2">
                  {user.role}
                </Badge>
              </p>
              <p>
                <span className="font-medium">Joined:</span> {formatDate(user.createdAt)}
              </p>
              <p>
                <span className="font-medium">Email Verified:</span> {user.emailVerified ? formatDate(user.emailVerified) : "Not verified"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Update Role</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Order History</h3>
          {user.orders.length === 0 ? (
            <p className="text-muted-foreground">No orders found</p>
          ) : (
            <div className="border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 font-medium border-b">
                <div>Order #</div>
                <div>Date</div>
                <div className="text-right">Total</div>
                <div>Status</div>
                <div></div>
              </div>
              {user.orders.map((order) => (
                <div key={order.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border-b">
                  <div>{order.orderNumber}</div>
                  <div>{formatDate(order.createdAt)}</div>
                  <div className="text-right">{formatCurrency(order.totalAmount)}</div>
                  <div>
                    <Badge variant={getOrderStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Reviews</h3>
          {user.reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews found</p>
          ) : (
            <div className="border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 font-medium border-b">
                <div>Rating</div>
                <div>Comment</div>
                <div>Date</div>
              </div>
              {user.reviews.map((review) => (
                <div key={review.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div>{review.comment || "No comment"}</div>
                  <div>{formatDateTime(review.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
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
            onClick={updateUserRole}
            disabled={loading || role === user.role}
          >
            {loading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}