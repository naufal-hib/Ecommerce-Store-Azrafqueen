// src/app/page.tsx - FIXED: No Sample Data + Simple Elegant Hero
import { ShoppingCart, Truck, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { convertProductsArrayForClient, convertCategoriesArrayForClient } from "@/lib/data-converter"

// ✅ OPTIMIZED: Faster database queries
async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        sku: true,
        stock: true,
        images: true,
        isFeatured: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    })
    
    return convertProductsArrayForClient(products)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

// ✅ OPTIMIZED: Faster category queries
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        images: true,
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { sortOrder: "asc" },
      take: 6,
    })
    
    return convertCategoriesArrayForClient(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function Home() {
  // ✅ PERFORMANCE: Parallel data fetching
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ])

  // ✅ NO FALLBACK: Jika kosong ya kosong, tidak pakai sample data

  return (
    <div className="min-h-screen bg-background">
      {/* ✅ SIMPLE ELEGANT: Hero Section yang simpel tapi elegan */}
      <section className="relative bg-gradient-to-br from-primary/95 via-primary to-secondary/95 py-20 lg:py-32 text-primary-foreground overflow-hidden">
        {/* ✅ ELEGANT: Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='60' cy='20' r='1'/%3E%3Ccircle cx='20' cy='60' r='1'/%3E%3Ccircle cx='60' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* ✅ ELEGANT: Subtle animated elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-[10%] w-32 h-32 bg-white rounded-full mix-blend-overlay animate-pulse"></div>
          <div className="absolute bottom-20 right-[15%] w-24 h-24 bg-white rounded-full mix-blend-overlay animate-pulse delay-75"></div>
          <div className="absolute top-40 right-[20%] w-16 h-16 bg-white rounded-full mix-blend-overlay animate-pulse delay-150"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Selamat Datang di <br />
              <span className="bg-gradient-to-r from-white via-primary-foreground/95 to-white/90 bg-clip-text text-transparent">
                Azrafqueen Store
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-primary-foreground/90">
              Koleksi fashion muslimah terlengkap dengan kualitas premium. 
              Tampil elegan dan percaya diri dengan pilihan busana yang syar&apos;i dan modern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Belanja Sekarang
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 hover:bg-white/10 text-white" asChild>
                <Link href="/categories">
                  Lihat Kategori
                </Link>
              </Button>
            </div>

            {/* ✅ ELEGANT: Simple trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Terpercaya Sejak 2015</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>5000+ Customer Puas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Pengiriman ke Seluruh Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Truck className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Pengiriman Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pengiriman ke seluruh Indonesia dengan berbagai pilihan ekspedisi terpercaya
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Kualitas Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Produk berkualitas tinggi dengan bahan pilihan dan jahitan yang rapi
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Terpercaya Sejak 2015</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dipercaya ribuan pelanggan di seluruh Indonesia dengan pelayanan terbaik
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 ? (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Kategori Produk</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pilih kategori sesuai kebutuhan Anda. Kami menyediakan berbagai produk muslimah berkualitas
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="aspect-square overflow-hidden bg-gray-100 relative">
                        {category.images?.[0] ? (
                          <SafeImage
                            src={category.images[0]}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            fallbackType="category"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-primary" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category._count?.products || 0} produk
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/categories">
                  Lihat Semua Kategori
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        // ✅ NO FALLBACK: Show message when no categories
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Kategori Produk</h2>
              <p className="text-muted-foreground mb-8">
                Belum ada kategori yang tersedia. Silakan tambahkan kategori melalui admin dashboard.
              </p>
              <Button variant="outline" asChild>
                <Link href="/admin/categories">
                  Kelola Kategori
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Produk Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Koleksi terbaru dan terpopuler dengan kualitas premium dan desain yang menarik
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Lihat Semua Produk
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            // ✅ NO FALLBACK: Show message when no products
            <div className="text-center">
              <p className="text-muted-foreground mb-8">
                Belum ada produk unggulan yang tersedia. Silakan tambahkan produk melalui admin dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/admin/products">
                    Kelola Produk
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/products">
                    Lihat Semua Produk
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Dapatkan Update Terbaru</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Berlangganan newsletter kami untuk mendapatkan info produk baru, promo eksklusif, dan tips fashion muslimah
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Berlangganan
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/80 mt-4">
            Kami menghargai privasi Anda. Email tidak akan dibagikan kepada pihak ketiga.
          </p>
        </div>
      </section>
    </div>
  )
}