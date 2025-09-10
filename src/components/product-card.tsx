// src/components/product-card.tsx - PERBAIKAN VERSION
"use client"

import { useState } from "react"
import { ShoppingCart, Star, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { ProductDetailModal } from "@/components/product-detail-modal"
import { useCart } from "@/context/cart-context" // ✅ TAMBAH useCart hook
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number
    images: string[]
    category?: {
      id: string
      name: string
    }
    stock: number
    sku: string // ✅ TAMBAH sku yang missing
    isFeatured?: boolean
  }
  showQuickView?: boolean
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { addItem } = useCart() // ✅ PERBAIKI: Gunakan useCart hook
  const { toast } = useToast()

  // ✅ PERBAIKI: Klik produk buka modal, bukan redirect
  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setModalOpen(true)
  }

  // ✅ PERBAIKI: Add to cart yang benar-benar menambah ke cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock === 0) {
      toast({
        title: "Stok Habis",
        description: "Produk ini sedang tidak tersedia",
        variant: "destructive"
      })
      return
    }

    // ✅ PERBAIKI: Tambah ke cart dengan data lengkap
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images?.[0] || "/placeholder-product.jpg",
      categoryName: product.category?.name || "Uncategorized",
      sku: product.sku
    })

    toast({
      title: "Berhasil!",
      description: `${product.name} ditambahkan ke keranjang`,
    })
  }

  // ✅ TAMBAH: Beli langsung via WhatsApp
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock === 0) {
      toast({
        title: "Stok Habis",
        description: "Produk ini sedang tidak tersedia",
        variant: "destructive"
      })
      return
    }

    const price = product.salePrice || product.price
    let message = "🛍️ *Pesanan dari Azrafqueen Store*\n\n"
    message += "*Detail Pesanan:*\n"
    message += `1. ${product.name}\n`
    message += `   📦 SKU: ${product.sku}\n`
    message += `   💰 Harga: Rp ${price.toLocaleString('id-ID')}\n`
    message += `   📊 Qty: 1\n`
    message += `   💵 Total: Rp ${price.toLocaleString('id-ID')}\n\n`
    message += "Saya ingin memesan produk ini. Terima kasih! 🙏"

    const whatsappUrl = `https://wa.me/62895397978257?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    toast({
      title: "Pesanan Dikirim!",
      description: "Pesanan Anda telah dikirim ke WhatsApp",
    })
  }

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <>
      {/* ✅ PERBAIKI: Card bisa diklik untuk buka modal */}
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
        <CardHeader className="p-0" onClick={handleProductClick}>
          <div className="aspect-square overflow-hidden bg-gray-100 relative">
            <SafeImage
              src={product.images?.[0] || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              fallbackType="product"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isFeatured && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  Unggulan
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary">
                  Stok Habis
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4" onClick={handleProductClick}>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              {product.category?.name}
            </div>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between">
              {product.salePrice ? (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">
                    Rp {product.salePrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
            </div>
          </div>
        </CardContent>
        
        {/* ✅ PERBAIKI: Button sesuai permintaan - Keranjang + Beli */}
        <CardFooter className="p-4 pt-0 space-y-2">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Keranjang
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Beli
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Product Detail Modal */}
      {modalOpen && (
        <ProductDetailModal
          productId={product.id}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  )
}