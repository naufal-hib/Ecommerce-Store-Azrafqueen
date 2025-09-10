// src/components/product-card.tsx
"use client"

import { useState } from "react"
import { ShoppingCart, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { ProductDetailModal } from "@/components/product-detail-modal"
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
    isFeatured?: boolean
  }
  showQuickView?: boolean
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setModalOpen(true)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add to cart logic here
    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
    })
  }

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
        <CardHeader className="p-0" onClick={handleQuickView}>
          <div className="aspect-square overflow-hidden bg-gray-100 relative">
            <SafeImage
              src={product.images?.[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              fallbackType="product"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.salePrice && (
                <Badge className="bg-red-500 hover:bg-red-600">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.isFeatured && (
                <Badge variant="secondary">
                  Featured
                </Badge>
              )}
              {product.stock <= 10 && product.stock > 0 && (
                <Badge variant="destructive">
                  Only {product.stock} left
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            {showQuickView && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  onClick={handleQuickView}
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                  size="sm"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Quick View
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4" onClick={handleQuickView}>
          <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-3">{product.category?.name}</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-lg font-bold text-primary">
                    Rp {product.salePrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </>
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
              Add to Cart
            </Button>
            <Button
              onClick={handleQuickView}
              className="flex-1"
              size="sm"
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        productId={product.id}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}