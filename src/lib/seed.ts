import { prisma } from "./prisma"
import { createSampleCategories } from "./seed-categories"
import { createSampleProducts } from "./seed-products"

async function main() {
  try {
    console.log("🌱 Mulai seeding database...")

    // 1. Seed Categories
    console.log("📂 Creating categories...")
    await createSampleCategories()

    // Wait a bit to ensure categories are created
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 2. Seed Products
    console.log("📦 Creating products...")
    await createSampleProducts()

    console.log("✅ Seeding completed successfully!")
    
    // Show summary
    const categoriesCount = await prisma.category.count()
    const productsCount = await prisma.product.count()
    
    console.log(`📊 Summary:`)
    console.log(`   - Categories created: ${categoriesCount}`)
    console.log(`   - Products created: ${productsCount}`)
    
  } catch (error) {
    console.error("❌ Error during seeding:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })