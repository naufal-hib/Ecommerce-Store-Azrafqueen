// src/app/api/categories/route.ts - OPTIMIZED VERSION
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

// ✅ OPTIMIZED: GET /api/categories - Much faster queries
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    const includeCount = searchParams.get("includeCount") === "true"
    const onlyActive = searchParams.get("onlyActive") !== "false" // Default true
    const limit = parseInt(searchParams.get("limit") || "50")

    // ✅ PERFORMANCE: Build efficient query
    const where = onlyActive ? { isActive: true } : {}

    let categories

    if (includeCount) {
      // ✅ PERFORMANCE: Optimized query with product count
      categories = await prisma.category.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          images: true,
          isActive: true,
          sortOrder: true,
          _count: {
            select: {
              products: {
                where: { isActive: true }
              }
            }
          }
        },
        orderBy: { sortOrder: "asc" },
        take: limit,
      })
    } else {
      // ✅ PERFORMANCE: Minimal query without count for faster loading
      categories = await prisma.category.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          images: true,
          isActive: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: "asc" },
        take: limit,
      })
    }

    // ✅ PERFORMANCE: Add caching headers
    return new NextResponse(JSON.stringify(categories), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 5 minutes, stale-while-revalidate for 15 minutes
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        'ETag': `"categories-${Date.now().toString().slice(-6)}"`,
      },
    })

  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data kategori" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create category (ADMIN ONLY)
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
      select: { id: true } // Only select id for performance
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      )
    }

    // Get next sort order
    const lastCategory = await prisma.category.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true }
    })

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        sortOrder: validatedData.sortOrder || (lastCategory?.sortOrder || 0) + 1,
        images: validatedData.images || [],
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