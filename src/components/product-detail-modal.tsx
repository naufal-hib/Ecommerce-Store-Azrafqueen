// src/components/product-detail-modal.tsx
"use client"

import { useState, useEffect } from "react"
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SafeImage } from "@/components/ui/safe-image"
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
  reviews?: {
    id: string
    rating: number
    comment?: string
    createdAt: string
    user: {
      name?: string
      image?: string
    }
  }[]
}

interface ProductDetailModalProps {
  productId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailModal({ productId, open, onOpenChange }: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()

  // Fetch product data
  useEffect(() => {
    if (productId && open) {
      fetchProduct(productId)
    }
  }, [productId, open])

  const fetchProduct = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        // Convert Decimal to number
        const productData = {
          ...data,
          price: Number(data.price),
          salePrice: data.salePrice ? Number(data.salePrice) : undefined,
          weight: data.weight ? Number(data.weight) : undefined,
          reviews: data.reviews?.map((review: { createdAt: Date | string }) => ({
            ...review,
            createdAt: review.createdAt.toString()
          })) || []
        }
        setProduct(productData)
        setSelectedImageIndex(0)
        setQuantity(1)
      } else {
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error", 
        description: "Failed to load product details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!product && !loading) {
    return null
  }

  const discountPercentage = product?.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const currentPrice = product?.salePrice || product?.price || 0
  const averageRating = product?.reviews && product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  const nextImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    // Add to cart logic here
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to cart`,
    })
  }

  const handleBuyNow = () => {
    if (!product) return
    
    // Buy now logic here
    toast({
      title: "Redirecting to Checkout",
      description: "Proceeding to checkout...",
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product?.name} ${isWishlisted ? "removed from" : "added to"} wishlist`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: `${window.location.origin}/products/${product?.slug}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product?.slug}`)
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : product ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <SafeImage
                        src={product.images[selectedImageIndex]}
                        alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                        fill
                        className="object-cover"
                        fallbackType="product"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {product.images.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={nextImage}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                        <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                          -{discountPercentage}%
                        </Badge>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground">
                        <div className="w-32 h-32 bg-muted rounded-lg mb-4 mx-auto"></div>
                        <p>No image available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? "border-primary" : "border-transparent"
                        }`}
                      >
                        <SafeImage
                          src={image}
                          alt={`${product.name} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          fallbackType="product"
                          sizes="150px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{product.category.name}</Badge>
                    {product.stock <= 10 && product.stock > 0 && (
                      <Badge variant="destructive">Only {product.stock} left!</Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({product.reviews?.length || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={handleWishlist}>
                        <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      Rp {currentPrice.toLocaleString('id-ID')}
                    </span>
                    {product.salePrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  {product.salePrice && (
                    <p className="text-sm text-green-600 font-medium">
                      You save Rp {(product.price - product.salePrice).toLocaleString('id-ID')} ({discountPercentage}% off)
                    </p>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.stock} available
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1"
                      variant="outline"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="flex-1"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">Orders over 100k</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">100% protected</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">7 days return</p>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span>{product.sku}</span>
                  </div>
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span>{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span>{product.dimensions}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Preview */}
                {product.reviews && product.reviews.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Reviews</h4>
                    <div className="space-y-3 max-h-32 overflow-y-auto">
                      {product.reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-xs">{review.user.name || "Anonymous"}</span>
                          </div>
                          {review.comment && (
                            <p className="text-muted-foreground text-xs line-clamp-2">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}