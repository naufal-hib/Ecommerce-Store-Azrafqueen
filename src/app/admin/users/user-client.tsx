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
import { UserDialog } from "@/components/admin/user-dialog"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  emailVerified: Date | null
}

interface UserDetail extends User {
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

export function UserClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingUser, setViewingUser] = useState<UserDetail | null>(null)
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(role !== "all" && { role }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setTotalPages(data.pagination.pages)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [page, search, role, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleViewUser = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`)
      const data = await response.json()

      if (response.ok) {
        setViewingUser(data)
        setIsDialogOpen(true)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user details",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      })
    }
  }

  const handleUserUpdated = () => {
    setIsDialogOpen(false)
    setViewingUser(null)
    fetchUsers()
  }

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "Not verified"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Filters</CardTitle>
          <CardDescription>
            Search and filter customer accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            {users.length} users found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name || "N/A"}</div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        {formatDate(user.emailVerified)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewUser(user)}
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

      {viewingUser && (
        <UserDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          user={viewingUser}
          onUpdated={handleUserUpdated}
        />
      )}
    </div>
  )
}