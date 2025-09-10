// src/app/api/products/route.ts
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

// GET /api/products - List products with search and filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId") || ""
    const isActive = searchParams.get("isActive")
    const sortBy = searchParams.get("sortBy") || "newest"

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } }
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    // Determine sort order
    let orderBy = {}
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
      case "newest":
      default:
        orderBy = { createdAt: "desc" }
        break
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
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

    return NextResponse.json(product, { status: 201 })
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