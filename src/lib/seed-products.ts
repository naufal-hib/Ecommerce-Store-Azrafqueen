import { prisma } from "./prisma"

export async function createSampleProducts() {
  try {
    // First, get the categories
    const categories = await prisma.category.findMany({
      where: {
        slug: {
          in: [
            "jilbab-kerudung-pashmina",
            "abaya",
            "kerudung-anak",
            "baju-muslim-anak-cowok",
            "baju-muslim-anak-cewek",
            "al-quran"
          ]
        }
      }
    })

    // Create a map of category slugs to IDs
    const categoryMap = categories.reduce((acc, category) => {
      acc[category.slug] = category.id
      return acc
    }, {} as Record<string, string>)

    const products = [
      // Jilbab / Kerudung Pashmina
      {
        name: "Jilbab Pashmina Premium Viscose",
        slug: "jilbab-pashmina-premium-viscose",
        description: "Jilbab pashmina premium berbahan viscose yang lembut dan adem. Cocok untuk aktivitas sehari-hari maupun acara formal. Tersedia dalam berbagai warna cantik.",
        price: 75000,
        salePrice: 65000,
        sku: "JPP001",
        stock: 50,
        images: [
          "https://images.unsplash.com/photo-1583391265740-65681bc17bd9?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0401ba4faa9?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["jilbab-kerudung-pashmina"],
        isFeatured: true,
        isActive: true
      },
      {
        name: "Kerudung Pashmina Ceruti Premium",
        slug: "kerudung-pashmina-ceruti-premium",
        description: "Kerudung pashmina berbahan ceruti premium yang ringan dan tidak mudah kusut. Cocok untuk wanita aktif dan muslimah modern.",
        price: 55000,
        salePrice: 45000,
        sku: "KPC001",
        stock: 75,
        images: [
          "https://images.unsplash.com/photo-1601113414712-7ba3d8e9faf5?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1578852612716-6b7d5b12bb0e?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["jilbab-kerudung-pashmina"],
        isFeatured: true,
        isActive: true
      },

      // Abaya
      {
        name: "Abaya Dewasa Import Dubai Premium",
        slug: "abaya-dewasa-import-dubai-premium",
        description: "Abaya dewasa import dari Dubai dengan kualitas premium. Desain elegan dan modern, berbahan berkualitas tinggi yang nyaman dipakai.",
        price: 350000,
        salePrice: 295000,
        sku: "ADI001",
        stock: 20,
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1594224252048-9fa5a8b6aeb1?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["abaya"],
        isFeatured: true,
        isActive: true
      },
      {
        name: "Abaya Bordir Tangan Modern",
        slug: "abaya-bordir-tangan-modern",
        description: "Abaya dengan bordir tangan yang indah dan elegan. Cocok untuk acara spesial dan formal. Tersedia dalam warna hitam dan navy.",
        price: 425000,
        sku: "ABT001",
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1583391265740-9bb14c6e7b5e?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1601123968223-7b2c6de1a78b?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["abaya"],
        isFeatured: false,
        isActive: true
      },

      // Kerudung Anak
      {
        name: "Kerudung Anak Motif Bunga Lucu",
        slug: "kerudung-anak-motif-bunga-lucu",
        description: "Kerudung anak dengan motif bunga yang lucu dan ceria. Berbahan katun yang lembut dan aman untuk kulit anak. Cocok untuk usia 3-12 tahun.",
        price: 35000,
        salePrice: 28000,
        sku: "KAM001",
        stock: 60,
        images: [
          "https://images.unsplash.com/photo-1503944168849-4d3729954726?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["kerudung-anak"],
        isFeatured: true,
        isActive: true
      },
      {
        name: "Hijab Anak Polos Warna Pastel",
        slug: "hijab-anak-polos-warna-pastel",
        description: "Hijab anak model polos dengan warna-warna pastel yang cantik. Mudah dipakai dan nyaman untuk aktivitas anak sehari-hari.",
        price: 30000,
        salePrice: 25000,
        sku: "HAP001",
        stock: 80,
        images: [
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1578852612665-5e5d2e593c11?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["kerudung-anak"],
        isFeatured: false,
        isActive: true
      },

      // Baju Muslim Anak Cowok
      {
        name: "Koko Anak Lengan Panjang Katun Premium",
        slug: "koko-anak-lengan-panjang-katun-premium",
        description: "Baju koko anak lengan panjang berbahan katun premium yang adem dan nyaman. Cocok untuk sholat dan acara formal. Ukuran 1-14 tahun.",
        price: 85000,
        salePrice: 72000,
        sku: "KAL001",
        stock: 45,
        images: [
          "https://images.unsplash.com/photo-1503944168849-4d3729954726?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["baju-muslim-anak-cowok"],
        isFeatured: true,
        isActive: true
      },
      {
        name: "Gamis Anak Laki-laki Model Modern",
        slug: "gamis-anak-laki-laki-model-modern",
        description: "Gamis anak laki-laki dengan desain modern dan trendy. Berbahan katun combed yang lembut dan tidak panas. Cocok untuk anak aktif.",
        price: 95000,
        sku: "GAL001",
        stock: 35,
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1594224252048-9fa5a8b6aeb1?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["baju-muslim-anak-cowok"],
        isFeatured: false,
        isActive: true
      },

      // Baju Muslim Anak Cewek
      {
        name: "Gamis Anak Perempuan Motif Cantik",
        slug: "gamis-anak-perempuan-motif-cantik",
        description: "Gamis anak perempuan dengan motif yang cantik dan feminin. Berbahan katun berkualitas dengan model yang nyaman untuk bermain.",
        price: 110000,
        salePrice: 89000,
        sku: "GAP001",
        stock: 40,
        images: [
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1583391265740-9bb14c6e7b5e?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["baju-muslim-anak-cewek"],
        isFeatured: true,
        isActive: true
      },
      {
        name: "Dress Muslim Anak Perempuan Casual",
        slug: "dress-muslim-anak-perempuan-casual",
        description: "Dress muslim anak perempuan model casual yang cocok untuk sehari-hari. Bahan adem dan desain yang lucu untuk si kecil.",
        price: 75000,
        salePrice: 65000,
        sku: "DMA001",
        stock: 50,
        images: [
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1578852612665-5e5d2e593c11?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["baju-muslim-anak-cewek"],
        isFeatured: true,
        isActive: true
      },

      // Al-Quran
      {
        name: "Al-Quran Terjemahan Bahasa Indonesia",
        slug: "al-quran-terjemahan-bahasa-indonesia",
        description: "Al-Quran dengan terjemahan Bahasa Indonesia yang mudah dipahami. Dilengkapi dengan tajwid dan panduan membaca yang benar.",
        price: 125000,
        salePrice: 99000,
        sku: "AQT001",
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["al-quran"],
        isFeatured: true,
        isActive: true
      },
      {
        name: "Mushaf Al-Quran Tajwid Warna",
        slug: "mushaf-al-quran-tajwid-warna",
        description: "Mushaf Al-Quran dengan tajwid berwarna untuk memudahkan dalam mempelajari bacaan yang benar. Ukuran A5 praktis dibawa kemana-mana.",
        price: 95000,
        sku: "MAQ001",
        stock: 25,
        images: [
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500&h=500&fit=crop"
        ],
        categoryId: categoryMap["al-quran"],
        isFeatured: false,
        isActive: true
      }
    ]

    // Check if products already exist, if not create them
    for (const product of products) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: product.slug }
      })

      if (!existingProduct) {
        await prisma.product.create({
          data: product,
        })
        console.log(`✅ Produk "${product.name}" berhasil dibuat`)
      } else {
        console.log(`⚠️ Produk "${product.name}" sudah ada, dilewati`)
      }
    }

    console.log("✅ Sample products created successfully dengan foto dan deskripsi lengkap")
  } catch (error) {
    console.error("❌ Error creating sample products:", error)
  }
}