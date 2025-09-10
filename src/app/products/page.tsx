// src/app/products/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Grid, List, Loader2, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  images?: string[]
  category?: {
    id: string
    name: string
  }
  isActive: boolean
  isFeatured: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

// Price range options with proper formatting
const PRICE_RANGES = [
  { value: "all", label: "Semua Harga" },
  { value: "under-100k", label: "Dibawah Rp 100k" },
  { value: "100k-300k", label: "Rp 100k - 300k" },
  { value: "300k-500k", label: "Rp 300k - 500k" },
  { value: "over-500k", label: "Diatas Rp 500k" },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || "all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [priceRange, setPriceRange] = useState<string>("all")

  // Debounced search function
  const [searchInput, setSearchInput] = useState("")
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1) // Reset to first page when searching
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Fetch products function with proper error handling
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: viewMode === "grid" ? "12" : "20",
        isActive: "true", // Only show active products to users
      })

      // Add search parameter if exists
      if (search.trim()) {
        params.append("search", search.trim())
      }

      // Add category filter if selected
      if (selectedCategory && selectedCategory !== "all") {
        params.append("categoryId", selectedCategory)
      }

      // Add sort parameter
      params.append("sortBy", sortBy)

      console.log("Fetching products with params:", params.toString())

      const response = await fetch(`/api/products?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.products) {
        // Convert Decimal objects to numbers
        const convertedProducts = data.products.map((product: Product) => ({
          ...product,
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : undefined,
        }))
        
        setProducts(convertedProducts)
        setTotalPages(data.pagination?.pages || 1)
        setTotalProducts(data.pagination?.total || 0)
      } else {
        console.error("Invalid response format:", data)
        setProducts([])
        setTotalPages(1)
        setTotalProducts(0)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
      setTotalPages(1)
      setTotalProducts(0)
    } finally {
      setLoading(false)
    }
  }, [page, search, selectedCategory, sortBy, viewMode])

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setCategories(data)
      } else {
        console.error("Invalid categories response format:", data)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }, [])

  // Effects
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Update category when URL parameter changes
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl)
      setPage(1)
    }
  }, [categoryFromUrl, selectedCategory])

  // Filter products by price range on client side
  const filteredProducts = products.filter(product => {
    const price = product.salePrice || product.price
    switch (priceRange) {
      case "under-100k":
        return price < 100000
      case "100k-300k":
        return price >= 100000 && price <= 300000
      case "300k-500k":
        return price >= 300000 && price <= 500000
      case "over-500k":
        return price > 500000
      default:
        return true
    }
  })

  // Handle filter changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
  }

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value)
  }

  const clearFilters = () => {
    setSearchInput("")
    setSearch("")
    setSelectedCategory("all")
    setSortBy("newest")
    setPriceRange("all")
    setPage(1)
  }

  // Get price range display text
  const getPriceRangeText = (range: string) => {
    const priceRange = PRICE_RANGES.find(p => p.value === range)
    return priceRange?.label || range
  }

  // Get current category name for display
  const currentCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || "All Categories"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Semua Produk</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Temukan koleksi lengkap produk muslimah berkualitas tinggi dengan harga terjangkau
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Desktop Filters */}
                <div className="hidden md:flex gap-2 items-center">
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="price-low">Harga Terendah</SelectItem>
                      <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                      <SelectItem value="name">Nama A-Z</SelectItem>
                      <SelectItem value="featured">Unggulan</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={handlePriceRangeChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Harga" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_RANGES.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters} size="sm">
                    Reset
                  </Button>
                </div>

                {/* Mobile Filter Sheet */}
                <div className="md:hidden flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Filter Produk</SheetTitle>
                        <SheetDescription>
                          Sesuaikan pencarian Anda
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Kategori</label>
                          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua Kategori</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Urutkan</label>
                          <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Urutan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Terbaru</SelectItem>
                              <SelectItem value="price-low">Harga Terendah</SelectItem>
                              <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                              <SelectItem value="name">Nama A-Z</SelectItem>
                              <SelectItem value="featured">Unggulan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Rentang Harga</label>
                          <Select value={priceRange} onValueChange={handlePriceRangeChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Harga" />
                            </SelectTrigger>
                            <SelectContent>
                              {PRICE_RANGES.map((range) => (
                                <SelectItem key={range.value} value={range.value}>
                                  {range.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button onClick={clearFilters} className="w-full">
                          Reset Filter
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* View Mode Toggle */}
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
            </CardContent>
          </Card>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "all" || priceRange !== "all" || search) && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Filter aktif:</span>
              {selectedCategory !== "all" && (
                <Badge variant="secondary">
                  Kategori: {currentCategoryName}
                </Badge>
              )}
              {priceRange !== "all" && (
                <Badge variant="secondary">
                  Harga: {getPriceRangeText(priceRange)}
                </Badge>
              )}
              {search && (
                <Badge variant="secondary">
                  Pencarian: &quot;{search}&quot;
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Hapus semua filter
              </Button>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Menampilkan {filteredProducts.length} dari {totalProducts} produk
            {selectedCategory !== "all" && ` dalam kategori ${currentCategoryName}`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat produk...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="mx-auto h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <Button onClick={clearFilters}>
              Reset Filter
            </Button>
          </div>
        )}

        {/* Products Grid/List */}
        {!loading && filteredProducts.length > 0 && (
          <>
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  showQuickView={true}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant={page === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}