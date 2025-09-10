// src/app/api/products/route.ts - OPTIMIZED VERSION
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().optional(),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  tags: z.array(z.string()).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

// ✅ OPTIMIZED: GET /api/products - Much faster with better queries
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse parameters with defaults
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")))
    const search = searchParams.get("search")?.trim() || ""
    const categoryId = searchParams.get("categoryId")?.trim() || ""
    const isActive = searchParams.get("isActive")
    const sortBy = searchParams.get("sortBy") || "newest"
    const priceRange = searchParams.get("priceRange") || "all"

    const skip = (page - 1) * limit

    // ✅ PERFORMANCE: Build efficient where clause
    const where: any = {
      isActive: isActive === "false" ? false : true,
    }

    // Add search filter with indexed fields
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ]
    }

    // Add category filter
    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId
    }

    // Add price range filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-100k":
          where.price = { lt: 100000 }
          break
        case "100k-300k":
          where.price = { gte: 100000, lt: 300000 }
          break
        case "300k-500k":
          where.price = { gte: 300000, lt: 500000 }
          break
        case "over-500k":
          where.price = { gte: 500000 }
          break
      }
    }

    // ✅ PERFORMANCE: Efficient orderBy
    let orderBy: any = { createdAt: "desc" }
    
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" }
        break
      case "price-high":
        orderBy = { price: "desc" }
        break
      case "name":
        orderBy = { name: "asc" }
        break
      case "featured":
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }]
        break
    }

    // ✅ PERFORMANCE: Parallel queries for better speed
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        select: { // ✅ CRITICAL: Select only needed fields
          id: true,
          name: true,
          slug: true,
          price: true,
          salePrice: true,
          sku: true,
          stock: true,
          images: true,
          isActive: true,
          isFeatured: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy,
        skip,
        take: limit,
      }),
      
      prisma.product.count({ where })
    ])

    // ✅ PERFORMANCE: Batch convert Decimal to number
    const productsForClient = products.map(product => ({
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
    }))

    const totalPages = Math.ceil(totalCount / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    const response = {
      products: productsForClient,
      pagination: {
        current: page,
        pages: totalPages,
        total: totalCount,
        hasNext,
        hasPrev,
        limit
      }
    }

    // ✅ PERFORMANCE: Add aggressive caching headers
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 2 minutes, stale-while-revalidate for 10 minutes
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
        // Add ETag for better caching
        'ETag': `"products-${page}-${limit}-${Date.now().toString().slice(-6)}"`,
      },
    })

  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data produk" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create product (ADMIN ONLY)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = productSchema.parse(body)

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku: validatedData.sku },
      select: { id: true } // Only select id for performance
    })

    if (existingSku) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
      select: { id: true } // Only select id for performance
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
      select: { id: true } // Only select id for performance
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        price: validatedData.price,
        salePrice: validatedData.salePrice || null,
        tags: validatedData.tags || [],
        weight: validatedData.weight || null,
        dimensions: validatedData.dimensions || null,
      },
      include: {
        category: true,
      },
    })

    // Convert Decimal for response
    const productForClient = {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      weight: product.weight ? Number(product.weight) : null,
    }

    return NextResponse.json(productForClient, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}