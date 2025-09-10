// src/app/page.tsx
import { ShoppingCart, Truck, Shield, Eye, Star, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { convertProductsArrayForClient, convertCategoriesArrayForClient } from "@/lib/data-converter"

// Function to get featured products from database
async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    })
    
    // Convert Decimal objects to numbers for client components
    return convertProductsArrayForClient(products)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

// Function to get categories from database
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
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
    
    // Convert for client components
    return convertCategoriesArrayForClient(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Sample data for demo purposes jika database kosong
const sampleCategories = [
  {
    id: "sample-1",
    name: "Hijab & Kerudung",
    slug: "hijab-kerudung",
    description: "Koleksi hijab dan kerudung modern",
    images: ["https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=500"],
    _count: { products: 25 }
  },
  {
    id: "sample-2", 
    name: "Gamis & Dress",
    slug: "gamis-dress",
    description: "Gamis cantik untuk berbagai acara",
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"],
    _count: { products: 18 }
  },
  {
    id: "sample-3",
    name: "Mukena & Telekung",
    slug: "mukena-telekung", 
    description: "Mukena dan telekung berkualitas",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"],
    _count: { products: 12 }
  },
  {
    id: "sample-4",
    name: "Tunik & Atasan",
    slug: "tunik-atasan",
    description: "Tunik dan atasan casual modern",
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"],
    _count: { products: 15 }
  },
  {
    id: "sample-5",
    name: "Celana & Rok",
    slug: "celana-rok",
    description: "Celana dan rok muslimah",
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500"],
    _count: { products: 20 }
  },
  {
    id: "sample-6",
    name: "Aksesoris",
    slug: "aksesoris",
    description: "Aksesoris muslimah",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"],
    _count: { products: 8 }
  }
]

const sampleProducts = [
  {
    id: "sample-p1",
    name: "Hijab Voal Premium Quality",
    slug: "hijab-voal-premium",
    price: 75000,
    salePrice: 60000,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=500"],
    category: { id: "1", name: "Hijab" },
    isFeatured: true
  },
  {
    id: "sample-p2",
    name: "Gamis Katun Rayon Elegant",
    slug: "gamis-katun-rayon",
    price: 285000,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"],
    category: { id: "2", name: "Gamis" },
    isFeatured: true
  },
  {
    id: "sample-p3",
    name: "Mukena Sutra Lembut Premium",
    slug: "mukena-sutra-lembut",
    price: 450000,
    salePrice: 380000,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"],
    category: { id: "3", name: "Mukena" },
    isFeatured: true
  },
  {
    id: "sample-p4",
    name: "Tunik Casual Modern Style",
    slug: "tunik-casual-modern",
    price: 165000,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"],
    category: { id: "4", name: "Tunik" },
    isFeatured: true
  },
  {
    id: "sample-p5",
    name: "Celana Kulot Plisket Casual",
    slug: "celana-kulot-plisket",
    price: 125000,
    salePrice: 99000,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500"],
    category: { id: "5", name: "Celana" },
    isFeatured: true
  },
  {
    id: "sample-p6",
    name: "Kerudung Segi Empat Motif",
    slug: "kerudung-segi-empat-motif",
    price: 45000,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1586072306985-bdf3e6cd5cb7?w=500"],
    category: { id: "1", name: "Hijab" },
    isFeatured: true
  },
  {
    id: "sample-p7",
    name: "Dress Casual Muslim Modern",
    slug: "dress-casual-muslim",
    price: 195000,
    salePrice: 165000,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1566479179817-0d7b0b10acc7?w=500"],
    category: { id: "2", name: "Dress" },
    isFeatured: true
  },
  {
    id: "sample-p8",
    name: "Tas Selempang Muslimah",
    slug: "tas-selempang-muslimah",
    price: 85000,
    stock: 18,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
    category: { id: "6", name: "Aksesoris" },
    isFeatured: true
  }
]

export default async function Home() {
  // Fetch data from database
  const featuredProducts = await getFeaturedProducts()
  const categories = await getCategories()

  // Use sample data if database is empty
  const displayCategories = categories.length > 0 ? categories : sampleCategories
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : sampleProducts

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-20 lg:py-32 text-primary-foreground overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Selamat Datang di <br />
              <span className="bg-gradient-to-r from-white to-primary-foreground/80 bg-clip-text text-transparent">
                Azrafqueen Store
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-primary-foreground/90">
              Koleksi fashion muslimah terlengkap dengan kualitas premium. 
              Tampil elegan dan percaya diri dengan pilihan busana yang syar&apos;i dan modern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary/90 font-semibold" asChild>
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Belanja Sekarang
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-semibold" asChild>
                <Link href="/categories">
                  <Eye className="mr-2 h-5 w-5" />
                  Lihat Kategori
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-primary-foreground/80">Produk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-primary-foreground/80">Kategori</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-sm text-primary-foreground/80">Pelanggan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.8⭐</div>
                <div className="text-sm text-primary-foreground/80">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mengapa Memilih Azrafqueen?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman berbelanja terbaik dengan produk berkualitas dan pelayanan prima
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-muted-foreground">
                Gratis ongkir untuk pembelian di atas Rp 100.000. Pengiriman ke seluruh Indonesia dalam 1-7 hari kerja.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kualitas Terjamin</h3>
              <p className="text-muted-foreground">
                Semua produk telah melalui quality control ketat. Garansi 100% uang kembali jika tidak sesuai.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pelayanan 24/7</h3>
              <p className="text-muted-foreground">
                Tim customer service siap membantu Anda kapanpun. Chat langsung via WhatsApp atau email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {displayCategories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Kategori Populer</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Jelajahi berbagai kategori produk muslimah pilihan dengan kualitas terbaik
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {displayCategories.slice(0, 6).map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors overflow-hidden">
                        {category.images?.[0] ? (
                          <SafeImage
                            src={category.images[0]}
                            alt={category.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover w-8 h-8"
                            fallbackType="category"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-primary" />
                        )}
                      </div>
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
      )}

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Produk Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Koleksi terbaru dan terpopuler dengan kualitas premium dan desain yang menarik. 
              Klik produk untuk melihat detail lengkap!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayProducts.slice(0, 8).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                showQuickView={true}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/products">
                Lihat Semua Produk
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Dapatkan Update Terbaru</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Berlangganan newsletter kami untuk mendapatkan info produk baru, promo eksklusif, dan tips fashion muslimah
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="Masukkan email Anda"
              className="bg-white text-gray-900"
            />
            <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Subscribe
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