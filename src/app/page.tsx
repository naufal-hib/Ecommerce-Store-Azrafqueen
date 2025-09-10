// src/app/page.tsx - PERBAIKAN VERSION
import { ShoppingCart, Truck, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { convertProductsArrayForClient, convertCategoriesArrayForClient } from "@/lib/data-converter"

// ✅ SUDAH BENAR: Function mengambil data dari database
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
        sku: true, // ✅ TAMBAH: Include SKU
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
    
    // Convert Decimal objects to numbers for client components
    return convertProductsArrayForClient(products)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

// ✅ SUDAH BENAR: Function mengambil data dari database
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

// ✅ PERBAIKI: Sample data sesuai Azrafqueen Store (bukan hardcode, hanya fallback)
const sampleCategories = [
  {
    id: "sample-1",
    name: "Hijab & Kerudung",
    slug: "hijab-kerudung",
    description: "Koleksi hijab dan kerudung modern berkualitas tinggi",
    images: ["https://images.unsplash.com/photo-1583846082293-3de8c4d5b5da?w=600"],
    _count: { products: 25 }
  },
  {
    id: "sample-2", 
    name: "Abaya",
    slug: "abaya",
    description: "Abaya elegan untuk berbagai acara",
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600"],
    _count: { products: 18 }
  },
  {
    id: "sample-3",
    name: "Alquran & Produk Islami",
    slug: "alquran-islami", 
    description: "Alquran dan perlengkapan ibadah berkualitas",
    images: ["https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600"],
    _count: { products: 12 }
  },
  {
    id: "sample-4",
    name: "Baju Muslim Anak",
    slug: "baju-muslim-anak",
    description: "Busana muslim anak yang nyaman dan trendy",
    images: ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600"],
    _count: { products: 30 }
  },
  {
    id: "sample-5",
    name: "Kerudung Anak",
    slug: "kerudung-anak",
    description: "Kerudung khusus anak-anak dengan motif lucu",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"],
    _count: { products: 15 }
  }
]

// ✅ PERBAIKI: Sample products sesuai Azrafqueen Store (bukan hardcode, hanya fallback)
const sampleProducts = [
  {
    id: "sample-p1",
    name: "Hijab Pashmina Premium Ceruti Bubble",
    slug: "hijab-pashmina-premium-ceruti",
    price: 89000,
    salePrice: 69000,
    sku: "HPC001", // ✅ TAMBAH: Include SKU
    stock: 25,
    images: ["https://images.unsplash.com/photo-1583846082293-3de8c4d5b5da?w=600"],
    category: { id: "sample-1", name: "Hijab & Kerudung" },
    isFeatured: true
  },
  {
    id: "sample-p2",
    name: "Abaya Dubai Bordir Mewah",
    slug: "abaya-dubai-bordir-mewah",
    price: 485000,
    salePrice: 425000,
    sku: "ADB001", // ✅ TAMBAH: Include SKU
    stock: 12,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600"],
    category: { id: "sample-2", name: "Abaya" },
    isFeatured: true
  },
  {
    id: "sample-p3",
    name: "Alquran Tajwid Al-Mizan Ukuran Sedang",
    slug: "alquran-tajwid-al-mizan",
    price: 145000,
    salePrice: null,
    sku: "ATM001", // ✅ TAMBAH: Include SKU
    stock: 15,
    images: ["https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600"],
    category: { id: "sample-3", name: "Alquran & Produk Islami" },
    isFeatured: true
  },
  {
    id: "sample-p4",
    name: "Baju Koko Anak Lengan Panjang",
    slug: "baju-koko-anak-lengan-panjang",
    price: 89000,
    salePrice: 75000,
    sku: "BKA001", // ✅ TAMBAH: Include SKU
    stock: 30,
    images: ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600"],
    category: { id: "sample-4", name: "Baju Muslim Anak" },
    isFeatured: true
  },
  {
    id: "sample-p5",
    name: "Kerudung Anak Motif Unicorn",
    slug: "kerudung-anak-motif-unicorn",
    price: 35000,
    salePrice: null,
    sku: "KAU001", // ✅ TAMBAH: Include SKU
    stock: 35,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"],
    category: { id: "sample-5", name: "Kerudung Anak" },
    isFeatured: true
  },
  {
    id: "sample-p6",
    name: "Kerudung Voal Polos Daily",
    slug: "kerudung-voal-polos-daily",
    price: 45000,
    salePrice: null,
    sku: "KVP001", // ✅ TAMBAH: Include SKU
    stock: 40,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"],
    category: { id: "sample-1", name: "Hijab & Kerudung" },
    isFeatured: true
  },
  {
    id: "sample-p7",
    name: "Abaya Syari Simple Elegant",
    slug: "abaya-syari-simple-elegant",
    price: 225000,
    salePrice: null,
    sku: "ASS001", // ✅ TAMBAH: Include SKU
    stock: 18,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600"],
    category: { id: "sample-2", name: "Abaya" },
    isFeatured: true
  },
  {
    id: "sample-p8",
    name: "Gamis Anak Perempuan Motif Bunga",
    slug: "gamis-anak-perempuan-motif-bunga",
    price: 95000,
    salePrice: null,
    sku: "GAP001", // ✅ TAMBAH: Include SKU
    stock: 20,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"],
    category: { id: "sample-4", name: "Baju Muslim Anak" },
    isFeatured: true
  }
]

export default async function Home() {
  // ✅ SUDAH BENAR: Fetch data dari database terlebih dahulu
  const featuredProducts = await getFeaturedProducts()
  const categories = await getCategories()

  // ✅ SUDAH BENAR: Gunakan sample data HANYA jika database kosong
  const displayCategories = categories.length > 0 ? categories : sampleCategories
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : sampleProducts

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Azrafqueen Store
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Toko Online Terpercaya untuk Busana Muslim Wanita & Anak
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Belanja Sekarang
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/categories">
                  Lihat Kategori
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
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
            
            <Card className="text-center">
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
            
            <Card className="text-center">
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
      {displayCategories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Kategori Produk</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pilih kategori sesuai kebutuhan Anda. Kami menyediakan berbagai produk muslimah berkualitas
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayCategories.map((category) => (
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
          
          {displayProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/products">
                Lihat Semua Produk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Berlangganan Newsletter</CardTitle>
              <p className="text-muted-foreground">
                Dapatkan info produk terbaru dan penawaran menarik langsung ke email Anda
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex-1 px-4 py-2 border border-input rounded-md"
                />
                <Button>
                  Berlangganan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}