// src/components/product-detail-modal.tsx - PERBAIKAN VERSION
"use client"

import { useState, useEffect } from "react"
import { 
  ShoppingCart, 
  MessageCircle, 
  Star, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SafeImage } from "@/components/ui/safe-image"
import { useCart } from "@/context/cart-context" // ✅ TAMBAH useCart hook
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  images: string[]
  tags?: string[]
  weight?: number
  dimensions?: string
  isActive: boolean
  isFeatured: boolean
  category: {
    id: string
    name: string
    slug: string
  }
}

interface ProductDetailModalProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailModal({ productId, open, onOpenChange }: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart() // ✅ TAMBAH useCart hook
  const { toast } = useToast()

  // ✅ PERBAIKI: Fetch product data when modal opens
  useEffect(() => {
    if (open && productId) {
      fetchProduct()
    }
  }, [open, productId])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat detail produk",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Terjadi kesalahan saat memuat produk",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // ✅ PERBAIKI: Add to cart functionality
  const handleAddToCart = () => {
    if (!product) return
    
    if (product.stock === 0) {
      toast({
        title: "Stok Habis",
        description: "Produk ini sedang tidak tersedia",
        variant: "destructive"
      })
      return
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0] || "/placeholder-product.jpg",
        categoryName: product.category?.name || "Uncategorized",
        sku: product.sku
      })
    }

    toast({
      title: "Berhasil!",
      description: `${quantity}x ${product.name} ditambahkan ke keranjang`,
    })
  }

  // ✅ TAMBAH: Buy now via WhatsApp functionality
  const handleBuyNow = () => {
    if (!product) return
    
    if (product.stock === 0) {
      toast({
        title: "Stok Habis",
        description: "Produk ini sedang tidak tersedia",
        variant: "destructive"
      })
      return
    }

    const price = product.salePrice || product.price
    const total = price * quantity
    
    let message = "🛍️ *Pesanan dari Azrafqueen Store*\n\n"
    message += "*Detail Pesanan:*\n"
    message += `1. ${product.name}\n`
    message += `   📦 SKU: ${product.sku}\n`
    message += `   💰 Harga: Rp ${price.toLocaleString('id-ID')}\n`
    message += `   📊 Qty: ${quantity}\n`
    message += `   💵 Total: Rp ${total.toLocaleString('id-ID')}\n\n`
    message += "Saya ingin memesan produk ini. Terima kasih! 🙏"

    const whatsappUrl = `https://wa.me/62895397978257?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    toast({
      title: "Pesanan Dikirim!",
      description: "Pesanan Anda telah dikirim ke WhatsApp",
    })
    
    onOpenChange(false)
  }

  const nextImage = () => {
    if (!product?.images) return
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!product?.images) return
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const discountPercentage = product?.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
            {/* Image Gallery */}
            <div className="relative bg-gray-100">
              <div className="aspect-square relative">
                <SafeImage
                  src={product.images?.[selectedImageIndex] || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  fallbackType="product"
                />
                
                {/* Navigation arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Image indicators */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
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
            </div>

            {/* Product Info */}
            <div className="p-6 overflow-y-auto">
              <DialogHeader className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">
                  {product.category?.name}
                </div>
                <DialogTitle className="text-xl font-bold leading-tight">
                  {product.name}
                </DialogTitle>
              </DialogHeader>

              {/* Price */}
              <div className="mb-4">
                {product.salePrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      Rp {product.salePrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8 • 124 ulasan)</span>
              </div>

              <Separator className="my-4" />

              {/* Product Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">SKU:</span>
                  <span className="text-sm font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stok:</span>
                  <span className="text-sm font-medium">
                    {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
                  </span>
                </div>
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Berat:</span>
                    <span className="text-sm font-medium">{product.weight} gram</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Deskripsi</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Jumlah:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Tambah ke Keranjang
                </Button>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Beli Sekarang
                </Button>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}