import { Badge } from "@/components/ui/badge"

// Mock data - in real app, fetch from database
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    amount: "$250.00",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: "$150.00",
    status: "pending",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    amount: "$350.00",
    status: "processing",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    amount: "$75.00",
    status: "completed",
  },
]

export function RecentOrders() {
  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {order.customer}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.email}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <div className="text-right">
              <p>{order.amount}</p>
              <Badge
                variant={
                  order.status === "completed"
                    ? "default"
                    : order.status === "pending"
                    ? "secondary"
                    : "outline"
                }
                className="mt-1"
              >
                {order.status}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}