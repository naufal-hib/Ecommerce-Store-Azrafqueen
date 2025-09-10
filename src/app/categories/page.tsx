// src/app/categories/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, ArrowRight, Filter, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  images?: string[]
  isActive: boolean
  _count?: {
    products: number
  }
  products?: {
    id: string
    name: string
    images: string[]
    price: number
    salePrice?: number
  }[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/categories")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        // Fetch product count and featured products for each category
        const categoriesWithProducts = await Promise.all(
          data.map(async (category) => {
            try {
              const productsResponse = await fetch(`/api/products?categoryId=${category.id}&limit=4`)
              const productsData = await productsResponse.json()
              
              return {
                ...category,
                _count: { products: productsData.pagination?.total || 0 },
                products: productsData.products || []
              }
            } catch (error) {
              console.error(`Error fetching products for category ${category.id}:`, error)
              return {
                ...category,
                _count: { products: 0 },
                products: []
              }
            }
          })
        )
        
        setCategories(categoriesWithProducts)
      } else {
        console.error("Invalid categories response format:", data)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Filter and sort categories
  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "products":
          return (b._count?.products || 0) - (a._count?.products || 0)
        case "name":
        default:
          return a.name.localeCompare(b.name, 'id')
      }
    })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kategori Produk</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Jelajahi berbagai kategori produk muslimah berkualitas tinggi yang telah kami pilih khusus untuk Anda
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kategori..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nama A-Z</SelectItem>
                      <SelectItem value="products">Jumlah Produk</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex rounded-lg border">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat kategori...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="mx-auto h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tidak ada kategori ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              {search ? "Coba kata kunci yang berbeda untuk pencarian" : "Belum ada kategori yang tersedia"}
            </p>
            {search && (
              <Button onClick={() => setSearch("")}>
                Reset Pencarian
              </Button>
            )}
          </div>
        )}

        {/* Categories Grid */}
        {!loading && filteredCategories.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {category.images?.[0] || category.image ? (
                          <Image
                            src={category.images?.[0] || category.image!}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-primary" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                            {category._count?.products || 0} Produk
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {category.description || "Koleksi produk berkualitas untuk kebutuhan Anda"}
                      </p>

                      {/* Featured Products Preview */}
                      {category.products && category.products.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Produk Unggulan:</h4>
                          <div className="grid grid-cols-4 gap-2">
                            {category.products.slice(0, 4).map((product) => (
                              <div key={product.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                                {product.images?.[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={60}
                                    height={60}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">No Image</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Link href={`/products?category=${category.id}`} className="block">
                        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Lihat Produk
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {category.images?.[0] || category.image ? (
                            <Image
                              src={category.images?.[0] || category.image!}
                              alt={category.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {category.name}
                            </CardTitle>
                            <Badge variant="outline">
                              {category._count?.products || 0} Produk
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {category.description || "Koleksi produk berkualitas untuk kebutuhan Anda"}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              {category.products?.slice(0, 3).map((product) => (
                                <div key={product.id} className="w-8 h-8 bg-muted rounded overflow-hidden">
                                  {product.images?.[0] ? (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-muted"></div>
                                  )}
                                </div>
                              ))}
                              {category.products && category.products.length > 3 && (
                                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                                  +{category.products.length - 3}
                                </div>
                              )}
                            </div>
                            <Link href={`/products?category=${category.id}`}>
                              <Button>
                                Lihat Produk
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Call to Action */}
            <div className="text-center mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-4">Tidak Menemukan Yang Anda Cari?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Jelajahi semua produk kami atau hubungi customer service untuk bantuan memilih produk yang tepat
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/products">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Lihat Semua Produk
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Hubungi Kami
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}