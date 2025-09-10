// src/app/products/[slug]/page.tsx
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductDetailClient } from "./product-detail-client"

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { 
        slug: slug,
        isActive: true 
      },
      include: {
        category: true,
        reviews: {
          include: {
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
          }
        }
      }
    })

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  try {
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
        id: { not: currentProductId },
        isActive: true
      },
      include: {
        category: true
      },
      take: 4,
      orderBy: {
        createdAt: "desc"
      }
    })

    return relatedProducts
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  return (
    <ProductDetailClient 
      product={product} 
      relatedProducts={relatedProducts}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - Azrafqueen Store`,
    description: product.description || `Buy ${product.name} at the best price`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at the best price`,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}