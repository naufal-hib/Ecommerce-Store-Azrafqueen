// src/app/products/[slug]/product-detail-client.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
  Minus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  reviews: {
    id: string
    rating: number
    comment?: string
    createdAt: Date
    user: {
      name?: string
      image?: string
    }
  }[]
}

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const currentPrice = product.salePrice || product.price
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to cart`,
    })
  }

  const handleBuyNow = () => {
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
      description: `${product.name} ${isWishlisted ? "removed from" : "added to"} wishlist`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link href={`/categories?category=${product.category.id}`} className="hover:text-primary">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              {product.images.length > 0 ? (
                <>
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
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
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
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
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
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
                    ({product.reviews.length} reviews)
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
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {product.description ? (
                      <p className="whitespace-pre-wrap">{product.description}</p>
                    ) : (
                      <p className="text-muted-foreground">No description available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
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
                            <span className="font-medium text-sm">{review.user.name || "Anonymous"}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Free Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      Enjoy free shipping on orders over Rp 100,000 within Indonesia.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Delivery Time</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Jakarta & Tangerang: 1-2 business days</li>
                      <li>• Other major cities: 2-4 business days</li>
                      <li>• Remote areas: 5-7 business days</li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Return Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      7-day return policy. Items must be unused and in original packaging.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Link href={`/products/${relatedProduct.slug}`}>
                      <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                        {relatedProduct.images?.[0] ? (
                          <Image
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium line-clamp-2 mb-2">{relatedProduct.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">
                            Rp {(relatedProduct.salePrice || relatedProduct.price).toLocaleString('id-ID')}
                          </span>
                          {relatedProduct.salePrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              Rp {relatedProduct.price.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}