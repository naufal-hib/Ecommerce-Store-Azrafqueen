// src/app/api/seed/route.ts - PERBAIKAN VERSION
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ✅ FUNCTION: Seed data Azrafqueen Store yang realistic
async function seedAzrafqueenData() {
  try {
    console.log("🌱 Mulai seeding data Azrafqueen Store...")

    // ✅ 1. Seed Categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "hijab-kerudung" },
        update: {},
        create: {
          name: "Hijab & Kerudung",
          slug: "hijab-kerudung",
          description: "Koleksi hijab dan kerudung modern berbahan premium dengan berbagai model dan warna pilihan",
          images: [
            "https://images.unsplash.com/photo-1583846082293-3de8c4d5b5da?w=600",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"
          ],
          isActive: true,
          sortOrder: 1
        }
      }),

      prisma.category.upsert({
        where: { slug: "abaya" },
        update: {},
        create: {
          name: "Abaya",
          slug: "abaya",
          description: "Abaya elegan dan modern untuk berbagai acara, dari harian hingga formal",
          images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
            "https://images.unsplash.com/photo-1571513805371-d979e6e1be4d?w=600"
          ],
          isActive: true,
          sortOrder: 2
        }
      }),

      prisma.category.upsert({
        where: { slug: "alquran-islami" },
        update: {},
        create: {
          name: "Alquran & Produk Islami",
          slug: "alquran-islami",
          description: "Alquran, tasbih, mukena dan perlengkapan ibadah berkualitas",
          images: [
            "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600"
          ],
          isActive: true,
          sortOrder: 3
        }
      }),

      prisma.category.upsert({
        where: { slug: "baju-muslim-anak" },
        update: {},
        create: {
          name: "Baju Muslim Anak",
          slug: "baju-muslim-anak",
          description: "Busana muslim anak laki-laki dan perempuan yang nyaman dan trendy",
          images: [
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600",
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
          ],
          isActive: true,
          sortOrder: 4
        }
      }),

      prisma.category.upsert({
        where: { slug: "kerudung-anak" },
        update: {},
        create: {
          name: "Kerudung Anak",
          slug: "kerudung-anak",
          description: "Kerudung khusus anak-anak dengan motif lucu dan bahan yang nyaman",
          images: [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
          ],
          isActive: true,
          sortOrder: 5
        }
      })
    ])

    console.log("✅ Categories berhasil dibuat")

    // ✅ 2. Seed Products dengan data realistic
    const products = [
      // Hijab & Kerudung Products
      {
        name: "Hijab Pashmina Premium Ceruti Bubble",
        slug: "hijab-pashmina-premium-ceruti-bubble",
        description: "Hijab pashmina berbahan ceruti bubble premium yang lembut dan tidak mudah kusut. Cocok untuk acara formal maupun kasual. Tersedia dalam berbagai warna cantik yang mudah dipadukan.",
        price: 89000,
        salePrice: 69000,
        sku: "HPC001",
        stock: 25,
        images: [
          "https://images.unsplash.com/photo-1583846082293-3de8c4d5b5da?w=600",
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"
        ],
        tags: ["hijab", "pashmina", "ceruti", "premium"],
        weight: 100,
        isActive: true,
        isFeatured: true,
        categoryId: categories[0].id
      },
      {
        name: "Kerudung Voal Polos Daily",
        slug: "kerudung-voal-polos-daily",
        description: "Kerudung berbahan voal yang ringan dan adem, perfect untuk aktivitas sehari-hari. Tersedia berbagai warna basic yang mudah dipadukan dengan outfit apapun.",
        price: 45000,
        salePrice: null,
        sku: "KVP001",
        stock: 40,
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"
        ],
        tags: ["kerudung", "voal", "daily", "basic"],
        weight: 80,
        isActive: true,
        isFeatured: true,
        categoryId: categories[0].id
      },
      {
        name: "Hijab Segi Empat Maxmara Premium",
        slug: "hijab-segi-empat-maxmara-premium",
        description: "Hijab segi empat berbahan maxmara premium dengan tekstur halus dan jatuh yang sempurna. Ideal untuk gaya formal maupun kasual dengan berbagai cara styling.",
        price: 75000,
        salePrice: 59000,
        sku: "HSE001",
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1583846082293-3de8c4d5b5da?w=600"
        ],
        tags: ["hijab", "segi empat", "maxmara", "premium"],
        weight: 90,
        isActive: true,
        isFeatured: false,
        categoryId: categories[0].id
      },

      // Abaya Products
      {
        name: "Abaya Dubai Bordir Mewah",
        slug: "abaya-dubai-bordir-mewah",
        description: "Abaya gaya Dubai dengan bordiran tangan yang mewah. Bahan chiffon premium dengan cutting yang elegan. Cocok untuk acara formal, kondangan, dan pesta.",
        price: 485000,
        salePrice: 425000,
        sku: "ADB001",
        stock: 12,
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
          "https://images.unsplash.com/photo-1571513805371-d979e6e1be4d?w=600"
        ],
        tags: ["abaya", "dubai", "bordir", "mewah", "chiffon"],
        weight: 400,
        isActive: true,
        isFeatured: true,
        categoryId: categories[1].id
      },
      {
        name: "Abaya Syari Simple Elegant",
        slug: "abaya-syari-simple-elegant",
        description: "Abaya syari dengan desain simple namun elegant. Bahan wolly crepe yang nyaman dipakai seharian. Perfect untuk daily wear maupun acara keagamaan.",
        price: 225000,
        salePrice: null,
        sku: "ASS001",
        stock: 18,
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600"
        ],
        tags: ["abaya", "syari", "simple", "elegant", "wolly crepe"],
        weight: 350,
        isActive: true,
        isFeatured: true,
        categoryId: categories[1].id
      },

      // Alquran & Islami Products
      {
        name: "Alquran Tajwid Al-Mizan Ukuran Sedang",
        slug: "alquran-tajwid-al-mizan-sedang",
        description: "Alquran dengan tajwid warna Al-Mizan ukuran sedang. Dilengkapi terjemahan bahasa Indonesia dan panduan tajwid yang mudah dipahami. Cocok untuk belajar dan mengajar.",
        price: 145000,
        salePrice: null,
        sku: "ATM001",
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600"
        ],
        tags: ["alquran", "tajwid", "al-mizan", "terjemahan"],
        weight: 800,
        isActive: true,
        isFeatured: true,
        categoryId: categories[2].id
      },
      {
        name: "Tasbih Kayu Kokka Premium",
        slug: "tasbih-kayu-kokka-premium",
        description: "Tasbih dari kayu kokka premium dengan finishing halus. 99 butir dengan counter digital. Harum alami dan tahan lama, cocok untuk ibadah sehari-hari.",
        price: 85000,
        salePrice: 69000,
        sku: "TKK001",
        stock: 25,
        images: [
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600"
        ],
        tags: ["tasbih", "kayu kokka", "premium", "counter"],
        weight: 150,
        isActive: true,
        isFeatured: false,
        categoryId: categories[2].id
      },

      // Baju Muslim Anak Products
      {
        name: "Baju Koko Anak Lengan Panjang",
        slug: "baju-koko-anak-lengan-panjang",
        description: "Baju koko anak lengan panjang berbahan katun combed yang nyaman dan berkualitas. Cocok untuk sholat dan acara formal. Tersedia size 1-10 tahun.",
        price: 89000,
        salePrice: 75000,
        sku: "BKA001",
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600"
        ],
        tags: ["baju koko", "anak", "lengan panjang", "katun"],
        weight: 200,
        isActive: true,
        isFeatured: true,
        categoryId: categories[3].id
      },
      {
        name: "Gamis Anak Perempuan Motif Bunga",
        slug: "gamis-anak-perempuan-motif-bunga",
        description: "Gamis anak perempuan dengan motif bunga yang cantik. Bahan katun lembut dan design yang lucu. Tersedia berbagai size dan warna, nyaman untuk aktivitas anak.",
        price: 95000,
        salePrice: null,
        sku: "GAP001",
        stock: 20,
        images: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
        ],
        tags: ["gamis", "anak perempuan", "motif bunga", "katun"],
        weight: 180,
        isActive: true,
        isFeatured: true,
        categoryId: categories[3].id
      },

      // Kerudung Anak Products
      {
        name: "Kerudung Anak Motif Unicorn",
        slug: "kerudung-anak-motif-unicorn",
        description: "Kerudung khusus anak dengan motif unicorn yang lucu dan menggemaskan. Bahan voal yang lembut dan nyaman dipakai. Disukai anak-anak usia 3-10 tahun.",
        price: 35000,
        salePrice: null,
        sku: "KAU001",
        stock: 35,
        images: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
        ],
        tags: ["kerudung anak", "unicorn", "lucu", "voal"],
        weight: 60,
        isActive: true,
        isFeatured: true,
        categoryId: categories[4].id
      },
      {
        name: "Kerudung Anak Motif Hello Kitty",
        slug: "kerudung-anak-motif-hello-kitty",
        description: "Kerudung anak dengan motif Hello Kitty yang menggemaskan. Bahan berkualitas dan warna yang tidak mudah pudar. Perfect untuk anak-anak yang suka karakter lucu.",
        price: 38000,
        salePrice: null,
        sku: "KAH001",
        stock: 28,
        images: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
        ],
        tags: ["kerudung anak", "hello kitty", "lucu", "berkualitas"],
        weight: 65,
        isActive: true,
        isFeatured: false,
        categoryId: categories[4].id
      }
    ]

    // ✅ Seed all products
    for (const productData of products) {
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: productData
      })
    }

    console.log("✅ Products berhasil dibuat")
    console.log("🎉 Seeding Azrafqueen Store selesai!")
    
    return {
      success: true,
      categoriesCount: categories.length,
      productsCount: products.length
    }

  } catch (error) {
    console.error("❌ Error seeding data:", error)
    throw error
  }
}

