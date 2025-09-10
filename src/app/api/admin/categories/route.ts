// src/app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().optional(),
})

// GET /api/admin/categories - List all categories (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" }
      ],
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create new category (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = categorySchema.parse(body)

    // Check if slug already exists
    const existingSlug = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      )
    }

    // Set default sort order if not provided
    const sortOrder = validatedData.sortOrder ?? await getNextSortOrder()

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        image: validatedData.images?.[0] || validatedData.image || null,
        images: validatedData.images || [],
        sortOrder,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper function to get next sort order
async function getNextSortOrder(): Promise<number> {
  const lastCategory = await prisma.category.findFirst({
    orderBy: { sortOrder: "desc" }
  })
  return (lastCategory?.sortOrder || 0) + 1
}