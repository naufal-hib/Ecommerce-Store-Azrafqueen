"use client"

import { useSession, signOut } from "next-auth/react"
import { Bell, Search, User, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search..."
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{session?.user?.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Store
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}