// src/app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int().optional(),
})

// GET /api/admin/categories/[id] - Get single category
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        },
        products: {
          where: { isActive: true },
          take: 5,
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
            salePrice: true,
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/categories/[id] - Update category
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
    const validatedData = categoryUpdateSchema.parse(body)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if slug already exists (excluding current category)
    const existingSlug = await prisma.category.findFirst({
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

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...validatedData,
        image: validatedData.images?.[0] || validatedData.image || null,
        images: validatedData.images || [],
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - Delete category
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if category has products
    if (existingCategory.products.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing products. Move products to another category first." },
        { status: 400 }
      )
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}