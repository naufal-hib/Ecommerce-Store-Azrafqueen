// src/lib/data-converter.ts
import { Product, Category } from "@prisma/client";

// Convert Prisma Decimal and Date objects to JSON-serializable types
export function convertProductForClient(product: Product & { category?: Category }) {
  return {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    weight: product.weight ? Number(product.weight) : undefined,
    createdAt: product.createdAt ? product.createdAt.toISOString() : undefined,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : undefined,
    category: product.category ? {
      ...product.category,
      createdAt: product.category.createdAt ? product.category.createdAt.toISOString() : undefined,
      updatedAt: product.category.updatedAt ? product.category.updatedAt.toISOString() : undefined,
    } : undefined,
  }
}

export function convertCategoryForClient(category: Category) {
  return {
    ...category,
    createdAt: category.createdAt ? category.createdAt.toISOString() : undefined,
    updatedAt: category.updatedAt ? category.updatedAt.toISOString() : undefined,
  }
}

export function convertProductsArrayForClient(products: Product[]) {
  return products.map(product => convertProductForClient(product))
}

export function convertCategoriesArrayForClient(categories: Category[]) {
  return categories.map(category => convertCategoryForClient(category))
}