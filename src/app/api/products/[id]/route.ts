// src/app/api/products/[id]/route.ts - PERBAIKAN VERSION
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productUpdateSchema = z.object({
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
  isActive: z.boolean(),
  isFeatured: z.boolean(),
})

// ✅ PERBAIKI: GET /api/products/[id] - Get single product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // ✅ OPTIMIZED: Only select necessary fields for better performance
    const product = await prisma.product.findUnique({
      where: { 
        id: id,
        isActive: true  // ✅ TAMBAH: Hanya product yang aktif
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        salePrice: true,
        sku: true,
        stock: true,
        images: true,
        tags: true,
        weight: true,
        dimensions: true,
        isActive: true,
        isFeatured: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        // ✅ OPTIMIZED: Limit reviews untuk performance
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true,
              }
            }
          },
          where: {
            isVisible: true
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10 // ✅ LIMIT: Hanya 10 review terbaru
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      )
    }

    // ✅ PERBAIKI: Convert Decimal to number for client
    const productForClient = {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      weight: product.weight ? Number(product.weight) : null,
    }

    // ✅ PERFORMANCE: Add cache headers
    return new NextResponse(JSON.stringify(productForClient), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 5 minutes
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })

  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product (ADMIN ONLY)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const validatedData = productUpdateSchema.parse(body)

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if SKU already exists (excluding current product)
    const existingSku = await prisma.product.findFirst({
      where: { 
        sku: validatedData.sku,
        id: { not: id }
      },
    })

    if (existingSku) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      )
    }

    // Check if slug already exists (excluding current product)
    const existingSlug = await prisma.product.findFirst({
      where: { 
        slug: validatedData.slug,
        id: { not: id }
      },
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...validatedData,
        price: validatedData.price,
        salePrice: validatedData.salePrice || null,
        tags: validatedData.tags || [],
        weight: validatedData.weight || null,
        dimensions: validatedData.dimensions || null,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    })

    // ✅ PERBAIKI: Convert Decimal to number
    const productForClient = {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      weight: product.weight ? Number(product.weight) : null,
    }

    return NextResponse.json(productForClient)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (ADMIN ONLY)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if product has orders (prevent deletion if it has order history)
    if (existingProduct.orderItems.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete product with existing orders. Consider deactivating instead." },
        { status: 400 }
      )
    }

    // Delete product reviews first
    await prisma.review.deleteMany({
      where: { productId: id }
    })

    // Delete the product
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}