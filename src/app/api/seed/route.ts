import { NextResponse } from "next/server"
import { createSampleCategories } from "@/lib/seed-categories"
import { createSampleProducts } from "@/lib/seed-products"

export async function POST() {
  try {
    console.log("🌱 Starting database seeding...")

    // 1. Create categories first
    console.log("📂 Creating categories...")
    await createSampleCategories()

    // 2. Create products (depends on categories)
    console.log("📦 Creating products...")
    await createSampleProducts()

    console.log("✅ Seeding completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        categoriesCreated: 6,
        productsCreated: 6
      }
    })
  } catch (error) {
    console.error("❌ Error during seeding:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding database",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check seed status
export async function GET() {
  try {
    // Check if data already exists
    const { prisma } = await import("@/lib/prisma")
    
    const categoriesCount = await prisma.category.count()
    const productsCount = await prisma.product.count()

    return NextResponse.json({
      success: true,
      message: "Seed status checked",
      data: {
        categoriesCount,
        productsCount,
        isSeeded: categoriesCount > 0 && productsCount > 0
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error checking seed status",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}