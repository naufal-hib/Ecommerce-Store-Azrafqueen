"use client"

import { ShoppingCart } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { CartDrawer } from "@/components/cart-drawer"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          <h1 className="text-xl font-bold">
            <Link href="/" className="hover:text-primary transition-colors">
              Azrafqueen Store
            </Link>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium hover:underline underline-offset-4 transition-colors ${isActive('/') ? 'underline text-primary' : ''}`}
          >
            Beranda
          </Link>
          <Link 
            href="/products" 
            className={`text-sm font-medium hover:underline underline-offset-4 transition-colors ${isActive('/products') ? 'underline text-primary' : ''}`}
          >
            Produk
          </Link>
          <Link 
            href="/categories" 
            className={`text-sm font-medium hover:underline underline-offset-4 transition-colors ${isActive('/categories') ? 'underline text-primary' : ''}`}
          >
            Kategori
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium hover:underline underline-offset-4 transition-colors ${isActive('/about') ? 'underline text-primary' : ''}`}
          >
            Tentang Kami
          </Link>
          <Link 
            href="/contact" 
            className={`text-sm font-medium hover:underline underline-offset-4 transition-colors ${isActive('/contact') ? 'underline text-primary' : ''}`}
          >
            Kontak
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <CartDrawer />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}