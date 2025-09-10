import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CategoryClient } from "./category-client"

// Fetch categories server-side
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session || session.user?.role !== "ADMIN") {
    notFound()
  }

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
      </div>

      <CategoryClient initialCategories={categories} />
    </div>
  )
}