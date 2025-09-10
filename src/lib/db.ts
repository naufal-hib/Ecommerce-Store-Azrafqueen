import { prisma } from './prisma'

// Helper function to test database connection
export async function testDbConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Helper function to get all categories
export async function getCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    include: {
      children: true,
    },
  })
}

// Helper function to get featured products
export async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
    },
    take: 8,
  })
}