// ✅ FUNCTION: Clear all data (untuk testing)
async function clearAllData() {
  try {
    console.log("🗑️ Menghapus semua data...")
    
    // Delete in order to respect foreign key constraints
    await prisma.orderItem.deleteMany()
    await prisma.payment.deleteMany()  
    await prisma.order.deleteMany()
    await prisma.review.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    
    console.log("✅ Semua data berhasil dihapus")
  } catch (error) {
    console.error("❌ Error menghapus data:", error)
    throw error
  }
}

// ✅ POST: Seed data
export async function POST(req: NextRequest) {
  try {
    console.log("🌱 Starting seed process...")
    
    const result = await seedAzrafqueenData()
    
    return NextResponse.json({
      success: true,
      message: "Data Azrafqueen Store berhasil di-seed!",
      data: {
        categories: result.categoriesCount,
        products: result.productsCount
      }
    })
  } catch (error) {
    console.error("Error seeding data:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Gagal melakukan seed data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// ✅ DELETE: Clear all data
export async function DELETE(req: NextRequest) {
  try {
    console.log("🗑️ Starting clear data process...")
    
    await clearAllData()
    
    return NextResponse.json({
      success: true,
      message: "Semua data berhasil dihapus!"
    })
  } catch (error) {
    console.error("Error clearing data:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Gagal menghapus data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}