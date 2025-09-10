"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Moon, Sun, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setIsDark(!isDark)
  }

  if (!mounted) return null

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={toggleTheme}>
        {isDark ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>

      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{session.user?.name}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            {session.user?.role === "ADMIN" && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  )
}