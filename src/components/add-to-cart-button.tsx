"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number
  image?: string
  categoryName?: string
  sku: string
}

interface AddToCartButtonProps {
  product: Product
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function AddToCartButton({ 
  product, 
  variant = "outline", 
  size = "default",
  className = ""
}: AddToCartButtonProps) {
  const { addItem, items } = useCart()
  const { toast } = useToast()
  const [isAdded, setIsAdded] = useState(false)

  // Check if product is already in cart
  const isInCart = items.some(item => item.id === product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      categoryName: product.categoryName,
      sku: product.sku
    })

    // Show success animation
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)

    // Show toast notification
    toast({
      title: "Produk Ditambahkan!",
      description: `${product.name} telah ditambahkan ke keranjang`,
    })
  }

  if (isAdded) {
    return (
      <Button 
        variant="default" 
        size={size}
        className={`w-full bg-green-600 hover:bg-green-600 ${className}`}
        disabled
      >
        <Check className="mr-2 h-4 w-4" />
        Ditambahkan!
      </Button>
    )
  }

  return (
    <Button 
      variant={variant}
      size={size}
      className={`w-full ${className}`}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isInCart ? "Tambah Lagi" : "Tambah ke Keranjang"}
    </Button>
  )
}